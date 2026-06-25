import { describe, expect, it } from 'vitest';
import { isRedirectError } from '@/lib/auth/is-redirect-error';

describe('isRedirectError', () => {
  it('detects Next.js redirect digest', () => {
    expect(isRedirectError({ digest: 'NEXT_REDIRECT;replace;/dashboard' })).toBe(true);
  });

  it('returns false for normal errors', () => {
    expect(isRedirectError(new Error('fail'))).toBe(false);
    expect(isRedirectError(null)).toBe(false);
  });
});
