import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { isAdminUser } from '@/lib/auth/admin';
import { requireSessionUser } from '@/lib/auth/server';
import {
  fieldTestOverviewToCsv,
  getFieldTestOverview,
} from '@/server/services/field-test.service';

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

    const overview = await getFieldTestOverview();
    const { searchParams } = new URL(request.url);

    if (searchParams.get('format') === 'csv') {
      const csv = fieldTestOverviewToCsv(overview);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="field-test-${overview.generatedAt.slice(0, 10)}.csv"`,
        },
      });
    }

    return jsonData(overview);
  } catch (error) {
    return jsonError(error);
  }
}
