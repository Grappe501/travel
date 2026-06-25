import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/response';
import { getStripeConfig } from '@/lib/billing/config';
import { getStripeClient } from '@/lib/billing/stripe';
import * as subscriptionService from '@/server/services/subscription.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { webhookSecret } = getStripeConfig();
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const body = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    await subscriptionService.handleStripeWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    if (
      error instanceof Error &&
      /signature|webhook/i.test(error.message)
    ) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }
    return jsonError(error);
  }
}
