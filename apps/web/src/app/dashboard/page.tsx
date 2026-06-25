import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { ShellPage } from '@/components/layout/ShellPage';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile, getUserProfile } from '@/server/services/auth.service';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  await ensureUserProfile({
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.email_confirmed_at),
  });

  const profile = await getUserProfile(user.id);

  return (
    <ShellPage title="Dashboard" description="Trip and expense overview — more in upcoming slices.">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p>
          Signed in as <strong>{profile?.email ?? user.email}</strong>
        </p>
        <p className="text-slate-500">
          Profile ID: <code className="text-xs">{profile?.id}</code>
        </p>
      </div>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </ShellPage>
  );
}
