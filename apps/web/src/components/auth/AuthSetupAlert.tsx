import { getDependencyFlags } from '@/lib/monitoring/config';
import { getPublicSupabaseConfig } from '@/lib/supabase/config';
import { Alert } from '@/components/ui';

export function AuthSetupAlert() {
  const supabase = getPublicSupabaseConfig();
  const dependencies = getDependencyFlags();
  const issues: string[] = [];

  if (!supabase.isConfigured) {
    issues.push(
      'Supabase auth is not configured in this deploy. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Netlify and redeploy (NEXT_PUBLIC_* values are baked in at build time).'
    );
  }

  if (!dependencies.databaseConfigured) {
    issues.push(
      'Database is not configured. Login can succeed in Supabase but profile sync will fail until DATABASE_URL points to your Postgres database.'
    );
  }

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {issues.map((issue) => (
        <Alert key={issue} variant="error">
          {issue}
        </Alert>
      ))}
    </div>
  );
}
