import { afterEach, describe, expect, it, vi } from 'vitest';
import { expenseCreateSchema, expenseUpdateSchema, receiptAttachSchema } from './expense';

const businessId = '550e8400-e29b-41d4-a716-446655440000';
const tripId = '550e8400-e29b-41d4-a716-446655440001';

describe('expenseCreateSchema', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts valid manual expense', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

    const result = expenseCreateSchema.safeParse({
      businessId,
      categorySlug: 'fuel',
      amount: 45.99,
      expenseDate: '2026-06-15',
    });
    expect(result.success).toBe(true);
  });

  it('rejects expense date far in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

    const result = expenseCreateSchema.safeParse({
      businessId,
      categorySlug: 'fuel',
      amount: 45.99,
      expenseDate: '2026-06-20',
    });
    expect(result.success).toBe(false);
  });
});

describe('expenseUpdateSchema', () => {
  it('rejects empty update payload', () => {
    expect(expenseUpdateSchema.safeParse({}).success).toBe(false);
  });

  it('accepts partial updates', () => {
    expect(expenseUpdateSchema.safeParse({ amount: 12.5 }).success).toBe(true);
  });
});

describe('receiptAttachSchema', () => {
  it('requires trip id', () => {
    expect(receiptAttachSchema.safeParse({ tripId }).success).toBe(true);
    expect(receiptAttachSchema.safeParse({}).success).toBe(false);
  });
});
