import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { isAdminUser } from '@/lib/auth/admin';
import { requireSessionUser } from '@/lib/auth/server';
import * as adminService from '@/server/services/admin.service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function requireAdmin() {
  const user = await requireSessionUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isAdminUser(user)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user };
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'email query parameter is required' }, { status: 400 });
    }

    const lookup = await adminService.lookupUserByEmail(email);
    await adminService.recordAdminUserLookup(auth.user!.id, lookup.id, lookup.email);
    const summary = await adminService.getUserSummary(lookup.id);

    return jsonData(summary);
  } catch (error) {
    return jsonError(error);
  }
}
