import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { getStripeConfig } from '@/lib/billing/config';
import { requireSessionUser } from '@/lib/auth/server';
import * as subscriptionService from '@/server/services/subscription.service';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!getStripeConfig().isConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this server.' },
        { status: 503 }
      );
    }

    const session = await subscriptionService.createBillingPortalSession(user.id);
    return jsonData(session);
  } catch (error) {
    return jsonError(error);
  }
}
