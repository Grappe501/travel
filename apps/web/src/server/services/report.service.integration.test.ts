import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { generateReportCsv } from '@/lib/reports/generators/csv';
import { createExpense } from '@/server/services/expense.service';
import { generateReport, getReportDownload } from '@/server/services/report.service';
import { endTrip, startTrip } from '@/server/services/trip.service';
import {
  createTestUserContext,
  deleteTestUser,
  integrationDbReady,
  type TestUserContext,
} from '@/test/integration/helpers';

describe.skipIf(!integrationDbReady())('report.service integration', () => {
  let ctx: TestUserContext;

  beforeAll(async () => {
    ctx = await createTestUserContext();

    const started = await startTrip(ctx.userId, {
      businessId: ctx.businessId,
      vehicleId: ctx.vehicleId,
      purpose: 'Report trip',
      startOdometer: 2000,
    });

    await endTrip(ctx.userId, { tripId: started.id, endOdometer: 2030 });

    await createExpense(ctx.userId, {
      businessId: ctx.businessId,
      categorySlug: 'supplies',
      merchant: 'Staples',
      amount: 28.75,
      expenseDate: '2026-06-01',
    });
  });

  afterAll(async () => {
    if (ctx?.userId) {
      await deleteTestUser(ctx.userId);
    }
  });

  it('generates combined CSV with expected row counts', async () => {
    const report = await generateReport(ctx.userId, {
      reportType: 'combined',
      format: 'csv',
      dateRangeStart: '2026-06-01',
      dateRangeEnd: '2026-06-30',
      businessId: ctx.businessId,
    });

    expect(report.status).toBe('ready');

    const { buffer } = await getReportDownload(ctx.userId, report.id);
    const csv = buffer.toString('utf8');
    const lines = csv.split('\n').filter(Boolean);

    expect(lines.some((line) => line.startsWith('Mileage detail'))).toBe(true);
    expect(lines.some((line) => line.startsWith('Expense detail'))).toBe(true);
    expect(lines.filter((line) => line.includes('Report trip')).length).toBeGreaterThan(0);
    expect(lines.filter((line) => line.includes('Staples')).length).toBeGreaterThan(0);
  });

  it('builds CSV summary rows from report data shape', () => {
    const buffer = generateReportCsv({
      reportType: 'expense',
      dateRangeStart: '2026-06-01',
      dateRangeEnd: '2026-06-30',
      businessName: 'Test',
      vehicleNickname: null,
      generatedAt: '2026-06-01T00:00:00.000Z',
      trips: [],
      expenses: [
        {
          id: '1',
          date: '2026-06-01',
          merchant: 'Staples',
          categorySlug: 'supplies',
          businessName: 'Test',
          amount: 10,
          taxAmount: null,
          currency: 'USD',
        },
      ],
      summary: {
        tripCount: 0,
        expenseCount: 1,
        totalMiles: 0,
        totalReimbursement: 0,
        totalExpenses: 10,
        grandTotal: 10,
      },
    });

    const csv = buffer.toString('utf8');
    expect(csv).toContain('Grand total,10.00');
    expect(csv).toContain('Staples');
  });
});
