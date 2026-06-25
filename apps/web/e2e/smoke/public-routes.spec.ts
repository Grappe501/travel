import { test, expect } from '@playwright/test';

/** Public routes that must return 200 without authentication. */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/health',
  '/legal/privacy',
  '/legal/terms',
  '/legal/refunds',
  '/help',
  '/help/getting-started',
  '/beta/login',
  '/auth/forgot-password',
];

test.describe('Public route smoke @smoke', () => {
  for (const path of PUBLIC_ROUTES) {
    test(`${path} loads`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 5 });
      expect(response.status(), `${path} should not 404`).toBeLessThan(400);
    });
  }

  test('/health returns JSON with version', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(body.migrationsApplied).toBe(true);
  });
});

test.describe('Protected routes redirect to login @smoke', () => {
  const protectedPaths = ['/dashboard', '/settings', '/search', '/notifications', '/trips'];

  for (const path of protectedPaths) {
    test(`${path} redirects unauthenticated users`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect([307, 308, 302, 303]).toContain(response.status());
      const location = response.headers()['location'] ?? '';
      expect(location).toContain('/login');
    });
  }
});
