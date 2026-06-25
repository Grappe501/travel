import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { insertGpsPoints, listTripGpsPoints } from '@/server/services/gps-tracking.service';
import { endTrip, startTrip } from '@/server/services/trip.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('gps-tracking.service integration', () => {
  let ctx: TestUserContext;

  beforeAll(async () => {
    ctx = await createTestUserContext();
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it('stores GPS points and completes trip with hybrid mileage', async () => {
    const started = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'GPS route test',
      startOdometer: 5000,
      trackingEnabled: true,
      startLatitude: 40.7128,
      startLongitude: -74.006,
    });

    await insertGpsPoints(ctx.userId, started.id, {
      points: [
        {
          latitude: 40.72,
          longitude: -74.01,
          recordedAt: new Date().toISOString(),
          source: 'live',
        },
        {
          latitude: 40.73,
          longitude: -74.02,
          recordedAt: new Date(Date.now() + 60_000).toISOString(),
          source: 'live',
        },
      ],
    });

    const points = await listTripGpsPoints(ctx.userId, started.id);
    expect(points.length).toBeGreaterThanOrEqual(3);

    const ended = await endTrip(ctx.userId, {
      tripId: started.id,
      endOdometer: 5020,
      endLatitude: 40.74,
      endLongitude: -74.03,
    });

    expect(ended.status).toBe('completed');
    expect(ended.miles).toBe(20);
    expect(ended.gpsMiles).not.toBeNull();
    expect(ended.mileageSource).toBe('hybrid');
  });
});
