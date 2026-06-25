import type { Prisma } from '@prisma/client';
import type { RestorableEntityType } from '@mileage-copilot/shared';
import { NotFoundError, ValidationError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { recalculateTripExpenseTotal } from '@/server/services/expense.service';

type DeleteSnapshot = Record<string, unknown>;

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

async function getLatestDeleteAudit(userId: string, entityType: string, entityId: string) {
  const audit = await prisma.auditLog.findFirst({
    where: { userId, entityType, entityId, action: 'delete' },
    orderBy: { createdAt: 'desc' },
  });

  if (!audit) {
    throw new NotFoundError('Nothing to restore for this entry');
  }

  const restoredAfter = await prisma.auditLog.findFirst({
    where: {
      userId,
      entityType,
      entityId,
      action: 'restore',
      createdAt: { gt: audit.createdAt },
    },
  });

  if (restoredAfter) {
    throw new ValidationError('This entry was already restored');
  }

  return audit;
}

async function restoreExpense(userId: string, expenseId: string, snapshot: DeleteSnapshot) {
  const expense = await prisma.expense.findFirst({ where: { id: expenseId, userId } });
  if (!expense || expense.recordStatus !== 'deleted') {
    throw new NotFoundError('Expense not found or not deleted');
  }

  await prisma.$transaction(async (tx) => {
    await tx.expense.update({
      where: { id: expenseId },
      data: {
        recordStatus: 'active',
        deletedAt: null,
        tripId: typeof snapshot.tripId === 'string' ? snapshot.tripId : expense.tripId,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'expense',
        entityId: expenseId,
        action: 'restore',
        source: 'web',
      },
    });
  });

  const restored = await prisma.expense.findFirst({ where: { id: expenseId, userId } });
  if (restored?.tripId) {
    await recalculateTripExpenseTotal(userId, restored.tripId);
  }

  return { id: expenseId, restored: true };
}

async function restoreTrip(userId: string, tripId: string, snapshot: DeleteSnapshot) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip || trip.recordStatus !== 'deleted') {
    throw new NotFoundError('Trip not found or not deleted');
  }

  const previousStatus = typeof snapshot.status === 'string' ? snapshot.status : 'completed';
  if (previousStatus === 'draft') {
    throw new ValidationError('Draft trips cannot be restored');
  }

  const unlinkedExpenseIds = asStringArray(snapshot.unlinkedExpenseIds);
  const unlinkedReceiptIds = asStringArray(snapshot.unlinkedReceiptIds);

  await prisma.$transaction(async (tx) => {
    await tx.trip.update({
      where: { id: tripId },
      data: {
        recordStatus: 'active',
        status: previousStatus as 'active' | 'completed',
        deletedAt: null,
      },
    });

    if (unlinkedExpenseIds.length > 0) {
      await tx.expense.updateMany({
        where: { id: { in: unlinkedExpenseIds }, userId, recordStatus: 'active' },
        data: { tripId },
      });
    }

    if (unlinkedReceiptIds.length > 0) {
      await tx.receipt.updateMany({
        where: { id: { in: unlinkedReceiptIds }, userId, recordStatus: 'active' },
        data: { tripId },
      });
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'trip',
        entityId: tripId,
        action: 'restore',
        source: 'web',
      },
    });
  });

  await recalculateTripExpenseTotal(userId, tripId);
  return { id: tripId, restored: true };
}

async function restoreReceipt(userId: string, receiptId: string, snapshot: DeleteSnapshot) {
  const receipt = await prisma.receipt.findFirst({ where: { id: receiptId, userId } });
  if (!receipt || receipt.recordStatus !== 'deleted') {
    throw new NotFoundError('Receipt not found or not deleted');
  }

  const linkedExpenseIds = asStringArray(snapshot.linkedExpenseIds);
  const tripId = typeof snapshot.tripId === 'string' ? snapshot.tripId : receipt.tripId;

  await prisma.$transaction(async (tx) => {
    await tx.receipt.update({
      where: { id: receiptId },
      data: {
        recordStatus: 'active',
        deletedAt: null,
        tripId,
      },
    });

    if (linkedExpenseIds.length > 0) {
      await tx.expense.updateMany({
        where: { id: { in: linkedExpenseIds }, userId },
        data: { recordStatus: 'active', deletedAt: null },
      });
    }

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'receipt',
        entityId: receiptId,
        action: 'restore',
        source: 'web',
      },
    });
  });

  const tripIds = new Set<string>();
  if (tripId) tripIds.add(tripId);
  for (const expenseId of linkedExpenseIds) {
    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, userId },
      select: { tripId: true },
    });
    if (expense?.tripId) tripIds.add(expense.tripId);
  }
  for (const id of tripIds) {
    await recalculateTripExpenseTotal(userId, id);
  }

  return { id: receiptId, restored: true };
}

async function restoreReport(userId: string, reportId: string, snapshot: DeleteSnapshot) {
  const existing = await prisma.report.findFirst({ where: { id: reportId, userId } });
  if (existing) {
    throw new ValidationError('Report already exists');
  }

  const row = snapshot.report as Record<string, unknown> | undefined;
  if (!row) {
    throw new ValidationError('Cannot restore this report');
  }

  await prisma.$transaction(async (tx) => {
    await tx.report.create({
      data: {
        id: reportId,
        userId,
        businessId: typeof row.businessId === 'string' ? row.businessId : null,
        reportType: row.reportType as 'mileage' | 'expense' | 'combined',
        dateRangeStart: new Date(String(row.dateRangeStart)),
        dateRangeEnd: new Date(String(row.dateRangeEnd)),
        format: row.format as 'pdf' | 'csv' | 'xlsx',
        filters: row.filters as Prisma.InputJsonValue | undefined,
        storagePath: typeof row.storagePath === 'string' ? row.storagePath : null,
        fileHash: typeof row.fileHash === 'string' ? row.fileHash : null,
        fileSizeBytes: typeof row.fileSizeBytes === 'number' ? row.fileSizeBytes : null,
        status: row.status as 'pending' | 'ready' | 'failed' | 'expired',
        errorMessage: typeof row.errorMessage === 'string' ? row.errorMessage : null,
        generatedAt: row.generatedAt ? new Date(String(row.generatedAt)) : null,
        expiresAt: row.expiresAt ? new Date(String(row.expiresAt)) : null,
        createdAt: row.createdAt ? new Date(String(row.createdAt)) : undefined,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'report',
        entityId: reportId,
        action: 'restore',
        source: 'web',
      },
    });
  });

  return { id: reportId, restored: true };
}

async function restoreClient(userId: string, clientId: string, snapshot: DeleteSnapshot) {
  const client = await prisma.client.findFirst({ where: { id: clientId, userId } });
  if (!client || client.recordStatus !== 'deleted') {
    throw new NotFoundError('Client not found or not deleted');
  }

  const tripIds = asStringArray(snapshot.tripIds);
  const projectIds = asStringArray(snapshot.projectIds);

  await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id: clientId },
      data: { recordStatus: 'active', deletedAt: null },
    });

    if (tripIds.length > 0) {
      await tx.trip.updateMany({ where: { id: { in: tripIds }, userId }, data: { clientId } });
    }
    if (projectIds.length > 0) {
      await tx.project.updateMany({ where: { id: { in: projectIds }, userId }, data: { clientId } });
    }

    await tx.auditLog.create({
      data: { userId, entityType: 'client', entityId: clientId, action: 'restore', source: 'web' },
    });
  });

  return { id: clientId, restored: true };
}

async function restoreProject(userId: string, projectId: string, snapshot: DeleteSnapshot) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project || project.recordStatus !== 'deleted') {
    throw new NotFoundError('Project not found or not deleted');
  }

  const tripIds = asStringArray(snapshot.tripIds);

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: projectId },
      data: { recordStatus: 'active', deletedAt: null },
    });

    if (tripIds.length > 0) {
      await tx.trip.updateMany({ where: { id: { in: tripIds }, userId }, data: { projectId } });
    }

    await tx.auditLog.create({
      data: { userId, entityType: 'project', entityId: projectId, action: 'restore', source: 'web' },
    });
  });

  return { id: projectId, restored: true };
}

async function restoreBusiness(userId: string, businessId: string) {
  const business = await prisma.business.findFirst({ where: { id: businessId, userId } });
  if (!business || business.recordStatus !== 'deleted') {
    throw new NotFoundError('Business not found or not deleted');
  }

  await prisma.$transaction(async (tx) => {
    await tx.business.update({
      where: { id: businessId },
      data: { recordStatus: 'active', deletedAt: null },
    });
    await tx.auditLog.create({
      data: { userId, entityType: 'business', entityId: businessId, action: 'restore', source: 'web' },
    });
  });

  return { id: businessId, restored: true };
}

async function restoreVehicle(userId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, userId } });
  if (!vehicle || vehicle.recordStatus !== 'deleted') {
    throw new NotFoundError('Vehicle not found or not deleted');
  }

  await prisma.$transaction(async (tx) => {
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { recordStatus: 'active', deletedAt: null },
    });
    await tx.auditLog.create({
      data: { userId, entityType: 'vehicle', entityId: vehicleId, action: 'restore', source: 'web' },
    });
  });

  return { id: vehicleId, restored: true };
}

export async function restoreEntity(
  userId: string,
  entityType: RestorableEntityType,
  entityId: string
) {
  const audit = await getLatestDeleteAudit(userId, entityType, entityId);
  const snapshot = (audit.oldValues ?? {}) as DeleteSnapshot;

  switch (entityType) {
    case 'expense':
      return restoreExpense(userId, entityId, snapshot);
    case 'trip':
      return restoreTrip(userId, entityId, snapshot);
    case 'receipt':
      return restoreReceipt(userId, entityId, snapshot);
    case 'report':
      return restoreReport(userId, entityId, snapshot);
    case 'client':
      return restoreClient(userId, entityId, snapshot);
    case 'project':
      return restoreProject(userId, entityId, snapshot);
    case 'business':
      return restoreBusiness(userId, entityId);
    case 'vehicle':
      return restoreVehicle(userId, entityId);
    default:
      throw new ValidationError('Unsupported entity type');
  }
}
