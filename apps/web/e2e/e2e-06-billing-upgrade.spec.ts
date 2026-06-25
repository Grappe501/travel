import { expect, test } from '@playwright/test';
import { e2eAuthConfigured } from './helpers/env';
import { installStripeCheckoutMock } from './helpers/mocks';

test.describe('E2E-06 billing upgrade flow (mocked Stripe checkout)', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
  });

  test('starts checkout and returns to billing success state', async ({ page, baseURL }) => {
    await installStripeCheckoutMock(page, baseURL!);

    await page.goto('/billing');
    await page.getByRole('button', { name: 'Upgrade to Pro' }).click();

    await expect(page).toHaveURL(/checkout=success/, { timeout: 30_000 });
    await expect(page.getByText('Subscription updated')).toBeVisible();
  });
});
