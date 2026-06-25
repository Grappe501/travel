import { RateLimitError } from '@/lib/api/response';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimitKey(userId: string, action: string): string {
  return `${action}:${userId}`;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new RateLimitError();
  }

  bucket.count += 1;
}

export function resetRateLimitStateForTests() {
  buckets.clear();
}

export const RECEIPT_UPLOAD_RATE_LIMIT = { limit: 20, windowMs: 60_000 };
export const RECEIPT_OCR_RATE_LIMIT = { limit: 10, windowMs: 60_000 };

export { RateLimitError };
