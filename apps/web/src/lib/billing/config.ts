import type { SubscriptionPlan } from '@prisma/client';

export const FREE_TRIPS_PER_MONTH = 5;
export const FREE_RECEIPTS_PER_MONTH = 10;

export const PLAN_DISPLAY: Record<
  SubscriptionPlan,
  { name: string; priceLabel: string; description: string }
> = {
  free: {
    name: 'Free',
    priceLabel: '$0',
    description: '5 trips and 10 receipts per month',
  },
  pro: {
    name: 'Pro',
    priceLabel: '$4.99/mo',
    description: 'Unlimited personal mileage and receipts',
  },
  small_business: {
    name: 'Small Business',
    priceLabel: '$19.99/mo',
    description: 'Unlimited usage for up to 5 employees',
  },
  enterprise: {
    name: 'Enterprise',
    priceLabel: 'Custom',
    description: 'Custom limits and SSO',
  },
};

export function getStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const priceProMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const priceSmallBusinessMonthly = process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const isConfigured = Boolean(
    secretKey &&
      !secretKey.includes('...') &&
      publishableKey &&
      !publishableKey.includes('...') &&
      priceProMonthly &&
      priceSmallBusinessMonthly
  );

  return {
    secretKey: secretKey ?? '',
    webhookSecret: webhookSecret ?? '',
    publishableKey: publishableKey ?? '',
    priceProMonthly: priceProMonthly ?? '',
    priceSmallBusinessMonthly: priceSmallBusinessMonthly ?? '',
    appUrl,
    isConfigured,
  };
}

export function priceIdForPlan(plan: 'pro' | 'small_business'): string {
  const config = getStripeConfig();
  if (plan === 'pro') {
    return config.priceProMonthly;
  }
  return config.priceSmallBusinessMonthly;
}

export function planFromPriceId(priceId: string): SubscriptionPlan {
  const config = getStripeConfig();
  if (priceId === config.priceSmallBusinessMonthly) {
    return 'small_business';
  }
  if (priceId === config.priceProMonthly) {
    return 'pro';
  }
  return 'pro';
}
