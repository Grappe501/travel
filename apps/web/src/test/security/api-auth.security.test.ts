import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

function collectRouteFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectRouteFiles(fullPath);
    }
    if (entry.name === 'route.ts') {
      return [fullPath];
    }
    return [];
  });
}

describe('API auth inventory', () => {
  it('requires requireSessionUser on every API handler except Stripe webhook', () => {
    const apiRoot = path.join(process.cwd(), 'src/app/api');
    const routes = collectRouteFiles(apiRoot);

    expect(routes.length).toBeGreaterThanOrEqual(28);

    for (const routePath of routes) {
      const content = fs.readFileSync(routePath, 'utf8');
      const relative = path.relative(apiRoot, routePath).replace(/\\/g, '/');

      if (relative === 'stripe/webhook/route.ts') {
        expect(content).toContain('stripe-signature');
        expect(content).not.toContain('requireSessionUser');
        continue;
      }

      expect(content, relative).toContain('requireSessionUser');
    }
  });
});

vi.mock('@/lib/auth/server', () => ({
  requireSessionUser: vi.fn(async () => null),
}));

describe('API admin forbidden responses', () => {
  it('returns 403 for authenticated non-admin users', async () => {
    const { requireSessionUser } = await import('@/lib/auth/server');
    vi.mocked(requireSessionUser).mockResolvedValueOnce({
      id: '11111111-1111-1111-1111-111111111111',
      email: 'member@example.com',
      app_metadata: { role: 'member' },
    } as unknown as NonNullable<Awaited<ReturnType<typeof requireSessionUser>>>);

    const { GET: getAdminUsers } = await import('@/app/api/admin/users/route');
    const response = await getAdminUsers(
      new Request('http://localhost/api/admin/users?email=test@example.com')
    );
    expect(response.status).toBe(403);
  });
});

describe('API unauthorized responses', () => {
  it('returns 401 from protected routes without a session', async () => {
    const { GET: getTrips } = await import('@/app/api/trips/route');
    const { POST: startTrip } = await import('@/app/api/trips/start/route');
    const { POST: uploadReceipt } = await import('@/app/api/receipts/upload/route');
    const { POST: createExpense } = await import('@/app/api/expenses/route');

    const tripsResponse = await getTrips();
    expect(tripsResponse.status).toBe(401);

    const startResponse = await startTrip(
      new Request('http://localhost/api/trips/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(startResponse.status).toBe(401);

    const uploadResponse = await uploadReceipt(
      new Request('http://localhost/api/receipts/upload', { method: 'POST' })
    );
    expect(uploadResponse.status).toBe(401);

    const expenseResponse = await createExpense(
      new Request('http://localhost/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(expenseResponse.status).toBe(401);

    const { GET: getAdminUsers } = await import('@/app/api/admin/users/route');
    const { GET: getAdminHealth } = await import('@/app/api/admin/health/route');

    const adminUsersResponse = await getAdminUsers(
      new Request('http://localhost/api/admin/users?email=test@example.com')
    );
    expect(adminUsersResponse.status).toBe(401);

    const adminHealthResponse = await getAdminHealth();
    expect(adminHealthResponse.status).toBe(401);
  });
});
