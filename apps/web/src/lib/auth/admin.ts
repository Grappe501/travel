import type { User } from '@supabase/supabase-js';

export function parseAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAIL_ALLOWLIST ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: Pick<User, 'email' | 'app_metadata'>): boolean {
  const email = user.email?.trim().toLowerCase();
  if (!email) return false;

  if (parseAdminAllowlist().includes(email)) return true;

  const role = user.app_metadata?.role;
  if (typeof role === 'string') {
    return role === 'admin' || role === 'support';
  }

  return false;
}
