import { getSupabasePublishableKey } from '@/lib/supabase/config';

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return (
    value.includes('placeholder') ||
    value.includes('...') ||
    value.includes('your-') ||
    value.includes('change-me') ||
    value.includes('unconfigured')
  );
}

export function isPlaceholderEnv(value: string | undefined): boolean {
  return isPlaceholder(value);
}

/** CI/Netlify build URLs that must not count as production database config. */
export function isCiBuildDatabaseUrl(url: string | undefined): boolean {
  if (!url) return true;
  return url.includes('@127.0.0.1:5432/ci_build') || url.includes('build:build@localhost');
}

export function getSentryDsn(): string | undefined {
  const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || isPlaceholder(dsn)) return undefined;
  return dsn;
}

export function isSentryEnabled(): boolean {
  return Boolean(getSentryDsn());
}

export function getSentryEnvironment(): string {
  return (
    process.env.SENTRY_ENVIRONMENT ??
    process.env.CONTEXT ??
    process.env.NODE_ENV ??
    'development'
  );
}

export function getSentryRelease(): string | undefined {
  const commit = process.env.COMMIT_REF ?? process.env.VERCEL_GIT_COMMIT_SHA;
  if (commit) return commit.slice(0, 12);
  return process.env.npm_package_version;
}

export type StripeMode = 'live' | 'test' | 'off';

export function getStripeMode(): StripeMode {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || isPlaceholder(secret)) return 'off';
  if (secret.startsWith('sk_live_')) return 'live';
  if (secret.startsWith('sk_test_')) return 'test';
  return 'off';
}

export function isProductionAppUrl(): boolean {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url || isPlaceholder(url)) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.hostname.includes('localhost');
  } catch {
    return false;
  }
}

export type DependencyFlags = {
  databaseConfigured: boolean;
  directDatabaseConfigured: boolean;
  supabaseConfigured: boolean;
  storageConfigured: boolean;
  openAiConfigured: boolean;
  stripeConfigured: boolean;
  stripeWebhookConfigured: boolean;
  emailConfigured: boolean;
  sentryConfigured: boolean;
};

export function getDependencyFlags(): DependencyFlags {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = getSupabasePublishableKey();

  return {
    databaseConfigured: Boolean(databaseUrl && !isCiBuildDatabaseUrl(databaseUrl)),
    directDatabaseConfigured: Boolean(directUrl && !isPlaceholder(directUrl)),
    supabaseConfigured: Boolean(
      supabaseUrl &&
        supabasePublishableKey &&
        !isPlaceholder(supabaseUrl) &&
        !isPlaceholder(supabasePublishableKey)
    ),
    storageConfigured: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !isPlaceholder(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
        !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ),
    openAiConfigured: Boolean(
      process.env.OPENAI_API_KEY && !isPlaceholder(process.env.OPENAI_API_KEY)
    ),
    stripeConfigured: Boolean(
      process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
        process.env.STRIPE_PRICE_PRO_MONTHLY &&
        process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY &&
        !isPlaceholder(process.env.STRIPE_SECRET_KEY) &&
        !isPlaceholder(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    ),
    stripeWebhookConfigured: Boolean(
      process.env.STRIPE_WEBHOOK_SECRET && !isPlaceholder(process.env.STRIPE_WEBHOOK_SECRET)
    ),
    emailConfigured: Boolean(
      process.env.RESEND_API_KEY &&
        !isPlaceholder(process.env.RESEND_API_KEY) &&
        process.env.RESEND_FROM_EMAIL &&
        !isPlaceholder(process.env.RESEND_FROM_EMAIL)
    ),
    sentryConfigured: isSentryEnabled(),
  };
}

export type BuildMetadata = {
  build: 'netlify' | 'local';
  nodeEnv: string;
  commitRef: string | null;
  deployUrl: string | null;
  deployContext: string | null;
};

export function getBuildMetadata(): BuildMetadata {
  return {
    build: process.env.NETLIFY ? 'netlify' : 'local',
    nodeEnv: process.env.NODE_ENV ?? 'development',
    commitRef: process.env.COMMIT_REF ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    deployUrl: process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? null,
    deployContext: process.env.CONTEXT ?? null,
  };
}
