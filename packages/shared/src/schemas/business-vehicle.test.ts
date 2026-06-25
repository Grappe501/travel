import { describe, expect, it } from 'vitest';
import {
  businessCreateSchema,
  businessUpdateSchema,
  mileageSettingsSchema,
  vehicleCreateSchema,
} from './index';

const businessId = '550e8400-e29b-41d4-a716-446655440000';

describe('businessCreateSchema', () => {
  it('accepts minimal business', () => {
    expect(businessCreateSchema.safeParse({ name: 'Acme LLC' }).success).toBe(true);
  });

  it('rejects empty name', () => {
    expect(businessCreateSchema.safeParse({ name: '' }).success).toBe(false);
  });
});

describe('businessUpdateSchema', () => {
  it('accepts partial updates', () => {
    expect(businessUpdateSchema.safeParse({ currency: 'USD' }).success).toBe(true);
  });
});

describe('vehicleCreateSchema', () => {
  it('accepts vehicle with optional business', () => {
    expect(
      vehicleCreateSchema.safeParse({
        nickname: 'Work SUV',
        businessId,
      }).success
    ).toBe(true);
  });
});

describe('mileageSettingsSchema', () => {
  it('requires custom rate when type is custom', () => {
    expect(
      mileageSettingsSchema.safeParse({
        mileageRateType: 'custom',
      }).success
    ).toBe(false);
  });

  it('accepts IRS default without custom rate', () => {
    expect(
      mileageSettingsSchema.safeParse({
        mileageRateType: 'irs',
      }).success
    ).toBe(true);
  });

  it('accepts custom rate with value', () => {
    expect(
      mileageSettingsSchema.safeParse({
        mileageRateType: 'custom',
        customMileageRate: 0.67,
      }).success
    ).toBe(true);
  });
});
