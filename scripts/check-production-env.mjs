#!/usr/bin/env node
/**
 * Pre-deploy env validation — run locally or in CI with production env vars loaded.
 * Usage: pnpm prod:check-env [--tier=core|production]
 */
const tier = process.argv.includes('--tier=production') ? 'production' : 'core';

function isPlaceholder(value) {
  if (!value) return true;
  return (
    value.includes('placeholder') ||
    value.includes('...') ||
    value.includes('your-') ||
    value.includes('change-me') ||
    value.includes('unconfigured')
  );
}

const CORE_VARS = ['DATABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

const PRODUCTION_VARS = [
  'DIRECT_URL',
  'NEXT_PUBLIC_APP_URL',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_PRO_MONTHLY',
  'STRIPE_PRICE_SMALL_BUSINESS_MONTHLY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'ADMIN_EMAIL_ALLOWLIST',
];

function hasSupabaseKey() {
  return (
    !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

function checkVars(names) {
  const missing = [];
  for (const name of names) {
    if (name.startsWith('NEXT_PUBLIC_SUPABASE_') && name.includes('KEY')) continue;
    if (isPlaceholder(process.env[name])) missing.push(name);
  }
  if (!hasSupabaseKey()) {
    missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return missing;
}

const coreMissing = checkVars(CORE_VARS);
const productionMissing = tier === 'production' ? checkVars(PRODUCTION_VARS) : [];
const allMissing = [...new Set([...coreMissing, ...productionMissing])];

console.log(`Production env check (tier: ${tier})`);

if (allMissing.length === 0) {
  console.log('All required variables are set.');
  process.exit(0);
}

console.error('Missing or placeholder values:');
for (const name of allMissing) {
  console.error(`  - ${name}`);
}
console.error('\nSee docs/execution/PRODUCTION-CHECKLIST.md and docs/runbooks/database-migrations.md');
process.exit(1);
