import { parseAdminAllowlist } from '@/lib/auth/admin';
import { getEmailConfig } from '@/lib/email/config';
import type { BuildMetadata, DependencyFlags } from '@/lib/monitoring/config';
import { getStripeMode, isProductionAppUrl } from '@/lib/monitoring/config';

export type ReadinessGate = {
  id: string;
  label: string;
  ready: boolean;
  tier: 'core' | 'production';
  hint?: string;
};

export type ProductionReadiness = {
  coreReady: boolean;
  productionReady: boolean;
  stripeMode: 'live' | 'test' | 'off';
  gates: ReadinessGate[];
  missingForProduction: string[];
};

type ReadinessInput = {
  dependencies: DependencyFlags;
  migrationsApplied: boolean;
  notificationsReady: boolean;
  build: BuildMetadata;
};

function gate(
  id: string,
  label: string,
  ready: boolean,
  tier: 'core' | 'production',
  hint?: string
): ReadinessGate {
  return { id, label, ready, tier, hint };
}

export function evaluateProductionReadiness(input: ReadinessInput): ProductionReadiness {
  const { dependencies, migrationsApplied, notificationsReady, build } = input;
  const email = getEmailConfig();
  const emailFromReady =
    email.isConfigured &&
    !email.from.includes('onboarding@resend.dev') &&
    !email.from.includes('yourdomain.com') &&
    !email.from.includes('example.com');
  const adminReady = parseAdminAllowlist().length > 0;
  const appUrlReady = isProductionAppUrl();
  const stripeMode = getStripeMode();

  const gates: ReadinessGate[] = [
    gate(
      'database',
      'Database (pooled)',
      dependencies.databaseConfigured,
      'core',
      'Set DATABASE_URL to Supabase transaction pooler :6543'
    ),
    gate(
      'direct-database',
      'Direct DB URL for migrations',
      dependencies.directDatabaseConfigured,
      'production',
      'Set DIRECT_URL to Supabase session pooler :5432'
    ),
    gate(
      'supabase-auth',
      'Supabase auth',
      dependencies.supabaseConfigured,
      'core',
      'NEXT_PUBLIC_SUPABASE_URL + publishable/anon key'
    ),
    gate(
      'storage',
      'Receipt storage',
      dependencies.storageConfigured,
      'core',
      'SUPABASE_SERVICE_ROLE_KEY + bucket'
    ),
    gate(
      'migrations',
      'Core schema migrations',
      migrationsApplied,
      'core',
      'Run pnpm db:migrate:deploy:local against production DIRECT_URL'
    ),
    gate(
      'notifications-schema',
      'Notifications schema',
      notificationsReady,
      'core',
      'Apply prisma/migrations/20260625140000_notifications'
    ),
    gate(
      'app-url',
      'Production app URL',
      appUrlReady,
      'production',
      'Set NEXT_PUBLIC_APP_URL to https://your-site.netlify.app'
    ),
    gate(
      'openai',
      'OpenAI OCR',
      dependencies.openAiConfigured,
      'production',
      'OPENAI_API_KEY in Netlify'
    ),
    gate(
      'stripe',
      'Stripe billing',
      dependencies.stripeConfigured,
      'production',
      'STRIPE_SECRET_KEY + price IDs'
    ),
    gate(
      'stripe-webhook',
      'Stripe webhook',
      dependencies.stripeWebhookConfigured,
      'production',
      'STRIPE_WEBHOOK_SECRET — endpoint /api/stripe/webhook'
    ),
    gate(
      'stripe-live',
      'Stripe live mode',
      stripeMode === 'live',
      'production',
      'Use sk_live_ / pk_live_ keys for production billing'
    ),
    gate(
      'email',
      'Transactional email (Resend)',
      dependencies.emailConfigured,
      'production',
      'RESEND_API_KEY'
    ),
    gate(
      'email-from',
      'Verified sender domain',
      emailFromReady,
      'production',
      'RESEND_FROM_EMAIL on your verified domain (not resend.dev)'
    ),
    gate(
      'sentry',
      'Error monitoring',
      dependencies.sentryConfigured,
      'production',
      'SENTRY_DSN + NEXT_PUBLIC_SENTRY_DSN'
    ),
    gate(
      'admin',
      'Admin allowlist',
      adminReady,
      'production',
      'ADMIN_EMAIL_ALLOWLIST or Supabase app_metadata.role'
    ),
    gate(
      'netlify-build',
      'Netlify deploy',
      build.build === 'netlify',
      'production',
      'Deploy via connected GitHub → Netlify'
    ),
  ];

  const coreReady = gates.filter((g) => g.tier === 'core').every((g) => g.ready);
  const productionReady = gates.every((g) => g.ready);
  const missingForProduction = gates.filter((g) => !g.ready).map((g) => g.id);

  return {
    coreReady,
    productionReady,
    stripeMode,
    gates,
    missingForProduction,
  };
}
