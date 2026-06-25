import { afterEach, describe, expect, it } from 'vitest';
import { evaluateProductionReadiness } from '@/lib/monitoring/production-readiness';
import type { BuildMetadata, DependencyFlags } from '@/lib/monitoring/config';

const baseBuild: BuildMetadata = {
  build: 'netlify',
  nodeEnv: 'production',
  commitRef: 'abc123def456',
  deployUrl: 'https://travel-mileage.netlify.app',
  deployContext: 'production',
};

const coreDeps: DependencyFlags = {
  databaseConfigured: true,
  directDatabaseConfigured: true,
  supabaseConfigured: true,
  storageConfigured: true,
  openAiConfigured: true,
  stripeConfigured: true,
  stripeWebhookConfigured: true,
  emailConfigured: true,
  sentryConfigured: true,
};

describe('evaluateProductionReadiness', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('marks core ready when core gates pass', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://travel-mileage.netlify.app';
    process.env.STRIPE_SECRET_KEY = 'sk_live_test';
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_test';
    process.env.STRIPE_PRICE_PRO_MONTHLY = 'price_1';
    process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY = 'price_2';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    process.env.RESEND_API_KEY = 're_test';
    process.env.RESEND_FROM_EMAIL = 'App <billing@mycompany.com>';
    process.env.SENTRY_DSN = 'https://examplePublicKey@o0.ingest.sentry.io/0';
    process.env.ADMIN_EMAIL_ALLOWLIST = 'admin@example.com';
    process.env.OPENAI_API_KEY = 'sk-openai';

    const result = evaluateProductionReadiness({
      dependencies: coreDeps,
      migrationsApplied: true,
      notificationsReady: true,
      build: baseBuild,
    });

    expect(result.coreReady).toBe(true);
    expect(result.stripeMode).toBe('live');
  });

  it('lists missing production gates', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    const result = evaluateProductionReadiness({
      dependencies: {
        ...coreDeps,
        stripeConfigured: false,
        stripeWebhookConfigured: false,
        emailConfigured: false,
        sentryConfigured: false,
      },
      migrationsApplied: true,
      notificationsReady: true,
      build: { ...baseBuild, build: 'local' },
    });

    expect(result.productionReady).toBe(false);
    expect(result.missingForProduction).toContain('stripe');
    expect(result.missingForProduction).toContain('app-url');
  });
});
