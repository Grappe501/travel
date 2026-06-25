import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as gpsService from '@/server/services/gps-tracking.service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const summary = await gpsService.getRouteSummary(user.id, id);
    return jsonData(summary);
  } catch (error) {
    return jsonError(error);
  }
}
