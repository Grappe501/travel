import { Alert, ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

const WARNING_THRESHOLD = 0.8;

type UsageMeterProps = {
  label: string;
  count: number;
  limit: number | null;
  unlimited?: boolean;
};

function usageState(count: number, limit: number | null, unlimited?: boolean) {
  if (unlimited || limit === null) return 'ok' as const;
  if (count >= limit) return 'exceeded' as const;
  if (count / limit >= WARNING_THRESHOLD) return 'warning' as const;
  return 'ok' as const;
}

export function UsageMeterRow({ label, count, limit, unlimited }: UsageMeterProps) {
  const state = usageState(count, limit, unlimited);
  const percent =
    unlimited || limit === null ? 100 : Math.min(100, Math.round((count / limit) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-caption">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted">
          {unlimited || limit === null ? `${count} this month (unlimited)` : `${count} / ${limit}`}
        </span>
      </div>
      {!unlimited && limit !== null ? (
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-elevated"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-label={`${label} usage`}
        >
          <div
            className={`h-full rounded-full transition-all ${
              state === 'exceeded'
                ? 'bg-danger'
                : state === 'warning'
                  ? 'bg-warning'
                  : 'bg-primary'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

type UsageSummaryCardProps = {
  tripsCount: number;
  tripsLimit: number | null;
  receiptsCount: number;
  receiptsLimit: number | null;
  unlimited: boolean;
  resetsAt: string;
};

export function UsageSummaryCard({
  tripsCount,
  tripsLimit,
  receiptsCount,
  receiptsLimit,
  unlimited,
  resetsAt,
}: UsageSummaryCardProps) {
  if (unlimited) return null;

  const tripState = usageState(tripsCount, tripsLimit, unlimited);
  const receiptState = usageState(receiptsCount, receiptsLimit, unlimited);
  const showWarning = tripState !== 'ok' || receiptState !== 'ok';

  return (
    <Card className={showWarning ? 'border-warning/40' : undefined}>
      <CardHeader>
        <CardTitle>Free plan usage</CardTitle>
        <CardDescription>Resets on {resetsAt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <UsageMeterRow
          label="Trips"
          count={tripsCount}
          limit={tripsLimit}
          unlimited={unlimited}
        />
        <UsageMeterRow
          label="Receipts"
          count={receiptsCount}
          limit={receiptsLimit}
          unlimited={unlimited}
        />
        {showWarning ? (
          <Alert variant="warning">
            {tripState === 'exceeded' || receiptState === 'exceeded'
              ? 'You have reached a free-tier limit. Upgrade for unlimited trips and receipts.'
              : 'You are approaching a free-tier limit. Consider upgrading before you run out.'}
            <div className="mt-3">
              <ButtonLink href="/billing" size="sm">
                View plans
              </ButtonLink>
            </div>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
