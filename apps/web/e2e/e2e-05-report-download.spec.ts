import { expect, test } from '@playwright/test';
import { e2eAuthConfigured } from './helpers/env';

test.describe('E2E-05 generate report → download file', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required');
  });

  test('generates a CSV report and downloads the export', async ({ page }) => {
    await page.goto('/reports');

    await page.locator('#report-format').selectOption('csv');
    await page.getByRole('button', { name: 'Generate report' }).click();

    await expect(page).toHaveURL(/\/reports\/[^/]+$/, { timeout: 60_000 });
    await expect(page.getByText('Ready')).toBeVisible({ timeout: 60_000 });

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: /Download CSV/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });
});
