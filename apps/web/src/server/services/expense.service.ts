import type { Expense, Prisma } from '@prisma/client';
import {
  expenseCreateSchema,
  expenseListQuerySchema,
  expenseUpdateSchema,
  receiptAttachSchema,
  type ExpenseCreateInput,
  type ExpenseListQuery,
  type ExpenseUpdateInput,
  type ReceiptAttachInput,
} from '@mileage-copilot/shared';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';
import { getOwnedReceipt } from '@/server/services/receipt.service';
import { getOwnedTrip } from '@/server/services/trip.service';

const activeExpense = { recordStatus: 'active' as const };

type ExpenseWithRelations = Expense & {
  business: { id: string; name: string };
  trip: { id: string; purpose: string } | null;
  receipt: { id: string; merchant: string | null } | null;
};

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function endOfDayUtc(value: string): Date {
  return new Date(`${value}T23:59:59.999Z`);
}

export function serializeExpense(expense: ExpenseWithRelations) {
  return {
    id: expense.id,
    businessId: expense.businessId,
    businessName: expense.business.name,
    tripId: expense.tripId,
    tripPurpose: expense.trip?.purpose ?? null,
    receiptId: expense.receiptId,
    receiptMerchant: expense.receipt?.merchant ?? null,
    categorySlug: expense.categorySlug,
    merchant: expense.merchant,
    amount: Number(expense.amount),
    taxAmount: expense.taxAmount ? Number(expense.taxAmount) : null,
    currency: expense.currency,
    expenseDate: expense.expenseDate.toISOString().slice(0, 10),
    paymentMethod: expense.paymentMethod,
    notes: expense.notes,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  };
}

export type SerializedExpense = ReturnType<typeof serializeExpense>;

const expenseInclude = {
  business: { select: { id: true, name: true } },
  trip: { select: { id: true, purpose: true } },
  receipt: { select: { id: true, merchant: true } },
} as const;

export async function recalculateTripExpenseTotal(
  userId: string,
  tripId: string,
  tx: Prisma.TransactionClient = prisma
) {
  const trip = await tx.trip.findFirst({
    where: { id: tripId, userId, recordStatus: 'active' },
  });

  if (!trip) {
    return;
  }

  const aggregate = await tx.expense.aggregate({
    where: { tripId, userId, ...activeExpense },
    _sum: { amount: true },
  });

  const expenseTotal = aggregate._sum.amount ? Number(aggregate._sum.amount) : 0;
  const reimbursementAmount = trip.reimbursementAmount ? Number(trip.reimbursementAmount) : null;
  const grandTotal =
    reimbursementAmount !== null ? reimbursementAmount + expenseTotal : expenseTotal > 0 ? expenseTotal : null;

  await tx.trip.update({
    where: { id: tripId },
    data: { expenseTotal, grandTotal },
  });
}

async function assertTripForBusiness(userId: string, businessId: string, tripId?: string | null) {
  if (!tripId) {
    return null;
  }

  const trip = await getOwnedTrip(userId, tripId);
  if (trip.businessId !== businessId) {
    throw new ValidationError('Trip does not belong to the selected business');
  }

  return trip;
}

export async function listExpenses(userId: string, queryInput: ExpenseListQuery = {}) {
  const query = expenseListQuerySchema.parse(queryInput);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      ...activeExpense,
      ...(query.categorySlug ? { categorySlug: query.categorySlug } : {}),
      ...(query.tripId ? { tripId: query.tripId } : {}),
      ...(query.businessId ? { businessId: query.businessId } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            expenseDate: {
              ...(query.dateFrom ? { gte: parseDateOnly(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: endOfDayUtc(query.dateTo) } : {}),
            },
          }
        : {}),
    },
    include: expenseInclude,
    orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
  });

  return expenses.map(serializeExpense);
}

export async function getOwnedExpense(userId: string, expenseId: string) {
  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, userId, ...activeExpense },
    include: expenseInclude,
  });

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  return expense;
}

export async function createExpense(userId: string, input: ExpenseCreateInput) {
  const data = expenseCreateSchema.parse(input);

  await getOwnedBusiness(userId, data.businessId);
  await assertTripForBusiness(userId, data.businessId, data.tripId);

  const expense = await prisma.$transaction(async (tx) => {
    const created = await tx.expense.create({
      data: {
        userId,
        businessId: data.businessId,
        tripId: data.tripId,
        categorySlug: data.categorySlug,
        merchant: data.merchant,
        amount: data.amount,
        taxAmount: data.taxAmount,
        currency: data.currency ?? 'USD',
        expenseDate: parseDateOnly(data.expenseDate),
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
      include: expenseInclude,
    });

    if (data.tripId) {
      await recalculateTripExpenseTotal(userId, data.tripId, tx);
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'expense',
        entityId: created.id,
        action: 'create',
        newValues: {
          amount: data.amount,
          categorySlug: data.categorySlug,
          tripId: data.tripId ?? null,
        },
        source: 'web',
      },
    });

    await tx.businessEvent.create({
      data: {
        userId,
        businessId: data.businessId,
        eventType: 'expense.created',
        entityType: 'expense',
        entityId: created.id,
        payload: { categorySlug: data.categorySlug, amount: data.amount, manual: true },
        occurredAt: new Date(),
      },
    });

    return created;
  });

  return serializeExpense(expense);
}

export type CreateExpenseFromReceiptInput = {
  userId: string;
  receiptId: string;
  businessId: string;
  tripId?: string | null;
  categorySlug: string;
  merchant: string;
  amount: number;
  taxAmount?: number | null;
  currency: string;
  expenseDate: Date;
};

export async function createExpenseFromReceipt(
  tx: Prisma.TransactionClient,
  input: CreateExpenseFromReceiptInput
) {
  const existing = await tx.expense.findFirst({
    where: { receiptId: input.receiptId, ...activeExpense },
  });

  if (existing) {
    throw new ConflictError('An expense already exists for this receipt');
  }

  const expense = await tx.expense.create({
    data: {
      userId: input.userId,
      businessId: input.businessId,
      tripId: input.tripId ?? null,
      receiptId: input.receiptId,
      categorySlug: input.categorySlug,
      merchant: input.merchant,
      amount: input.amount,
      taxAmount: input.taxAmount ?? null,
      currency: input.currency,
      expenseDate: input.expenseDate,
    },
    include: expenseInclude,
  });

  if (input.tripId) {
    await recalculateTripExpenseTotal(input.userId, input.tripId, tx);
  }

  await tx.businessEvent.create({
    data: {
      userId: input.userId,
      businessId: input.businessId,
      eventType: 'expense.created',
      entityType: 'expense',
      entityId: expense.id,
      payload: {
        receiptId: input.receiptId,
        categorySlug: input.categorySlug,
        amount: input.amount,
      },
      occurredAt: new Date(),
    },
  });

  return expense;
}

export async function updateExpense(userId: string, expenseId: string, input: ExpenseUpdateInput) {
  const data = expenseUpdateSchema.parse(input);
  const existing = await getOwnedExpense(userId, expenseId);

  const businessId = data.businessId ?? existing.businessId;
  if (data.businessId) {
    await getOwnedBusiness(userId, data.businessId);
  }

  if (data.tripId !== undefined && data.tripId) {
    await assertTripForBusiness(userId, businessId, data.tripId);
  }

  const expense = await prisma.$transaction(async (tx) => {
    const updated = await tx.expense.update({
      where: { id: expenseId },
      data: {
        ...(data.businessId !== undefined ? { businessId: data.businessId } : {}),
        ...(data.tripId !== undefined ? { tripId: data.tripId } : {}),
        ...(data.categorySlug !== undefined ? { categorySlug: data.categorySlug } : {}),
        ...(data.merchant !== undefined ? { merchant: data.merchant } : {}),
        ...(data.amount !== undefined ? { amount: data.amount } : {}),
        ...(data.taxAmount !== undefined ? { taxAmount: data.taxAmount } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.expenseDate !== undefined
          ? { expenseDate: parseDateOnly(data.expenseDate) }
          : {}),
        ...(data.paymentMethod !== undefined ? { paymentMethod: data.paymentMethod } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: expenseInclude,
    });

    const tripsToRecalc = new Set<string>();
    if (existing.tripId) tripsToRecalc.add(existing.tripId);
    if (updated.tripId) tripsToRecalc.add(updated.tripId);

    for (const tripId of tripsToRecalc) {
      await recalculateTripExpenseTotal(userId, tripId, tx);
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'expense',
        entityId: expenseId,
        action: 'update',
        oldValues: { amount: Number(existing.amount), tripId: existing.tripId },
        newValues: { amount: Number(updated.amount), tripId: updated.tripId },
        source: 'web',
      },
    });

    return updated;
  });

  return serializeExpense(expense);
}

export async function deleteExpense(userId: string, expenseId: string) {
  const existing = await getOwnedExpense(userId, expenseId);

  await prisma.$transaction(async (tx) => {
    await tx.expense.update({
      where: { id: expenseId },
      data: {
        recordStatus: 'deleted',
        deletedAt: new Date(),
      },
    });

    if (existing.tripId) {
      await recalculateTripExpenseTotal(userId, existing.tripId, tx);
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'expense',
        entityId: expenseId,
        action: 'delete',
        oldValues: { amount: Number(existing.amount) },
        source: 'web',
      },
    });
  });

  return { id: expenseId, deleted: true };
}

export async function attachReceiptToTrip(
  userId: string,
  receiptId: string,
  input: ReceiptAttachInput
) {
  const data = receiptAttachSchema.parse(input);
  const receipt = await getOwnedReceipt(userId, receiptId);

  const businessId = data.businessId ?? receipt.businessId;
  if (!businessId) {
    throw new ValidationError('Business is required to attach a receipt to a trip');
  }

  await getOwnedBusiness(userId, businessId);
  const trip = await assertTripForBusiness(userId, businessId, data.tripId);
  if (!trip) {
    throw new ValidationError('Trip is required');
  }

  const previousTripId = receipt.tripId;

  const result = await prisma.$transaction(async (tx) => {
    await tx.receipt.update({
      where: { id: receiptId },
      data: {
        tripId: data.tripId,
        businessId,
      },
    });

    const linkedExpense = await tx.expense.findFirst({
      where: { receiptId, userId, ...activeExpense },
    });

    if (linkedExpense) {
      await tx.expense.update({
        where: { id: linkedExpense.id },
        data: {
          tripId: data.tripId,
          businessId,
        },
      });
    }

    const tripsToRecalc = new Set<string>([data.tripId]);
    if (previousTripId && previousTripId !== data.tripId) {
      tripsToRecalc.add(previousTripId);
    }
    if (linkedExpense?.tripId && linkedExpense.tripId !== data.tripId) {
      tripsToRecalc.add(linkedExpense.tripId);
    }

    for (const tripId of tripsToRecalc) {
      await recalculateTripExpenseTotal(userId, tripId, tx);
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'receipt',
        entityId: receiptId,
        action: 'update',
        newValues: { tripId: data.tripId, businessId },
        source: 'web',
      },
    });

    return { receiptId, tripId: data.tripId, expenseId: linkedExpense?.id ?? null };
  });

  return result;
}

export async function listExpensesForTrip(userId: string, tripId: string) {
  await getOwnedTrip(userId, tripId);
  return listExpenses(userId, { tripId });
}

export async function listUnlinkedExpensesForBusiness(userId: string, businessId: string) {
  await getOwnedBusiness(userId, businessId);

  const expenses = await prisma.expense.findMany({
    where: { userId, businessId, tripId: null, ...activeExpense },
    include: expenseInclude,
    orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
    take: 20,
  });

  return expenses.map(serializeExpense);
}
