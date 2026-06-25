function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return (
    value.includes('placeholder') ||
    value.includes('...') ||
    value.includes('your-') ||
    value.includes('change-me')
  );
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

  return {
    databaseConfigured: Boolean(databaseUrl && !databaseUrl.includes('build:build@localhost')),
    directDatabaseConfigured: Boolean(directUrl && !isPlaceholder(directUrl)),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
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
        process.env.STRIPE_PRICE_PRO_MONTHLY &&
        process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY &&
        !isPlaceholder(process.env.STRIPE_SECRET_KEY)
    ),
    stripeWebhookConfigured: Boolean(
      process.env.STRIPE_WEBHOOK_SECRET && !isPlaceholder(process.env.STRIPE_WEBHOOK_SECRET)
    ),
    emailConfigured: Boolean(process.env.RESEND_API_KEY && !isPlaceholder(process.env.RESEND_API_KEY)),
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
