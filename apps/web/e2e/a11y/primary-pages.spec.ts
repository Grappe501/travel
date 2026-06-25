import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { e2eAuthConfigured } from '../helpers/env';

const AUTHENTICATED_A11Y_ROUTES = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/trips', name: 'Trips' },
  { path: '/trips/start', name: 'Trip start form' },
  { path: '/receipts/upload', name: 'Receipt upload' },
  { path: '/expenses/new', name: 'New expense' },
  { path: '/reports', name: 'Reports' },
  { path: '/billing', name: 'Billing' },
];

test.describe('Primary flow axe scans @a11y', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(!e2eAuthConfigured(), 'E2E_USER_EMAIL and E2E_USER_PASSWORD required for a11y scans');
  });

  for (const route of AUTHENTICATED_A11Y_ROUTES) {
    test(`no critical axe violations on ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
        .analyze();

      const critical = results.violations.filter((violation) => violation.impact === 'critical');
      expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
    });
  }
});
