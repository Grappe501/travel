import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Alert, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile, getUserProfile } from '@/server/services/auth.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  let profile = null;
  let dbError: string | null = null;

  try {
    await ensureUserProfile({
      id: user.id,
      email: user.email,
      emailVerified: Boolean(user.email_confirmed_at),
    });
    profile = await getUserProfile(user.id);
  } catch (error) {
    console.error('Dashboard profile sync failed:', error);
    dbError =
      'Could not sync your profile with the database. Set DATABASE_URL in Netlify and run migrations.';
  }

  return (
    <DashboardShell
      title="Dashboard"
      description="Trip and expense overview — more in upcoming slices."
      badge={<Badge variant="primary">V1</Badge>}
      actions={<LogoutButton />}
    >
      {dbError ? <Alert variant="error">{dbError}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            {dbError ? 'Signed in via Supabase.' : 'Signed in and synced with your profile.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-body">
          <p>
            Signed in as <strong>{profile?.email ?? user.email}</strong>
          </p>
          {profile ? (
            <p className="text-caption text-muted">
              Profile ID: <code className="font-mono text-micro">{profile.id}</code>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
