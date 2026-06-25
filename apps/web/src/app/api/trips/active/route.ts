import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as tripService from '@/server/services/trip.service';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await tripService.getActiveTrip(user.id);
    return jsonData(trip);
  } catch (error) {
    return jsonError(error);
  }
}
