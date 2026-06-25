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
import { UsageSummaryCard } from '@/components/billing/UsageMeter';
import { getUserProfile } from '@/server/services/auth.service';
import * as dashboardService from '@/server/services/dashboard.service';
import * as tripService from '@/server/services/trip.service';
import * as usageService from '@/server/services/usage.service';
import type { SerializedTrip } from '@/server/services/trip.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const QUICK_LINKS = [
  { href: '/search', title: 'Search', description: 'Find trips, receipts, and clients' },
  { href: '/trips/start', title: 'Start trip', description: 'Log business mileage' },
  { href: '/receipts/upload', title: 'Upload receipt', description: 'Scan and categorize' },
  { href: '/expenses/new', title: 'Add expense', description: 'Manual entry' },
  { href: '/clients', title: 'Clients', description: 'Clients & projects' },
  { href: '/reports', title: 'Reports', description: 'Export for taxes' },
  { href: '/ai/history', title: 'AI history', description: 'OCR & suggestions' },
] as const;

function formatMiles(miles: number) {
  return miles.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function formatUsd(amount: number) {
  return `$${amount.toFixed(2)}`;
}

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
  let summary: dashboardService.DashboardSummary | null = null;
  let usage: Awaited<ReturnType<typeof usageService.getUsageSummary>> | null = null;
  let activeTrip: SerializedTrip | null = null;
  let statsError: string | null = null;

  if (!dbError && schemaReady) {
    try {
      [summary, usage, activeTrip] = await Promise.all([
        dashboardService.getDashboardSummary(user.id),
        usageService.getUsageSummary(user.id),
        tripService.getActiveTrip(user.id),
      ]);
    } catch (error) {
      console.error('Dashboard stats load failed:', error);
      statsError = 'Could not load dashboard summary.';
    }
  }

  const showSetupPrompt =
    onboarding.needsOnboarding || !onboarding.hasBusiness || !onboarding.hasVehicle;

  const attentionCount =
    (summary?.pendingReviewCount ?? 0) +
    (summary?.unlinkedReceiptCount ?? 0) +
    (summary?.unlinkedExpenseCount ?? 0);

  return (
    <DashboardShell
      title="Dashboard"
      description="Track trips, receipts, and expenses in one place."
      badge={<Badge variant="primary">V1.6</Badge>}
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

      {schemaReady && !dbError && usage ? (
        <UsageSummaryCard
          tripsCount={usage.tripsCount}
          tripsLimit={usage.tripsLimit}
          receiptsCount={usage.receiptsCount}
          receiptsLimit={usage.receiptsLimit}
          unlimited={usage.unlimited}
          resetsAt={usage.resetsAt}
        />
      ) : null}

      {schemaReady && !dbError && !statsError && summary ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="text-center">
              <CardContent className="space-y-1 py-4">
                <p className="text-2xl font-semibold tabular-nums">{formatMiles(summary.todayMiles)}</p>
                <p className="text-caption text-muted">Today&apos;s miles</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="space-y-1 py-4">
                <p className="text-2xl font-semibold tabular-nums">{formatMiles(summary.monthMiles)}</p>
                <p className="text-caption text-muted">Month miles</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="space-y-1 py-4">
                <p className="text-2xl font-semibold tabular-nums">{formatUsd(summary.monthExpenses)}</p>
                <p className="text-caption text-muted">Month expenses</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="space-y-1 py-4">
                <p className="text-2xl font-semibold tabular-nums">{formatUsd(summary.monthReimbursement)}</p>
                <p className="text-caption text-muted">Month mileage $</p>
              </CardContent>
            </Card>
          </div>

          {attentionCount > 0 || summary.recentTripsWithoutExpenses > 0 ? (
            <Card className="border-warning/40">
              <CardHeader>
                <CardTitle>Needs attention</CardTitle>
                <CardDescription>Items to review before your next report.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-body">
                  <Link href="/notifications" className="font-medium text-primary hover:underline">
                    View all in notification center →
                  </Link>
                </p>
                {summary.pendingReviewCount > 0 ? (
                  <p className="text-body">
                    <Link href="/receipts" className="font-medium text-primary hover:underline">
                      {summary.pendingReviewCount} receipt{summary.pendingReviewCount === 1 ? '' : 's'} pending review
                    </Link>
                  </p>
                ) : null}
                {summary.unlinkedReceiptCount > 0 ? (
                  <p className="text-body">
                    <Link href="/receipts" className="font-medium text-primary hover:underline">
                      {summary.unlinkedReceiptCount} unlinked receipt
                      {summary.unlinkedReceiptCount === 1 ? '' : 's'}
                    </Link>
                  </p>
                ) : null}
                {summary.unlinkedExpenseCount > 0 ? (
                  <p className="text-body">
                    <Link href="/expenses" className="font-medium text-primary hover:underline">
                      {summary.unlinkedExpenseCount} expense
                      {summary.unlinkedExpenseCount === 1 ? '' : 's'} not on a trip
                    </Link>
                  </p>
                ) : null}
                {summary.recentTripsWithoutExpenses > 0 ? (
                  <p className="text-body">
                    <Link href="/trips" className="font-medium text-primary hover:underline">
                      {summary.recentTripsWithoutExpenses} recent trip
                      {summary.recentTripsWithoutExpenses === 1 ? '' : 's'} with no expenses
                    </Link>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </>
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
