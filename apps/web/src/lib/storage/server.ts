import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getStorageConfig } from '@/lib/storage/config';

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const { url, serviceRoleKey, isConfigured } = getStorageConfig();

  if (!isConfigured || !url || !serviceRoleKey) {
    throw new Error(
      'Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
