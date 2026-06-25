import { expect, test } from '@playwright/test';
import { e2eAuthConfigured } from './helpers/env';

test.describe('E2E-02 create business → add vehicle', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
  });

  test('adds a business and linked vehicle from management screens', async ({ page }) => {
    const stamp = Date.now();
    const businessName = `E2E Business ${stamp}`;
    const vehicleNickname = `E2E Van ${stamp}`;

    await page.goto('/businesses');
    await page.locator('#business-name').fill(businessName);
    await page.getByRole('button', { name: 'Add business' }).click();
    await expect(page.getByText(businessName)).toBeVisible();

    await page.goto('/vehicles');
    await page.locator('#vehicle-nickname').fill(vehicleNickname);
    await page.getByRole('button', { name: 'Add vehicle' }).click();
    await expect(page.getByText(vehicleNickname)).toBeVisible();
  });
});
