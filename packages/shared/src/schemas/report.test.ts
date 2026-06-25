import { describe, expect, it } from 'vitest';
import { MAX_REPORT_RANGE_DAYS, reportGenerateSchema } from './report';

const businessId = '550e8400-e29b-41d4-a716-446655440000';

describe('reportGenerateSchema', () => {
  it('accepts valid report request', () => {
    const result = reportGenerateSchema.safeParse({
      reportType: 'combined',
      format: 'pdf',
      dateRangeStart: '2026-01-01',
      dateRangeEnd: '2026-01-31',
      businessId,
    });
    expect(result.success).toBe(true);
  });

  it('rejects end date before start date', () => {
    const result = reportGenerateSchema.safeParse({
      reportType: 'mileage',
      format: 'csv',
      dateRangeStart: '2026-02-01',
      dateRangeEnd: '2026-01-01',
    });
    expect(result.success).toBe(false);
  });

  it(`allows up to ${MAX_REPORT_RANGE_DAYS} days inclusive`, () => {
    const result = reportGenerateSchema.safeParse({
      reportType: 'expense',
      format: 'xlsx',
      dateRangeStart: '2025-01-01',
      dateRangeEnd: '2026-01-01',
    });
    expect(result.success).toBe(true);
  });

  it(`rejects ranges over ${MAX_REPORT_RANGE_DAYS} days`, () => {
    const result = reportGenerateSchema.safeParse({
      reportType: 'expense',
      format: 'xlsx',
      dateRangeStart: '2024-01-01',
      dateRangeEnd: '2026-01-02',
    });
    expect(result.success).toBe(false);
  });
});
