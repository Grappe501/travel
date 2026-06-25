import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as reportService from '@/server/services/report.service';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const reports = await reportService.listReports(user.id);
    return jsonData(reports);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const report = await reportService.generateReport(user.id, body);
    return jsonData(report, 201);
  } catch (error) {
    return jsonError(error);
  }
}
