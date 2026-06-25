import { afterEach, describe, expect, it } from 'vitest';
import { getDependencyFlags, getSentryDsn, isSentryEnabled } from '@/lib/monitoring/config';

describe('monitoring config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('treats placeholder DSN as disabled', () => {
    process.env.SENTRY_DSN = 'https://...@sentry.io/...';
    expect(getSentryDsn()).toBeUndefined();
    expect(isSentryEnabled()).toBe(false);
  });

  it('enables Sentry with a real DSN', () => {
    process.env.SENTRY_DSN = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    expect(isSentryEnabled()).toBe(true);
  });

  it('flags build placeholder database as not configured', () => {
    process.env.DATABASE_URL = 'postgresql://build:build@localhost:5432/mileage_copilot';
    const flags = getDependencyFlags();
    expect(flags.databaseConfigured).toBe(false);
  });

  it('detects configured Stripe and webhook secrets', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_1';
    process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY = 'price_2';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    const flags = getDependencyFlags();
    expect(flags.stripeConfigured).toBe(true);
    expect(flags.stripeWebhookConfigured).toBe(true);
  });
});
