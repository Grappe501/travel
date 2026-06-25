import { describe, expect, it } from 'vitest';
import { buildAuthContinueUrl } from '@/lib/auth/complete-client-sign-in';

describe('buildAuthContinueUrl', () => {
  it('builds continue path with redirect and beta label', () => {
    expect(
      buildAuthContinueUrl({ redirectTo: '/dashboard', fieldTestLabel: 'Steve' })
    ).toBe('/auth/continue?redirect=%2Fdashboard&beta_label=Steve');
  });

  it('rejects open redirect targets', () => {
    expect(buildAuthContinueUrl({ redirectTo: '//evil.test' })).toBe('/auth/continue');
  });
});
