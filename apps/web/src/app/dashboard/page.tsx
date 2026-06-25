import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Alert,
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getUserProfile } from '@/server/services/auth.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function DashboardPage() {
  const { user, onboarding } = await requireAuthenticatedUser();
  let profile = null;
  let dbError: string | null = null;

  try {
    profile = await getUserProfile(user.id);
  } catch (error) {
    console.error('Dashboard profile load failed:', error);
    dbError =
      'Could not load your profile from the database. Set DATABASE_URL in Netlify and run migrations.';
  }

  const showSetupPrompt =
    onboarding.needsOnboarding || !onboarding.hasBusiness || !onboarding.hasVehicle;

  return (
    <DashboardShell
      title="Dashboard"
      description="Trip and expense overview — more in upcoming slices."
      badge={<Badge variant="primary">V1</Badge>}
      actions={<LogoutButton />}
    >
      {dbError ? <Alert variant="error">{dbError}</Alert> : null}

      {showSetupPrompt ? (
        <Card>
          <CardHeader>
            <CardTitle>Finish setting up</CardTitle>
            <CardDescription>
              Add a business and vehicle so you can log trips and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <ul className="list-inside list-disc text-caption text-muted">
              {!onboarding.hasBusiness ? <li>Create a business profile</li> : null}
              {!onboarding.hasVehicle ? <li>Add a vehicle</li> : null}
              {onboarding.needsOnboarding ? <li>Confirm your mileage rate</li> : null}
            </ul>
            <ButtonLink href="/onboarding">Continue setup</ButtonLink>
          </CardContent>
        </Card>
      ) : null}

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
          <p className="text-caption text-muted">
            Manage businesses and vehicles in{' '}
            <Link href="/businesses" className="text-primary hover:underline">
              settings
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
