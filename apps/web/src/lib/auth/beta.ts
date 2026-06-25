import { timingSafeEqual } from 'node:crypto';

export function isBetaModeEnabled(): boolean {
  return process.env.BETA_MODE === '1' || process.env.BETA_MODE === 'true';
}

export function isPublicBetaMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_BETA_MODE === '1' || process.env.NEXT_PUBLIC_BETA_MODE === 'true'
  );
}

export function getBetaSharedPassword(): string | null {
  const value = process.env.BETA_SHARED_PASSWORD?.trim();
  return value || null;
}

export function isBetaLoginConfigured(): boolean {
  return isBetaModeEnabled() && Boolean(getBetaSharedPassword());
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyBetaPassword(candidate: string): boolean {
  const expected = getBetaSharedPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}
