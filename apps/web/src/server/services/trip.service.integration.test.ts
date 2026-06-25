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

  it('duplicates a completed trip into a new active trip', async () => {
    const completed = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'Site visit',
      destination: 'Downtown',
    });

    await endTrip(ctx.userId, { tripId: completed.id, endOdometer: 120 });

    const duplicated = await import('@/server/services/trip.service').then((m) =>
      m.duplicateTrip(ctx.userId, completed.id)
    );

    expect(duplicated.status).toBe('active');
    expect(duplicated.purpose).toBe('Site visit');
    expect(duplicated.destination).toBe('Downtown');

    await endTrip(ctx.userId, { tripId: duplicated.id, endOdometer: 125 });
  });

  it('soft-deletes a completed trip', async () => {
    const trip = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'Delete me',
    });

    await endTrip(ctx.userId, { tripId: trip.id, endOdometer: 130 });

    const { deleteTrip, listTrips } = await import('@/server/services/trip.service');
    await deleteTrip(ctx.userId, trip.id);

    const trips = await listTrips(ctx.userId);
    expect(trips.find((t) => t.id === trip.id)).toBeUndefined();
  });
});
