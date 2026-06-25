import { expect, test } from '@playwright/test';
import { ensureBusinessAndVehicle, endActiveTrip } from './helpers/api';
import { e2eAuthConfigured } from './helpers/env';

test.describe('E2E-03 start trip → expense → end trip → summary @smoke', () => {
  test.beforeEach(async ({ request }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
    await endActiveTrip(request);
  });

  test('completes a trip with a manual expense and shows summary totals', async ({ page, request }) => {
    const { businessId, vehicleId } = await ensureBusinessAndVehicle(request);
    const purpose = `Client visit ${Date.now()}`;

    await page.goto('/trips/start');
    await page.locator('#trip-purpose').fill(purpose);
    await page.locator('#trip-start-odometer').fill('1200');
    await page.getByRole('button', { name: 'Start trip' }).click();
    await expect(page).toHaveURL(/\/trips$/);

    await page.goto('/expenses/new');
    await page.locator('#expense-amount').fill('25.50');
    await page.locator('#expense-category').selectOption({ index: 1 });

    const activeResponse = await request.get('/api/trips/active');
    const activeBody = await activeResponse.json();
    const activeTripId = activeBody.data?.id as string | undefined;
    if (activeTripId) {
      await page.locator('#expense-trip').selectOption(activeTripId);
    }

    await page.getByRole('button', { name: 'Add expense' }).click();
    await expect(page).toHaveURL(/\/expenses/, { timeout: 30_000 });

    await page.goto('/trips');
    await page.getByRole('link', { name: 'End trip' }).click();
    await page.locator('#trip-end-odometer').fill('1225');
    await page.getByRole('button', { name: 'Complete trip' }).click();

    await expect(page.getByText('Miles')).toBeVisible();
    await expect(page.getByText('Grand total')).toBeVisible();
    await expect(page.getByText(purpose)).toBeVisible();

    void businessId;
    void vehicleId;
  });
});
