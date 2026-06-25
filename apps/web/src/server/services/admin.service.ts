import { NotFoundError, ValidationError } from '@/lib/api/response';
import { APP_RELEASE } from '@/lib/app-release';
import { isNotificationsSchemaReady, isV12SchemaReady } from '@/lib/db/schema-health';
import { getBuildMetadata, getDependencyFlags } from '@/lib/monitoring/config';
import { evaluateProductionReadiness } from '@/lib/monitoring/production-readiness';
import { prisma } from '@/lib/db/prisma';
import { ensureSubscription, serializeSubscription } from '@/server/services/subscription.service';
import { getUsageSummary } from '@/server/services/usage.service';

const RECENT_WINDOW_DAYS = 30;

export type AdminUserLookup = {
  id: string;
  email: string;
  displayName: string | null;
  accountStatus: string;
  onboardingCompleted: boolean;
  createdAt: string;
};

export type AdminUserSummary = AdminUserLookup & {
  subscription: ReturnType<typeof serializeSubscription>;
  usage: Awaited<ReturnType<typeof getUsageSummary>>;
  counts: {
    tripsTotal: number;
    receiptsTotal: number;
    expensesTotal: number;
    businessesTotal: number;
    tripsRecent: number;
    receiptsRecent: number;
  };
};

export async function lookupUserByEmail(email: string): Promise<AdminUserLookup> {
  const normalized = email.trim();
  if (!normalized) {
    throw new ValidationError('Email is required');
  }

  const profile = await prisma.userProfile.findFirst({
    where: {
      email: { equals: normalized, mode: 'insensitive' },
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      accountStatus: true,
      onboardingCompleted: true,
      createdAt: true,
    },
  });

  if (!profile) {
    throw new NotFoundError('User not found');
  }

  if (profile.email.toLowerCase() !== normalized.toLowerCase()) {
    throw new NotFoundError('User not found');
  }

  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    accountStatus: profile.accountStatus,
    onboardingCompleted: profile.onboardingCompleted,
    createdAt: profile.createdAt.toISOString(),
  };
}

export async function getUserSummary(userId: string): Promise<AdminUserSummary> {
  const profile = await prisma.userProfile.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      email: true,
      displayName: true,
      accountStatus: true,
      onboardingCompleted: true,
      createdAt: true,
    },
  });

  if (!profile) {
    throw new NotFoundError('User not found');
  }

  const recentSince = new Date();
  recentSince.setDate(recentSince.getDate() - RECENT_WINDOW_DAYS);

  const [
    subscription,
    usage,
    tripsTotal,
    receiptsTotal,
    expensesTotal,
    businessesTotal,
    tripsRecent,
    receiptsRecent,
  ] = await Promise.all([
    ensureSubscription(userId),
    getUsageSummary(userId),
    prisma.trip.count({ where: { userId, recordStatus: 'active' } }),
    prisma.receipt.count({ where: { userId, recordStatus: 'active' } }),
    prisma.expense.count({ where: { userId, recordStatus: 'active' } }),
    prisma.business.count({ where: { userId, recordStatus: 'active' } }),
    prisma.trip.count({
      where: { userId, recordStatus: 'active', createdAt: { gte: recentSince } },
    }),
    prisma.receipt.count({
      where: { userId, recordStatus: 'active', createdAt: { gte: recentSince } },
    }),
  ]);

  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    accountStatus: profile.accountStatus,
    onboardingCompleted: profile.onboardingCompleted,
    createdAt: profile.createdAt.toISOString(),
    subscription: serializeSubscription(subscription),
    usage,
    counts: {
      tripsTotal,
      receiptsTotal,
      expensesTotal,
      businessesTotal,
      tripsRecent,
      receiptsRecent,
    },
  };
}

export async function recordAdminUserLookup(
  adminUserId: string,
  targetUserId: string,
  lookedUpEmail: string
) {
  await prisma.auditLog.create({
    data: {
      userId: adminUserId,
      entityType: 'profile',
      entityId: targetUserId,
      action: 'create',
      newValues: {
        adminAction: 'admin.view_user',
        lookedUpEmail,
        targetUserId,
      },
      source: 'web',
    },
  });
}

export async function getAdminSystemHealth() {
  let databaseOk = false;
  let migrationsApplied = false;
  let notificationsReady = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseOk = true;
  } catch {
    databaseOk = false;
  }

  const dependencies = getDependencyFlags();
  const build = getBuildMetadata();

  if (dependencies.databaseConfigured && databaseOk) {
    try {
      migrationsApplied = await isV12SchemaReady();
      notificationsReady = await isNotificationsSchemaReady();
    } catch {
      migrationsApplied = false;
      notificationsReady = false;
    }
  }

  const readiness = evaluateProductionReadiness({
    dependencies,
    migrationsApplied,
    notificationsReady,
    build,
  });

  return {
    status: readiness.coreReady && databaseOk ? 'ok' : 'degraded',
    service: 'mileage-expense-copilot',
    version: APP_RELEASE.version,
    slice: APP_RELEASE.slice,
    step: APP_RELEASE.step,
    databaseOk,
    migrationsApplied,
    notificationsReady,
    readiness,
    ...build,
    dependencies,
  };
}
