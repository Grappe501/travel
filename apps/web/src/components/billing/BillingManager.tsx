'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Alert, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { UsageMeterRow } from '@/components/billing/UsageMeter';
import { PLAN_DISPLAY } from '@/lib/billing/config';
import type { SerializedBillingSummary } from '@/lib/types/core';

function planBadge(plan: string, status: string) {
  if (plan === 'free') {
    return <Badge variant="outline">Free</Badge>;
  }
  if (status === 'past_due') {
    return <Badge variant="warning">Payment issue</Badge>;
  }
  if (status === 'active' || status === 'trialing') {
    return <Badge variant="success">{PLAN_DISPLAY[plan as keyof typeof PLAN_DISPLAY]?.name ?? plan}</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
}

function usageLine(label: string, count: number, limit: number | null) {
  if (limit === null) {
    return (
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{label}:</span> {count} this month (unlimited)
      </p>
    );
  }

  return (
    <UsageMeterRow label={label} count={count} limit={limit} />
  );
}

type BillingManagerProps = {
  summary: SerializedBillingSummary;
};

export function BillingManager({ summary }: BillingManagerProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const checkoutStatus = searchParams.get('checkout');
  const { subscription, usage, stripeConfigured } = summary;
  const planInfo = PLAN_DISPLAY[subscription.plan as keyof typeof PLAN_DISPLAY] ?? PLAN_DISPLAY.free;
  const isPaid = subscription.plan !== 'free';

  async function startCheckout(plan: 'pro' | 'small_business') {
    setLoadingPlan(plan);
    setError(null);

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not start checkout');
      setLoadingPlan(null);
      return;
    }

    window.location.href = result.data.url;
  }

  async function openPortal() {
    setLoadingPortal(true);
    setError(null);

    const response = await fetch('/api/stripe/portal', { method: 'POST' });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Could not open billing portal');
      setLoadingPortal(false);
      return;
    }

    window.location.href = result.data.url;
  }

  return (
    <div className="space-y-6">
      {checkoutStatus === 'success' && (
        <Alert variant="success">Subscription updated. Your plan may take a moment to sync.</Alert>
      )}
      {checkoutStatus === 'canceled' && (
        <Alert variant="info">Checkout canceled. No charges were made.</Alert>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">{planInfo.name}</span>
            {planBadge(subscription.plan, subscription.status)}
            <span className="text-sm text-gray-500">{planInfo.priceLabel}</span>
          </div>
          <p className="text-sm text-gray-600">{planInfo.description}</p>
          {subscription.currentPeriodEnd && isPaid && (
            <p className="text-sm text-gray-500">
              Current period ends {subscription.currentPeriodEnd.slice(0, 10)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage this month</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {usageLine('Trips', usage.tripsCount, usage.tripsLimit)}
          {usageLine('Receipts', usage.receiptsCount, usage.receiptsLimit)}
          <p className="text-xs text-gray-500">Resets on {usage.resetsAt}</p>
        </CardContent>
      </Card>

      {!usage.unlimited && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{PLAN_DISPLAY.pro.description}</p>
              <p className="text-lg font-semibold">{PLAN_DISPLAY.pro.priceLabel}</p>
              <Button
                type="button"
                disabled={!stripeConfigured || loadingPlan !== null}
                onClick={() => startCheckout('pro')}
              >
                {loadingPlan === 'pro' ? 'Redirecting…' : 'Upgrade to Pro'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Small Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{PLAN_DISPLAY.small_business.description}</p>
              <p className="text-lg font-semibold">{PLAN_DISPLAY.small_business.priceLabel}</p>
              <Button
                type="button"
                variant="secondary"
                disabled={!stripeConfigured || loadingPlan !== null}
                onClick={() => startCheckout('small_business')}
              >
                {loadingPlan === 'small_business' ? 'Redirecting…' : 'Upgrade to Small Business'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {isPaid && subscription.hasStripeCustomer && (
        <Button type="button" variant="secondary" disabled={loadingPortal} onClick={openPortal}>
          {loadingPortal ? 'Opening…' : 'Manage subscription'}
        </Button>
      )}

      {!stripeConfigured && (
        <Alert variant="warning">
          Stripe checkout is not configured. Add STRIPE_SECRET_KEY, price IDs, and publishable key to
          enable upgrades.
        </Alert>
      )}
    </div>
  );
}
