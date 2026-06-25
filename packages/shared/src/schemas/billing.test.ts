import { describe, expect, it } from 'vitest';
import { checkoutPlanSchema } from './billing';

describe('checkoutPlanSchema', () => {
  it('accepts pro and small_business', () => {
    expect(checkoutPlanSchema.safeParse('pro').success).toBe(true);
    expect(checkoutPlanSchema.safeParse('small_business').success).toBe(true);
  });

  it('rejects unknown plans', () => {
    expect(checkoutPlanSchema.safeParse('enterprise').success).toBe(false);
    expect(checkoutPlanSchema.safeParse('free').success).toBe(false);
  });
});
