import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { AdminUserSummary } from '@/server/services/admin.service';

function planBadge(plan: string) {
  if (plan === 'free') return <Badge variant="outline">Free</Badge>;
  return <Badge variant="primary">{plan}</Badge>;
}

type AdminUserSummaryCardProps = {
  summary: AdminUserSummary;
};

export function AdminUserSummaryCard({ summary }: AdminUserSummaryCardProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-body">
          <p>
            <span className="text-muted">Email:</span> {summary.email}
          </p>
          {summary.displayName ? (
            <p>
              <span className="text-muted">Display name:</span> {summary.displayName}
            </p>
          ) : null}
          <p>
            <span className="text-muted">Status:</span> {summary.accountStatus}
          </p>
          <p>
            <span className="text-muted">Onboarding:</span>{' '}
            {summary.onboardingCompleted ? 'Complete' : 'Incomplete'}
          </p>
          <p>
            <span className="text-muted">Joined:</span>{' '}
            {new Date(summary.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-body">
          <div className="flex items-center gap-2">
            {planBadge(summary.subscription.plan)}
            <span className="text-muted">{summary.subscription.status}</span>
          </div>
          {summary.subscription.currentPeriodEnd ? (
            <p className="text-caption text-muted">
              Period ends {summary.subscription.currentPeriodEnd.slice(0, 10)}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage this month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-body">
          <p>
            Trips: {summary.usage.tripsCount}
            {summary.usage.tripsLimit !== null ? ` / ${summary.usage.tripsLimit}` : ' (unlimited)'}
          </p>
          <p>
            Receipts: {summary.usage.receiptsCount}
            {summary.usage.receiptsLimit !== null
              ? ` / ${summary.usage.receiptsLimit}`
              : ' (unlimited)'}
          </p>
          <p className="text-caption text-muted">Resets {summary.usage.resetsAt}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity counts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-body sm:grid-cols-2">
          <p>Trips (total): {summary.counts.tripsTotal}</p>
          <p>Trips (30d): {summary.counts.tripsRecent}</p>
          <p>Receipts (total): {summary.counts.receiptsTotal}</p>
          <p>Receipts (30d): {summary.counts.receiptsRecent}</p>
          <p>Expenses: {summary.counts.expensesTotal}</p>
          <p>Businesses: {summary.counts.businessesTotal}</p>
        </CardContent>
      </Card>
    </div>
  );
}

type AdminHealthPanelProps = {
  health: Awaited<ReturnType<typeof import('@/server/services/admin.service').getAdminSystemHealth>>;
};

export function AdminHealthPanel({ health }: AdminHealthPanelProps) {
  const entries = Object.entries(health.dependencies);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overall</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-body">
          <p>
            Status:{' '}
            <Badge variant={health.status === 'ok' ? 'success' : 'warning'}>{health.status}</Badge>
          </p>
          <p>Database ping: {health.databaseOk ? 'OK' : 'Failed'}</p>
          <p className="text-caption text-muted">
            {health.slice} · {health.step} · {health.build} · {health.nodeEnv}
          </p>
          {health.commitRef ? (
            <p className="text-caption text-muted">Commit: {health.commitRef.slice(0, 7)}</p>
          ) : null}
          {health.deployUrl ? (
            <p className="text-caption text-muted">Deploy: {health.deployUrl}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production readiness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-body">
          <p>
            Core:{' '}
            <Badge variant={health.readiness.coreReady ? 'success' : 'warning'}>
              {health.readiness.coreReady ? 'ready' : 'degraded'}
            </Badge>
          </p>
          <p>
            Full production:{' '}
            <Badge variant={health.readiness.productionReady ? 'success' : 'outline'}>
              {health.readiness.productionReady ? 'ready' : 'incomplete'}
            </Badge>
            {health.readiness.stripeMode !== 'off' ? (
              <span className="ml-2 text-caption text-muted">Stripe: {health.readiness.stripeMode}</span>
            ) : null}
          </p>
          <ul className="space-y-2">
            {health.readiness.gates.map((gate) => (
              <li key={gate.id} className="flex flex-wrap items-start justify-between gap-2 text-caption">
                <span>
                  {gate.label}
                  {gate.hint && !gate.ready ? (
                    <span className="block text-muted">{gate.hint}</span>
                  ) : null}
                </span>
                <Badge variant={gate.ready ? 'success' : gate.tier === 'core' ? 'warning' : 'outline'}>
                  {gate.ready ? 'ok' : gate.tier}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dependencies</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-2 text-body">
              <span className="text-muted">{key}</span>
              <Badge variant={value ? 'success' : 'outline'}>{value ? 'yes' : 'no'}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
