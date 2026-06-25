import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as reportService from '@/server/services/report.service';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { buffer, mimeType, filename } = await reportService.getReportDownload(user.id, id);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
