import { expect, test as setup } from '@playwright/test';
import { e2eAuthConfigured } from './helpers/env';

const authFile = 'e2e/.auth/user.json';

setup('authenticate seeded E2E user', async ({ page }) => {
  setup.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required for authenticated journeys');

  await page.goto('/login');
  await page.locator('#email').fill(process.env.E2E_USER_EMAIL!);
  await page.locator('#password').fill(process.env.E2E_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/(dashboard|onboarding)/, { timeout: 30_000 });
  await page.context().storageState({ path: authFile });
});
