import { describe, expect, it } from 'vitest';
import { ocrExtractedFieldsSchema, receiptApproveSchema } from './receipt';

const businessId = '550e8400-e29b-41d4-a716-446655440000';

describe('ocrExtractedFieldsSchema', () => {
  it('accepts partial OCR payload', () => {
    const result = ocrExtractedFieldsSchema.safeParse({
      merchant: 'Coffee Shop',
      total: 12.5,
      confidence: { total: 0.9 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects confidence above 1', () => {
    const result = ocrExtractedFieldsSchema.safeParse({
      confidence: { total: 1.5 },
    });
    expect(result.success).toBe(false);
  });
});

describe('receiptApproveSchema', () => {
  it('accepts valid approve payload', () => {
    const result = receiptApproveSchema.safeParse({
      merchant: 'Office Depot',
      receiptDate: '2026-06-01',
      total: 42.5,
      categorySlug: 'supplies',
      businessId,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid category slug', () => {
    const result = receiptApproveSchema.safeParse({
      merchant: 'Store',
      receiptDate: '2026-06-01',
      total: 10,
      categorySlug: 'invalid',
      businessId,
    });
    expect(result.success).toBe(false);
  });

  it('requires positive total', () => {
    const result = receiptApproveSchema.safeParse({
      merchant: 'Store',
      receiptDate: '2026-06-01',
      total: 0,
      categorySlug: 'fuel',
      businessId,
    });
    expect(result.success).toBe(false);
  });
});
