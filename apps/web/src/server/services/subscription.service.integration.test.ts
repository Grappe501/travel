import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import { hasUnlimitedUsage } from '@/lib/billing/subscription-access';
import { getBillingSummary } from '@/server/services/subscription.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('subscription.service integration', () => {
  let ctx: TestUserContext;

  beforeAll(async () => {
    ctx = await createTestUserContext();
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it('returns free tier limits in billing summary', async () => {
    const summary = await getBillingSummary(ctx.userId);

    expect(summary.subscription.plan).toBe('free');
    expect(summary.usage.unlimited).toBe(false);
    expect(summary.usage.tripsLimit).toBe(5);
    expect(summary.usage.receiptsLimit).toBe(10);
  });

  it('reflects unlimited usage for active pro plan', async () => {
    const updated = await prisma.subscription.update({
      where: { userId: ctx.userId },
      data: { plan: 'pro', status: 'active' },
    });

    expect(hasUnlimitedUsage(updated)).toBe(true);

    const summary = await getBillingSummary(ctx.userId);
    expect(summary.usage.unlimited).toBe(true);
    expect(summary.usage.tripsLimit).toBeNull();
    expect(summary.usage.receiptsLimit).toBeNull();
  });

  it('does not grant unlimited usage for canceled pro plan', async () => {
    const updated = await prisma.subscription.update({
      where: { userId: ctx.userId },
      data: { plan: 'pro', status: 'canceled' },
    });

    expect(hasUnlimitedUsage(updated)).toBe(false);
  });
});
