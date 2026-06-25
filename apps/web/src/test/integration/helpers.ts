import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { prisma } from '@/lib/db/prisma';

export function integrationEnabled(): boolean {
  const url = process.env.DATABASE_URL;
  if (process.env.SKIP_INTEGRATION_TESTS === '1') {
    return false;
  }
  if (process.env.INTEGRATION_TEST !== '1') {
    return false;
  }
  return Boolean(url && !url.includes('placeholder'));
}

export async function verifyDatabaseConnection(): Promise<boolean> {
  if (!integrationEnabled()) {
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export function integrationDbReady(): boolean {
  return process.env.INTEGRATION_DB_READY === 'true';
}

export function repoRootFromWebPackage(): string {
  return path.resolve(process.cwd(), '../..');
}

export type TestUserContext = {
  userId: string;
  email: string;
  businessId: string;
  vehicleId: string;
};

export async function createTestUserContext(): Promise<TestUserContext> {
  const userId = randomUUID();
  const email = `integration-${userId.slice(0, 8)}@test.local`;
  const businessId = randomUUID();
  const vehicleId = randomUUID();

  await prisma.userProfile.create({
    data: {
      id: userId,
      email,
      emailVerified: true,
      onboardingCompleted: true,
      subscription: {
        create: {
          plan: 'free',
          status: 'active',
        },
      },
      businesses: {
        create: {
          id: businessId,
          name: 'Integration Test Business',
          isDefault: true,
        },
      },
      vehicles: {
        create: {
          id: vehicleId,
          businessId,
          nickname: 'Integration Van',
          isDefault: true,
        },
      },
    },
  });

  return { userId, email, businessId, vehicleId };
}

export async function deleteTestUser(userId: string) {
  await prisma.userProfile.deleteMany({ where: { id: userId } });
}

export async function setUsageCounts(
  userId: string,
  counts: { tripsCount?: number; receiptsCount?: number }
) {
  const periodMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));

  await prisma.usageCounter.upsert({
    where: {
      userId_periodMonth: { userId, periodMonth },
    },
    create: {
      userId,
      periodMonth,
      tripsCount: counts.tripsCount ?? 0,
      receiptsCount: counts.receiptsCount ?? 0,
    },
    update: {
      ...(counts.tripsCount !== undefined ? { tripsCount: counts.tripsCount } : {}),
      ...(counts.receiptsCount !== undefined ? { receiptsCount: counts.receiptsCount } : {}),
    },
  });
}
