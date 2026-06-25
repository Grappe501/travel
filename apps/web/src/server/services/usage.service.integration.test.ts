import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SubscriptionLimitError } from '@/lib/api/response';
import { FREE_RECEIPTS_PER_MONTH, FREE_TRIPS_PER_MONTH } from '@/lib/billing/config';
import {
  assertCanStartTrip,
  assertCanUploadReceipt,
} from '@/server/services/usage.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  setUsageCounts,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('usage.service integration', () => {
  let ctx: TestUserContext;

  beforeAll(async () => {
    ctx = await createTestUserContext();
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it(`blocks trip start at ${FREE_TRIPS_PER_MONTH} trips used`, async () => {
    await setUsageCounts(ctx.userId, { tripsCount: FREE_TRIPS_PER_MONTH });

    await expect(assertCanStartTrip(ctx.userId)).rejects.toBeInstanceOf(SubscriptionLimitError);
  });

  it(`blocks receipt upload at ${FREE_RECEIPTS_PER_MONTH} receipts used`, async () => {
    await setUsageCounts(ctx.userId, { receiptsCount: FREE_RECEIPTS_PER_MONTH });

    await expect(assertCanUploadReceipt(ctx.userId)).rejects.toBeInstanceOf(
      SubscriptionLimitError
    );
  });

  it('allows usage below free tier limits', async () => {
    await setUsageCounts(ctx.userId, {
      tripsCount: FREE_TRIPS_PER_MONTH - 1,
      receiptsCount: FREE_RECEIPTS_PER_MONTH - 1,
    });

    await expect(assertCanStartTrip(ctx.userId)).resolves.toBeUndefined();
    await expect(assertCanUploadReceipt(ctx.userId)).resolves.toBeUndefined();
  });
});
