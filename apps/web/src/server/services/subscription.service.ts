import type { BillingCycle, Subscription as DbSubscription, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import type Stripe from 'stripe';
import { checkoutPlanSchema, type CheckoutPlanInput } from '@mileage-copilot/shared';
import { ValidationError } from '@/lib/api/response';
import { getStripeConfig, planFromPriceId, priceIdForPlan } from '@/lib/billing/config';
import { ensureSubscription } from '@/lib/billing/subscription-access';
import { getStripeClient } from '@/lib/billing/stripe';
import { prisma } from '@/lib/db/prisma';
import { getUsageSummary } from '@/server/services/usage.service';

const PAID_PLANS: SubscriptionPlan[] = ['pro', 'small_business', 'enterprise'];

export { hasUnlimitedUsage } from '@/lib/billing/subscription-access';
export { ensureSubscription } from '@/lib/billing/subscription-access';

export function serializeSubscription(subscription: DbSubscription) {
  return {
    plan: subscription.plan,
    status: subscription.status,
    billingCycle: subscription.billingCycle,
    currentPeriodStart: subscription.currentPeriodStart?.toISOString() ?? null,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    canceledAt: subscription.canceledAt?.toISOString() ?? null,
    trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
    hasStripeCustomer: Boolean(subscription.stripeCustomerId),
    hasStripeSubscription: Boolean(subscription.stripeSubscriptionId),
  };
}

export async function getBillingSummary(userId: string) {
  const [subscription, usage] = await Promise.all([
    ensureSubscription(userId),
    getUsageSummary(userId),
  ]);

  return {
    subscription: serializeSubscription(subscription),
    usage,
    stripeConfigured: getStripeConfig().isConfigured,
  };
}

async function getUserEmail(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!profile?.email) {
    throw new ValidationError('User profile not found');
  }

  return profile.email;
}

export async function getOrCreateStripeCustomer(userId: string) {
  const subscription = await ensureSubscription(userId);
  if (subscription.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const stripe = getStripeClient();
  const email = await getUserEmail(userId);
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await prisma.subscription.update({
    where: { userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(userId: string, input: CheckoutPlanInput) {
  const plan = checkoutPlanSchema.parse(input);
  const { appUrl } = getStripeConfig();
  const stripe = getStripeClient();
  const customerId = await getOrCreateStripeCustomer(userId);
  const priceId = priceIdForPlan(plan);

  if (!priceId) {
    throw new ValidationError('Stripe price is not configured for this plan');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?checkout=success`,
    cancel_url: `${appUrl}/billing?checkout=canceled`,
    metadata: {
      userId,
      plan,
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  });

  if (!session.url) {
    throw new ValidationError('Could not create Stripe checkout session');
  }

  return { url: session.url };
}

export async function createBillingPortalSession(userId: string) {
  const subscription = await ensureSubscription(userId);
  if (!subscription.stripeCustomerId) {
    throw new ValidationError('No billing account found. Subscribe to a paid plan first.');
  }

  const { appUrl } = getStripeConfig();
  const stripe = getStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/billing`,
  });

  if (!session.url) {
    throw new ValidationError('Could not open billing portal');
  }

  return { url: session.url };
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
      return 'incomplete';
    default:
      return 'active';
  }
}

function billingCycleFromStripe(interval?: string | null): BillingCycle | null {
  if (interval === 'year') {
    return 'annual';
  }
  if (interval === 'month') {
    return 'monthly';
  }
  return null;
}

async function resolveUserIdFromStripe(
  stripeSubscription: Stripe.Subscription,
  customerId: string | null
): Promise<string | null> {
  if (stripeSubscription.metadata.userId) {
    return stripeSubscription.metadata.userId;
  }

  if (customerId) {
    const byCustomer = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      select: { userId: true },
    });
    if (byCustomer) {
      return byCustomer.userId;
    }
  }

  return null;
}

export async function syncStripeSubscription(stripeSubscription: Stripe.Subscription) {
  const customerId =
    typeof stripeSubscription.customer === 'string'
      ? stripeSubscription.customer
      : stripeSubscription.customer?.id ?? null;

  const userId = await resolveUserIdFromStripe(stripeSubscription, customerId);
  if (!userId) {
    console.warn('Stripe subscription sync skipped: user not found', stripeSubscription.id);
    return;
  }

  const priceId = stripeSubscription.items.data[0]?.price?.id;
  const metadataPlan = stripeSubscription.metadata.plan as SubscriptionPlan | undefined;
  const plan =
    metadataPlan && PAID_PLANS.includes(metadataPlan)
      ? metadataPlan
      : priceId
        ? planFromPriceId(priceId)
        : 'pro';

  const status = mapStripeStatus(stripeSubscription.status);
  const isCanceled = status === 'canceled' || stripeSubscription.status === 'canceled';

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: isCanceled ? 'free' : plan,
      status: isCanceled ? 'canceled' : status,
      billingCycle: billingCycleFromStripe(stripeSubscription.items.data[0]?.price?.recurring?.interval),
      stripeCustomerId: customerId,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      trialEndsAt: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
    },
    update: {
      plan: isCanceled ? 'free' : plan,
      status: isCanceled ? 'canceled' : status,
      billingCycle: billingCycleFromStripe(stripeSubscription.items.data[0]?.price?.recurring?.interval),
      stripeCustomerId: customerId,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      canceledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      trialEndsAt: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
    },
  });
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? null;

  if (!userId) {
    return;
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: (session.metadata?.plan as SubscriptionPlan) ?? 'pro',
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
  });

  if (subscriptionId) {
    const stripe = getStripeClient();
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    await syncStripeSubscription(stripeSubscription);
  }
}

export async function downgradeToFree(userId: string) {
  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: 'free',
      status: 'canceled',
      stripeSubscriptionId: null,
      billingCycle: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      canceledAt: new Date(),
    },
  });
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await syncStripeSubscription(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted': {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof stripeSubscription.customer === 'string'
          ? stripeSubscription.customer
          : stripeSubscription.customer?.id ?? null;
      const userId = await resolveUserIdFromStripe(stripeSubscription, customerId);
      if (userId) {
        await downgradeToFree(userId);
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id ?? null;
      if (subscriptionId) {
        const stripe = getStripeClient();
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncStripeSubscription(stripeSubscription);
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id ?? null;
      if (subscriptionId) {
        const stripe = getStripeClient();
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        await syncStripeSubscription(stripeSubscription);
      }
      break;
    }
    default:
      break;
  }
}
