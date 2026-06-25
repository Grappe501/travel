import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import { restoreEntitySchema } from '@mileage-copilot/shared';
import * as restoreService from '@/server/services/restore.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = restoreEntitySchema.parse(body);
    const result = await restoreService.restoreEntity(user.id, data.entityType, data.entityId);
    return jsonData(result);
  } catch (error) {
    return jsonError(error);
  }
}
