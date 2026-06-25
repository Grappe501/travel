function isValidPublicConfig(url: string, publishableKey: string): boolean {
  if (url.includes('unconfigured') || url.endsWith('.invalid')) return false;
  if (publishableKey.includes('unconfigured')) return false;
  return true;
}

/**
 * Supabase public API key for browser, middleware, and SSR clients.
 * Supabase Dashboard may label this "publishable" (new) or "anon" (legacy).
 */
export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Public Supabase config — safe for browser and middleware.
 * Build/CI may use placeholders; runtime auth requires real values in .env.local.
 */
export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey || !isValidPublicConfig(url, publishableKey)) {
    return {
      url: 'https://app-unconfigured.invalid',
      anonKey: 'app-unconfigured-anon-key',
      isConfigured: false,
    };
  }

  return { url, anonKey: publishableKey, isConfigured: true };
}
