import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as duplicateService from '@/server/services/duplicate-detection.service';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const duplicates = await duplicateService.getDuplicateCheckForReceipt(user.id, id);
    return jsonData({ duplicates });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as duplicateService.DuplicateCheckFields;
    const duplicates = await duplicateService.getDuplicateCheckForReceipt(user.id, id, body);
    return jsonData({ duplicates });
  } catch (error) {
    return jsonError(error);
  }
}
