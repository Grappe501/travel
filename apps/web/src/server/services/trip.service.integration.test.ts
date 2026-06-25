import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ConflictError } from '@/lib/api/response';
import { endTrip, getActiveTrip, startTrip } from '@/server/services/trip.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('trip.service integration', () => {
  let ctx: TestUserContext;

  beforeAll(async () => {
    ctx = await createTestUserContext();
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it('starts and ends a trip with mileage totals', async () => {
    const started = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'Client meeting',
      startOdometer: 1000,
    });

    expect(started.status).toBe('active');
    expect(started.miles).toBeNull();

    const ended = await endTrip(ctx.userId, {
      tripId: started.id,
      endOdometer: 1025.5,
    });

    expect(ended.status).toBe('completed');
    expect(ended.miles).toBe(25.5);
    expect(ended.reimbursementAmount).toBeGreaterThan(0);
    await expect(getActiveTrip(ctx.userId)).resolves.toBeNull();
  });

  it('blocks a second active trip', async () => {
    const first = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'First trip',
    });

    await expect(
      startTrip(ctx.userId, {
        businessId: ctx.businessId,
        vehicleId: ctx.vehicleId,
        purpose: 'Second trip',
      })
    ).rejects.toBeInstanceOf(ConflictError);

    await endTrip(ctx.userId, { tripId: first.id, endOdometer: 110 });
  });
});
