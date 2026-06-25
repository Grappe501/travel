import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { BillingManager } from '@/components/billing/BillingManager';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { LoadingState } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';
import { ensureUserProfile } from '@/server/services/auth.service';
import * as subscriptionService from '@/server/services/subscription.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function BillingPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  await ensureUserProfile({
    id: user.id,
    email: user.email ?? '',
    emailVerified: Boolean(user.email_confirmed_at),
  });

  const summary = await subscriptionService.getBillingSummary(user.id);

  return (
    <DashboardShell
      title="Billing"
      description="View your plan, monthly usage, and upgrade options."
    >
      <Suspense fallback={<LoadingState label="Loading billing…" />}>
        <BillingManager summary={summary} />
      </Suspense>
    </DashboardShell>
  );
}
