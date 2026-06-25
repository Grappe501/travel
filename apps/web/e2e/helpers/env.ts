import fs from 'node:fs';
import path from 'node:path';

const stateFile = path.join(__dirname, '../.auth/e2e-state.json');

export function e2eEnvConfigured(): boolean {
  if (process.env.E2E_TEST !== '1') return false;
  if (process.env.SKIP_E2E_TESTS === '1') return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  return (
    Boolean(process.env.DATABASE_URL) &&
    Boolean(supabaseUrl) &&
    Boolean(supabaseKey) &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseKey.includes('placeholder')
  );
}

export function e2eAuthConfigured(): boolean {
  return e2eEnvConfigured() && Boolean(process.env.E2E_USER_EMAIL) && Boolean(process.env.E2E_USER_PASSWORD);
}

export function e2eSignupConfigured(): boolean {
  return e2eEnvConfigured() && process.env.E2E_SIGNUP_ENABLED === '1';
}

export function readE2eReady(): boolean {
  try {
    const raw = fs.readFileSync(stateFile, 'utf8');
    const state = JSON.parse(raw) as { ready?: boolean };
    return state.ready === true;
  } catch {
    return false;
  }
}

export function uniqueE2eEmail(prefix = 'e2e'): string {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const domain = process.env.E2E_SIGNUP_EMAIL_DOMAIN ?? 'example.com';
  return `${prefix}-${stamp}@${domain}`;
}

export const E2E_DEFAULT_PASSWORD = 'E2eTestPass123!';
