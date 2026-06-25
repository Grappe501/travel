import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from '@/server/services/expense.service';
import { endTrip, startTrip } from '@/server/services/trip.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('expense.service integration', () => {
  let ctx: TestUserContext;
  let tripId: string;

  beforeAll(async () => {
    ctx = await createTestUserContext();

    const started = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'Expense trip',
      startOdometer: 500,
    });

    const ended = await endTrip(ctx.userId, {
      tripId: started.id,
      endOdometer: 520,
    });

    tripId = ended.id;
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it('creates expense and recalculates trip expense_total', async () => {
    const expense = await createExpense(ctx.userId, {
      businessId: ctx.businessId,
      tripId,
      categorySlug: 'fuel',
      merchant: 'Shell',
      amount: 45.5,
      expenseDate: '2026-06-01',
    });

    expect(expense.amount).toBe(45.5);

    const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
    expect(Number(trip.expenseTotal)).toBe(45.5);
    expect(Number(trip.grandTotal)).toBeGreaterThan(45.5);
  });

  it('updates and soft-deletes expense with trip total recalc', async () => {
    const created = await createExpense(ctx.userId, {
      businessId: ctx.businessId,
      tripId,
      categorySlug: 'parking',
      amount: 12,
      expenseDate: '2026-06-02',
    });

    await updateExpense(ctx.userId, created.id, { amount: 15 });

    let trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
    expect(Number(trip.expenseTotal)).toBe(60.5);

    await deleteExpense(ctx.userId, created.id);

    trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
    expect(Number(trip.expenseTotal)).toBe(45.5);
  });
});
