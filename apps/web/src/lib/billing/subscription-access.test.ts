import { describe, expect, it } from 'vitest';
import { hasUnlimitedUsage } from './subscription-access';

describe('hasUnlimitedUsage', () => {
  it('returns false for free plan', () => {
    expect(hasUnlimitedUsage({ plan: 'free', status: 'active' })).toBe(false);
  });

  it('returns true for paid plans with active status', () => {
    expect(hasUnlimitedUsage({ plan: 'pro', status: 'active' })).toBe(true);
    expect(hasUnlimitedUsage({ plan: 'small_business', status: 'trialing' })).toBe(true);
    expect(hasUnlimitedUsage({ plan: 'pro', status: 'past_due' })).toBe(true);
  });

  it('returns false for canceled paid plans', () => {
    expect(hasUnlimitedUsage({ plan: 'pro', status: 'canceled' })).toBe(false);
  });
});
