import { describe, expect, it } from 'vitest';
import {
  accountSettingsSchema,
  appearancePreferenceSchema,
  changePasswordSchema,
} from './settings';

describe('appearancePreferenceSchema', () => {
  it('accepts valid theme values', () => {
    expect(appearancePreferenceSchema.parse('system')).toBe('system');
    expect(appearancePreferenceSchema.parse('light')).toBe('light');
    expect(appearancePreferenceSchema.parse('dark')).toBe('dark');
  });

  it('rejects invalid theme values', () => {
    expect(() => appearancePreferenceSchema.parse('auto')).toThrow();
  });
});

describe('accountSettingsSchema', () => {
  it('accepts valid account settings', () => {
    const result = accountSettingsSchema.parse({
      displayName: 'Alex',
      firstName: 'Alex',
      lastName: 'Rivera',
      timezone: 'America/New_York',
      currency: 'USD',
      taxYear: 2026,
    });
    expect(result.currency).toBe('USD');
  });

  it('rejects invalid currency length', () => {
    expect(() =>
      accountSettingsSchema.parse({
        timezone: 'UTC',
        currency: 'US',
        taxYear: 2026,
      })
    ).toThrow();
  });
});

describe('changePasswordSchema', () => {
  it('requires matching confirmation', () => {
    expect(() =>
      changePasswordSchema.parse({
        currentPassword: 'oldpassword1',
        newPassword: 'newpassword1',
        confirmPassword: 'different1',
      })
    ).toThrow(/match/i);
  });

  it('requires new password differs from current', () => {
    expect(() =>
      changePasswordSchema.parse({
        currentPassword: 'samepassword',
        newPassword: 'samepassword',
        confirmPassword: 'samepassword',
      })
    ).toThrow(/differ/i);
  });
});
