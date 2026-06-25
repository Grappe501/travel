import type { Subscription } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

const PAID_STATUSES = new Set(['active', 'trialing', 'past_due']);

export function hasUnlimitedUsage(subscription: Pick<Subscription, 'plan' | 'status'>): boolean {
  if (subscription.plan === 'free') {
    return false;
  }

  return PAID_STATUSES.has(subscription.status);
}

export async function ensureSubscription(userId: string) {
  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: 'free',
      status: 'active',
    },
    update: {},
  });
}
