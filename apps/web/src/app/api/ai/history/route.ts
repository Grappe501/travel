import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as aiFeedbackService from '@/server/services/ai-feedback.service';

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);

    const history = await aiFeedbackService.listAIHistory(user.id, limit);
    return jsonData(history);
  } catch (error) {
    return jsonError(error);
  }
}
