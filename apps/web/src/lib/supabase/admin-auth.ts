import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getPublicSupabaseConfig } from '@/lib/supabase/config';

let adminAuthClient: SupabaseClient | null = null;

export function getSupabaseAdminAuth(): SupabaseClient | null {
  const { url, isConfigured } = getPublicSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isConfigured || !url || !serviceRoleKey || serviceRoleKey.includes('your-service-role')) {
    return null;
  }

  if (!adminAuthClient) {
    adminAuthClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminAuthClient;
}
