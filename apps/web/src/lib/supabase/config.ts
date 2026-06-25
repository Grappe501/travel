/**
 * Public Supabase config — safe for browser and middleware.
 * Build/CI may use placeholders; runtime auth requires real values in .env.local.
 */
export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      url: 'https://app-unconfigured.invalid',
      anonKey: 'app-unconfigured-anon-key',
      isConfigured: false,
    };
  }

  return { url, anonKey, isConfigured: true };
}
