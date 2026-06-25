import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';
import * as exportService from '@/server/services/export.service';

export const runtime = 'nodejs';

const EXPORT_RATE_LIMIT = { limit: 3, windowMs: 60 * 60 * 1000 };

export async function POST() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    checkRateLimit(rateLimitKey(user.id, 'account-export'), EXPORT_RATE_LIMIT.limit, EXPORT_RATE_LIMIT.windowMs);

    const bundle = await exportService.buildAccountExport(user.id);
    const filename = `mileage-expense-export-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(bundle, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
