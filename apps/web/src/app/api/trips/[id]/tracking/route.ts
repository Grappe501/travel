import { tripTrackingPatchSchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as gpsService from '@/server/services/gps-tracking.service';
import * as tripService from '@/server/services/trip.service';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = tripTrackingPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const updated = await gpsService.setTripTracking(user.id, id, parsed.data.trackingEnabled);
    return jsonData(tripService.serializeTrip(updated));
  } catch (error) {
    return jsonError(error);
  }
}
