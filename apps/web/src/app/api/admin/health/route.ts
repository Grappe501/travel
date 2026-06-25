import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { isAdminUser } from '@/lib/auth/admin';
import { requireSessionUser } from '@/lib/auth/server';
import * as adminService from '@/server/services/admin.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const health = await adminService.getAdminSystemHealth();
    return jsonData(health);
  } catch (error) {
    return jsonError(error);
  }
}
