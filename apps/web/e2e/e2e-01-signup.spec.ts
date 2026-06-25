import { expect, test } from '@playwright/test';
import { E2E_DEFAULT_PASSWORD, e2eSignupConfigured, uniqueE2eEmail } from './helpers/env';

test.describe('E2E-01 signup → onboarding → dashboard @smoke', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eSignupConfigured(), 'Set E2E_SIGNUP_ENABLED=1 with Supabase auto-confirm for signup journey');
  });

  test('creates account, completes onboarding, lands on dashboard', async ({ page }) => {
    const email = uniqueE2eEmail('signup');
    const password = process.env.E2E_SIGNUP_PASSWORD ?? E2E_DEFAULT_PASSWORD;

    await page.goto('/signup');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/(onboarding|dashboard)/, { timeout: 30_000 });

    if (page.url().includes('/onboarding')) {
      await page.locator('#business-name').fill(`E2E Biz ${Date.now()}`);
      await page.getByRole('button', { name: 'Add business' }).click();
      await expect(page.getByRole('heading', { name: 'Add a vehicle' })).toBeVisible();

      await page.locator('#vehicle-nickname').fill('E2E Car');
      await page.getByRole('button', { name: 'Add vehicle' }).click();
      await expect(page.getByRole('button', { name: 'Finish setup' })).toBeVisible();
      await page.getByRole('button', { name: 'Finish setup' }).click();
    }

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
