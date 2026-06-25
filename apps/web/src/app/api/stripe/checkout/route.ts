import { checkoutPlanSchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { getStripeConfig } from '@/lib/billing/config';
import { requireSessionUser } from '@/lib/auth/server';
import * as subscriptionService from '@/server/services/subscription.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
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

    const body = await request.json();
    const parsed = checkoutPlanSchema.safeParse(body.plan ?? body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid plan' },
        { status: 400 }
      );
    }

    const session = await subscriptionService.createCheckoutSession(user.id, parsed.data);
    return jsonData(session);
  } catch (error) {
    return jsonError(error);
  }
}
