import { NextResponse } from 'next/server';
import type { CategorySuggestFields } from '@mileage-copilot/shared';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as categoryService from '@/server/services/category-suggestion.service';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const suggestion = await categoryService.getCategorySuggestionForReceipt(user.id, id);
    return jsonData({ suggestion });
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
    const body = (await request.json().catch(() => ({}))) as CategorySuggestFields;
    const suggestion = await categoryService.getCategorySuggestionForReceipt(user.id, id, body);
    return jsonData({ suggestion });
  } catch (error) {
    return jsonError(error);
  }
}
