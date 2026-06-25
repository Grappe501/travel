import { afterEach, describe, expect, it } from 'vitest';
import {
  getDependencyFlags,
  getSentryDsn,
  getStripeMode,
  isCiBuildDatabaseUrl,
  isSentryEnabled,
} from '@/lib/monitoring/config';

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

  it('flags CI build database URL as not configured', () => {
    process.env.DATABASE_URL = 'postgresql://ci:ci@127.0.0.1:5432/ci_build';
    expect(isCiBuildDatabaseUrl(process.env.DATABASE_URL)).toBe(true);
    const flags = getDependencyFlags();
    expect(flags.databaseConfigured).toBe(false);
  });

  it('detects configured Stripe and webhook secrets', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_abc';
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_1';
    process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY = 'price_2';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    const flags = getDependencyFlags();
    expect(flags.stripeConfigured).toBe(true);
    expect(flags.stripeWebhookConfigured).toBe(true);
  });

  it('detects stripe live mode', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_live_abc';
    expect(getStripeMode()).toBe('live');
  });
});
