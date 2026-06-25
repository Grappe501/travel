import { describe, expect, it, afterEach } from 'vitest';
import { isAdminUser, parseAdminAllowlist } from '@/lib/auth/admin';

describe('parseAdminAllowlist', () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL_ALLOWLIST;
  });

  it('parses comma-separated emails case-insensitively', () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = ' Admin@Example.com , support@test.com ';
    expect(parseAdminAllowlist()).toEqual(['admin@example.com', 'support@test.com']);
  });

  it('returns empty list when unset', () => {
    expect(parseAdminAllowlist()).toEqual([]);
  });
});

describe('isAdminUser', () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL_ALLOWLIST;
  });

  it('returns true for allowlisted email', () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = 'admin@example.com';
    expect(isAdminUser({ email: 'Admin@Example.com', app_metadata: {} })).toBe(true);
  });

  it('returns true for app_metadata admin role', () => {
    expect(
      isAdminUser({ email: 'user@example.com', app_metadata: { role: 'admin' } })
    ).toBe(true);
  });

  it('returns true for app_metadata support role', () => {
    expect(
      isAdminUser({ email: 'user@example.com', app_metadata: { role: 'support' } })
    ).toBe(true);
  });

  it('returns false for regular users', () => {
    process.env.ADMIN_EMAIL_ALLOWLIST = 'other@example.com';
    expect(
      isAdminUser({ email: 'user@example.com', app_metadata: { role: 'member' } })
    ).toBe(false);
  });
});
