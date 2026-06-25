import { prisma } from '@/lib/db/prisma';

const activeRecord = { recordStatus: 'active' as const };

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function startOfMonthUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export type DashboardSummary = {
  todayMiles: number;
  todayReimbursement: number;
  monthMiles: number;
  monthExpenses: number;
  monthReimbursement: number;
  pendingReviewCount: number;
  unlinkedReceiptCount: number;
  unlinkedExpenseCount: number;
  recentTripsWithoutExpenses: number;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const todayStart = startOfTodayUtc();
  const monthStart = startOfMonthUtc();
  const recentCutoff = new Date();
  recentCutoff.setUTCDate(recentCutoff.getUTCDate() - 30);

  const [
    todayTrips,
    monthTrips,
    monthExpenseAggregate,
    pendingReviewCount,
    unlinkedReceiptCount,
    unlinkedExpenseCount,
    recentTripsWithoutExpenses,
  ] = await Promise.all([
    prisma.trip.aggregate({
      where: {
        userId,
        ...activeRecord,
        status: 'completed',
        endedAt: { gte: todayStart },
      },
      _sum: { miles: true, reimbursementAmount: true },
    }),
    prisma.trip.aggregate({
      where: {
        userId,
        ...activeRecord,
        status: 'completed',
        endedAt: { gte: monthStart },
      },
      _sum: { miles: true, reimbursementAmount: true, expenseTotal: true },
    }),
    prisma.expense.aggregate({
      where: {
        userId,
        ...activeRecord,
        expenseDate: { gte: monthStart },
      },
      _sum: { amount: true },
    }),
    prisma.receipt.count({
      where: {
        userId,
        ...activeRecord,
        reviewStatus: { not: 'confirmed' },
      },
    }),
    prisma.receipt.count({
      where: {
        userId,
        ...activeRecord,
        tripId: null,
      },
    }),
    prisma.expense.count({
      where: {
        userId,
        ...activeRecord,
        tripId: null,
      },
    }),
    prisma.trip.count({
      where: {
        userId,
        ...activeRecord,
        status: 'completed',
        endedAt: { gte: recentCutoff },
        OR: [{ expenseTotal: null }, { expenseTotal: 0 }],
      },
    }),
  ]);

  return {
    todayMiles: todayTrips._sum.miles ? Number(todayTrips._sum.miles) : 0,
    todayReimbursement: todayTrips._sum.reimbursementAmount
      ? Number(todayTrips._sum.reimbursementAmount)
      : 0,
    monthMiles: monthTrips._sum.miles ? Number(monthTrips._sum.miles) : 0,
    monthExpenses: monthExpenseAggregate._sum.amount
      ? Number(monthExpenseAggregate._sum.amount)
      : monthTrips._sum.expenseTotal
        ? Number(monthTrips._sum.expenseTotal)
        : 0,
    monthReimbursement: monthTrips._sum.reimbursementAmount
      ? Number(monthTrips._sum.reimbursementAmount)
      : 0,
    pendingReviewCount,
    unlinkedReceiptCount,
    unlinkedExpenseCount,
    recentTripsWithoutExpenses,
  };
}
