import { expect, test } from '@playwright/test';
import { ensureBusinessAndVehicle } from './helpers/api';
import { e2eAuthConfigured } from './helpers/env';
import { receiptFixturePath } from './helpers/fixtures';
import { installOcrMock } from './helpers/mocks';

test.describe('E2E-04 upload receipt → mock OCR → approve → expense linked', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
    test.skip(
      process.env.E2E_STORAGE_READY !== '1',
      'Set E2E_STORAGE_READY=1 when Supabase storage bucket is configured for receipt uploads'
    );
  });

  test('uploads a receipt, reviews mocked OCR fields, and creates an expense', async ({
    page,
    request,
  }) => {
    await ensureBusinessAndVehicle(request);
    await installOcrMock(page);

    await page.goto('/receipts/upload');
    await page.locator('#receipt-file').setInputFiles(receiptFixturePath());
    await page.getByRole('button', { name: 'Upload receipt' }).click();

    await expect(page).toHaveURL(/\/receipts\/[^/]+\/review/, { timeout: 60_000 });
    await expect(page.getByText('E2E Coffee Shop')).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: 'Approve & create expense' }).click();
    await expect(page.getByText('This receipt is approved')).toBeVisible({ timeout: 30_000 });
  });
});
