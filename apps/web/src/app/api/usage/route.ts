import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as subscriptionService from '@/server/services/subscription.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await subscriptionService.getBillingSummary(user.id);
    return jsonData(summary);
  } catch (error) {
    return jsonError(error);
  }
}
