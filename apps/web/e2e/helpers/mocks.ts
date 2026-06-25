import type { Page } from '@playwright/test';

export async function installOcrMock(page: Page) {
  await page.route('https://api.openai.com/**', (route) => route.abort());

  await page.route('**/api/receipts/*/ocr', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    const url = route.request().url();
    const id = url.match(/\/receipts\/([^/]+)\/ocr/)?.[1] ?? 'receipt-e2e';
    const now = new Date().toISOString();

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id,
          businessId: null,
          tripId: null,
          storagePath: 'e2e/sample-receipt.png',
          fileSizeBytes: 67,
          mimeType: 'image/png',
          merchant: 'E2E Coffee Shop',
          receiptDate: '2025-06-01',
          total: 12.5,
          subtotal: 11.5,
          tax: 1,
          currency: 'USD',
          uploadStatus: 'ready',
          reviewStatus: 'pending',
          displayStatus: 'pending_review',
          createdAt: now,
          updatedAt: now,
          ocrConfidence: 0.92,
          expenseId: null,
          ocrResult: {
            id: 'ocr-e2e-mock',
            merchant: 'E2E Coffee Shop',
            receiptDate: '2025-06-01',
            subtotal: 11.5,
            tax: 1,
            total: 12.5,
            suggestedCategorySlug: 'meals',
            confidenceScores: { merchant: 0.9, total: 0.92 },
            processingEngine: 'mock',
            modelVersion: 'e2e',
            processedAt: now,
          },
        },
      }),
    });
  });
}

export async function installStripeCheckoutMock(page: Page, baseURL: string) {
  await page.route('**/api/stripe/checkout', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          url: `${baseURL}/billing?checkout=success`,
        },
      }),
    });
  });
}
