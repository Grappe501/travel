import { prisma } from '@/lib/db/prisma';

export type FieldTestTesterRow = {
  id: string;
  email: string;
  displayName: string | null;
  fieldTestLabel: string | null;
  betaJoinedAt: string | null;
  lastLoginAt: string | null;
  onboardingCompleted: boolean;
  tripsTotal: number;
  tripsCompleted: number;
  tripsActive: number;
  gpsTrips: number;
  totalMiles: number;
  receiptsTotal: number;
  expensesTotal: number;
  expenseAmount: number;
};

export type FieldTestOverview = {
  generatedAt: string;
  testerCount: number;
  totals: {
    trips: number;
    completedTrips: number;
    gpsTrips: number;
    miles: number;
    receipts: number;
    expenses: number;
    expenseAmount: number;
  };
  testers: FieldTestTesterRow[];
};

function readBetaJoinedAt(appPrefs: unknown): string | null {
  if (!appPrefs || typeof appPrefs !== 'object') return null;
  const value = (appPrefs as Record<string, unknown>).betaJoinedAt;
  return typeof value === 'string' ? value : null;
}

function readFieldTestLabel(appPrefs: unknown): string | null {
  if (!appPrefs || typeof appPrefs !== 'object') return null;
  const value = (appPrefs as Record<string, unknown>).fieldTestLabel;
  return typeof value === 'string' ? value : null;
}

export async function getFieldTestOverview(): Promise<FieldTestOverview> {
  const profiles = await prisma.userProfile.findMany({
    where: {
      deletedAt: null,
      appPrefs: {
        path: ['betaTester'],
        equals: true,
      },
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      appPrefs: true,
      lastLoginAt: true,
      onboardingCompleted: true,
    },
    orderBy: [{ lastLoginAt: 'desc' }, { createdAt: 'desc' }],
  });

  const ids = profiles.map((p) => p.id);

  if (ids.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      testerCount: 0,
      totals: {
        trips: 0,
        completedTrips: 0,
        gpsTrips: 0,
        miles: 0,
        receipts: 0,
        expenses: 0,
        expenseAmount: 0,
      },
      testers: [],
    };
  }

  const [tripGroups, receiptGroups, expenseGroups, milesAgg] = await Promise.all([
    prisma.trip.groupBy({
      by: ['userId', 'status'],
      where: { userId: { in: ids }, recordStatus: 'active' },
      _count: { _all: true },
    }),
    prisma.receipt.groupBy({
      by: ['userId'],
      where: { userId: { in: ids }, recordStatus: 'active' },
      _count: { _all: true },
    }),
    prisma.expense.groupBy({
      by: ['userId'],
      where: { userId: { in: ids }, recordStatus: 'active' },
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prisma.trip.groupBy({
      by: ['userId'],
      where: {
        userId: { in: ids },
        recordStatus: 'active',
        status: 'completed',
        miles: { not: null },
      },
      _sum: { miles: true },
      _count: {
        _all: true,
      },
    }),
  ]);

  const gpsTrips = await prisma.trip.groupBy({
    by: ['userId'],
    where: {
      userId: { in: ids },
      recordStatus: 'active',
      trackingEnabled: true,
    },
    _count: { _all: true },
  });

  const tripCountMap = new Map<string, { total: number; completed: number; active: number }>();
  for (const row of tripGroups) {
    const current = tripCountMap.get(row.userId) ?? { total: 0, completed: 0, active: 0 };
    current.total += row._count._all;
    if (row.status === 'completed') current.completed += row._count._all;
    if (row.status === 'active') current.active += row._count._all;
    tripCountMap.set(row.userId, current);
  }

  const receiptMap = new Map(receiptGroups.map((r) => [r.userId, r._count._all]));
  const expenseMap = new Map(
    expenseGroups.map((e) => [e.userId, { count: e._count._all, amount: Number(e._sum.amount ?? 0) }])
  );
  const milesMap = new Map(
    milesAgg.map((m) => [m.userId, Number(m._sum.miles ?? 0)])
  );
  const gpsMap = new Map(gpsTrips.map((g) => [g.userId, g._count._all]));

  const testers: FieldTestTesterRow[] = profiles.map((profile) => {
    const trips = tripCountMap.get(profile.id) ?? { total: 0, completed: 0, active: 0 };
    const expenses = expenseMap.get(profile.id) ?? { count: 0, amount: 0 };

    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      fieldTestLabel: readFieldTestLabel(profile.appPrefs),
      betaJoinedAt: readBetaJoinedAt(profile.appPrefs),
      lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
      onboardingCompleted: profile.onboardingCompleted,
      tripsTotal: trips.total,
      tripsCompleted: trips.completed,
      tripsActive: trips.active,
      gpsTrips: gpsMap.get(profile.id) ?? 0,
      totalMiles: milesMap.get(profile.id) ?? 0,
      receiptsTotal: receiptMap.get(profile.id) ?? 0,
      expensesTotal: expenses.count,
      expenseAmount: expenses.amount,
    };
  });

  const totals = testers.reduce(
    (acc, row) => {
      acc.trips += row.tripsTotal;
      acc.completedTrips += row.tripsCompleted;
      acc.gpsTrips += row.gpsTrips;
      acc.miles += row.totalMiles;
      acc.receipts += row.receiptsTotal;
      acc.expenses += row.expensesTotal;
      acc.expenseAmount += row.expenseAmount;
      return acc;
    },
    {
      trips: 0,
      completedTrips: 0,
      gpsTrips: 0,
      miles: 0,
      receipts: 0,
      expenses: 0,
      expenseAmount: 0,
    }
  );

  return {
    generatedAt: new Date().toISOString(),
    testerCount: testers.length,
    totals,
    testers,
  };
}

export function fieldTestOverviewToCsv(overview: FieldTestOverview): string {
  const headers = [
    'Email',
    'Name',
    'Field label',
    'Joined',
    'Last login',
    'Onboarding',
    'Trips',
    'Completed',
    'Active',
    'GPS trips',
    'Miles',
    'Receipts',
    'Expenses',
    'Expense total',
  ];

  const rows = overview.testers.map((row) =>
    [
      row.email,
      row.displayName ?? '',
      row.fieldTestLabel ?? '',
      row.betaJoinedAt ?? '',
      row.lastLoginAt ?? '',
      row.onboardingCompleted ? 'yes' : 'no',
      row.tripsTotal,
      row.tripsCompleted,
      row.tripsActive,
      row.gpsTrips,
      row.totalMiles,
      row.receiptsTotal,
      row.expensesTotal,
      row.expenseAmount.toFixed(2),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
