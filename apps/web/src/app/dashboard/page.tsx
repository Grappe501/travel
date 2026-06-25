import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
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
    <DashboardShell
      title="Dashboard"
      description="Trip and expense overview — more in upcoming slices."
      badge={<Badge variant="primary">V1</Badge>}
      actions={<LogoutButton />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in and synced with your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-body">
          <p>
            Signed in as <strong>{profile?.email ?? user.email}</strong>
          </p>
          <p className="text-caption text-muted">
            Profile ID: <code className="font-mono text-micro">{profile?.id}</code>
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
