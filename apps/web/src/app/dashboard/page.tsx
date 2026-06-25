import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ActiveTripBanner } from '@/components/trips/ActiveTripBanner';
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
import { isV12SchemaReady } from '@/lib/db/schema-health';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { getUserProfile } from '@/server/services/auth.service';
import * as expenseService from '@/server/services/expense.service';
import * as receiptService from '@/server/services/receipt.service';
import * as tripService from '@/server/services/trip.service';
import type { SerializedExpense } from '@/server/services/expense.service';
import type { SerializedReceipt } from '@/server/services/receipt.service';
import type { SerializedTrip } from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const QUICK_LINKS = [
  { href: '/trips/start', title: 'Start trip', description: 'Log business mileage' },
  { href: '/receipts/upload', title: 'Upload receipt', description: 'Scan and categorize' },
  { href: '/expenses/new', title: 'Add expense', description: 'Manual entry' },
  { href: '/clients', title: 'Clients', description: 'Clients & projects' },
  { href: '/reports', title: 'Reports', description: 'Export for taxes' },
  { href: '/ai/history', title: 'AI history', description: 'OCR & suggestions' },
] as const;

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

  const schemaReady = dbError ? false : await isV12SchemaReady();
  let trips: SerializedTrip[] = [];
  let receipts: SerializedReceipt[] = [];
  let expenses: SerializedExpense[] = [];
  let activeTrip: SerializedTrip | null = null;
  let statsError: string | null = null;

  if (!dbError && schemaReady) {
    try {
      [trips, receipts, expenses, activeTrip] = await Promise.all([
        tripService.listTrips(user.id),
        receiptService.listReceipts(user.id),
        expenseService.listExpenses(user.id),
        tripService.getActiveTrip(user.id),
      ]);
    } catch (error) {
      console.error('Dashboard stats load failed:', error);
      statsError = 'Could not load trip, receipt, or expense counts.';
    }
  }

  const completedTrips = trips.filter((trip) => trip.status === 'completed').length;
  const showSetupPrompt =
    onboarding.needsOnboarding || !onboarding.hasBusiness || !onboarding.hasVehicle;

  return (
    <DashboardShell
      title="Dashboard"
      description="Track trips, receipts, and expenses in one place."
      badge={<Badge variant="primary">V1.2</Badge>}
      actions={<LogoutButton />}
    >
      {dbError ? <Alert variant="error">{dbError}</Alert> : null}

      {!schemaReady && !dbError ? (
        <Alert variant="error">
          Database migrations are pending for v1.2 (clients, projects, AI history). Redeploy after
          setting <code className="font-mono text-micro">DIRECT_URL</code> in Netlify, or run{' '}
          <code className="font-mono text-micro">pnpm db:migrate:deploy</code> against production.
        </Alert>
      ) : null}

      {statsError ? <Alert variant="error">{statsError}</Alert> : null}

      {activeTrip ? <ActiveTripBanner trip={activeTrip} /> : null}

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

      {schemaReady && !dbError && !statsError ? (
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="space-y-1 py-4">
              <p className="text-2xl font-semibold tabular-nums">{completedTrips}</p>
              <p className="text-caption text-muted">Trips</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="space-y-1 py-4">
              <p className="text-2xl font-semibold tabular-nums">{receipts.length}</p>
              <p className="text-caption text-muted">Receipts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="space-y-1 py-4">
              <p className="text-2xl font-semibold tabular-nums">{expenses.length}</p>
              <p className="text-caption text-muted">Expenses</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Jump to common tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-0 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40 hover:bg-surface-elevated"
            >
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-caption text-muted">{item.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in as {profile?.email ?? user.email}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/settings" className="text-body font-medium text-primary hover:underline">
            Settings & preferences →
          </Link>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
