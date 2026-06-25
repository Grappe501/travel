'use client';

import { Alert, ButtonLink } from '@/components/ui';

type UpgradeLimitAlertProps = {
  error: string | null;
  errorCode?: string | null;
};

function isSubscriptionLimit(error: string | null, errorCode?: string | null) {
  if (errorCode === 'SUBSCRIPTION_LIMIT_REACHED') return true;
  if (!error) return false;
  return /upgrade to pro/i.test(error) || /plan limit/i.test(error);
}

export function UpgradeLimitAlert({ error, errorCode }: UpgradeLimitAlertProps) {
  if (!error) return null;

  if (!isSubscriptionLimit(error, errorCode)) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <Alert variant="warning">
      <p>{error}</p>
      <div className="mt-3">
        <ButtonLink href="/billing" size="sm">
          View plans &amp; upgrade
        </ButtonLink>
      </div>
    </Alert>
  );
}
