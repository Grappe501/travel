import type { Prisma, Subscription } from '@prisma/client';
import { SubscriptionLimitError } from '@/lib/api/response';
import {
  FREE_RECEIPTS_PER_MONTH,
  FREE_TRIPS_PER_MONTH,
} from '@/lib/billing/config';
import { isReceiptLimitReached, isTripLimitReached } from '@/lib/billing/usage-limits';
import { prisma } from '@/lib/db/prisma';
import { ensureSubscription, hasUnlimitedUsage } from '@/lib/billing/subscription-access';

function startOfUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function startOfNextUtcMonth(date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

async function getOrCreateCounter(
  userId: string,
  tx: Prisma.TransactionClient = prisma
) {
  const periodMonth = startOfUtcMonth();

  return tx.usageCounter.upsert({
    where: {
      userId_periodMonth: { userId, periodMonth },
    },
    create: {
      userId,
      periodMonth,
    },
    update: {},
  });
}

export async function getUsageSummary(userId: string) {
  const subscription = await ensureSubscription(userId);
  const counter = await getOrCreateCounter(userId);
  const unlimited = hasUnlimitedUsage(subscription);

  return {
    periodMonth: counter.periodMonth.toISOString().slice(0, 10),
    resetsAt: startOfNextUtcMonth().toISOString().slice(0, 10),
    tripsCount: counter.tripsCount,
    tripsLimit: unlimited ? null : FREE_TRIPS_PER_MONTH,
    receiptsCount: counter.receiptsCount,
    receiptsLimit: unlimited ? null : FREE_RECEIPTS_PER_MONTH,
    unlimited,
  };
}

function assertTripLimit(subscription: Subscription, tripsCount: number) {
  if (isTripLimitReached(tripsCount, hasUnlimitedUsage(subscription))) {
    throw new SubscriptionLimitError(
      `You've used all ${FREE_TRIPS_PER_MONTH} trips this month. Upgrade to Pro for unlimited trips.`
    );
  }
}

function assertReceiptLimit(subscription: Subscription, receiptsCount: number) {
  if (isReceiptLimitReached(receiptsCount, hasUnlimitedUsage(subscription))) {
    throw new SubscriptionLimitError(
      `You've used all ${FREE_RECEIPTS_PER_MONTH} receipts this month. Upgrade to Pro for unlimited receipts.`
    );
  }
}

export async function assertCanStartTrip(userId: string, tx: Prisma.TransactionClient = prisma) {
  const subscription = await ensureSubscription(userId);
  const counter = await getOrCreateCounter(userId, tx);
  assertTripLimit(subscription, counter.tripsCount);
}

export async function incrementTripUsage(userId: string, tx: Prisma.TransactionClient = prisma) {
  const subscription = await ensureSubscription(userId);
  if (hasUnlimitedUsage(subscription)) {
    return;
  }

  const periodMonth = startOfUtcMonth();
  const counter = await tx.usageCounter.upsert({
    where: {
      userId_periodMonth: { userId, periodMonth },
    },
    create: {
      userId,
      periodMonth,
      tripsCount: 1,
    },
    update: {
      tripsCount: { increment: 1 },
    },
  });

  if (counter.tripsCount > FREE_TRIPS_PER_MONTH) {
    throw new SubscriptionLimitError(
      `You've used all ${FREE_TRIPS_PER_MONTH} trips this month. Upgrade to Pro for unlimited trips.`
    );
  }
}

export async function assertCanUploadReceipt(
  userId: string,
  tx: Prisma.TransactionClient = prisma
) {
  const subscription = await ensureSubscription(userId);
  const counter = await getOrCreateCounter(userId, tx);
  assertReceiptLimit(subscription, counter.receiptsCount);
}

export async function incrementReceiptUsage(userId: string, tx: Prisma.TransactionClient = prisma) {
  const subscription = await ensureSubscription(userId);
  if (hasUnlimitedUsage(subscription)) {
    return;
  }

  const periodMonth = startOfUtcMonth();
  const counter = await tx.usageCounter.upsert({
    where: {
      userId_periodMonth: { userId, periodMonth },
    },
    create: {
      userId,
      periodMonth,
      receiptsCount: 1,
    },
    update: {
      receiptsCount: { increment: 1 },
    },
  });

  if (counter.receiptsCount > FREE_RECEIPTS_PER_MONTH) {
    throw new SubscriptionLimitError(
      `You've used all ${FREE_RECEIPTS_PER_MONTH} receipts this month. Upgrade to Pro for unlimited receipts.`
    );
  }
}
