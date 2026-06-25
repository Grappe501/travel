import { expect, test } from '@playwright/test';
import {
  ensureBusinessAndVehicle,
  endActiveTrip,
  readTripsUsageCount,
  startAndEndTrip,
} from './helpers/api';
import { e2eAuthConfigured } from './helpers/env';

const FREE_TRIP_LIMIT = 5;

test.describe('E2E-07 free tier 6th trip blocked with upgrade message', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
    await endActiveTrip(request);
  });

  test('blocks starting a trip after the monthly free limit', async ({ page, request }) => {
    const { businessId, vehicleId } = await ensureBusinessAndVehicle(request);
    await endActiveTrip(request);

    let used = await readTripsUsageCount(page);
    while (used < FREE_TRIP_LIMIT) {
      await startAndEndTrip(request, { businessId, vehicleId, odometer: 2000 + used * 20 });
      used += 1;
    }

    await page.goto('/trips/start');
    await page.locator('#trip-purpose').fill('Should be blocked trip');
    await page.locator('#trip-start-odometer').fill('5000');
    await page.getByRole('button', { name: 'Start trip' }).click();

    await expect(page.getByText(/Upgrade to Pro for unlimited trips/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
