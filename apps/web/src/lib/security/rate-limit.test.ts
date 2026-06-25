import { afterEach, describe, expect, it } from 'vitest';
import { RateLimitError } from '@/lib/security/rate-limit';
import {
  checkRateLimit,
  RECEIPT_OCR_RATE_LIMIT,
  resetRateLimitStateForTests,
} from '@/lib/security/rate-limit';

describe('rate limiter', () => {
  afterEach(() => {
    resetRateLimitStateForTests();
  });

  it('allows requests under the limit', () => {
    const key = 'test-user:ocr';
    for (let i = 0; i < RECEIPT_OCR_RATE_LIMIT.limit; i += 1) {
      expect(() =>
        checkRateLimit(key, RECEIPT_OCR_RATE_LIMIT.limit, RECEIPT_OCR_RATE_LIMIT.windowMs)
      ).not.toThrow();
    }
  });

  it('throws RateLimitError when the limit is exceeded', () => {
    const key = 'test-user:upload';
    const { limit, windowMs } = { limit: 2, windowMs: 60_000 };

    checkRateLimit(key, limit, windowMs);
    checkRateLimit(key, limit, windowMs);

    expect(() => checkRateLimit(key, limit, windowMs)).toThrow(RateLimitError);
  });
});
