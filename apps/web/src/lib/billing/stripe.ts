import Stripe from 'stripe';
import { getStripeConfig } from '@/lib/billing/config';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  const { secretKey, isConfigured } = getStripeConfig();
  if (!isConfigured) {
    throw new Error('Stripe is not configured');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}
