import { searchQuerySchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as searchService from '@/server/services/search.service';

export const runtime = 'nodejs';

function optionalParam(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = searchQuerySchema.safeParse({
      q: searchParams.get('q') ?? '',
      limit: searchParams.get('limit') ?? undefined,
      from: optionalParam(searchParams.get('from')),
      to: optionalParam(searchParams.get('to')),
      amountMin: optionalParam(searchParams.get('amountMin')),
      amountMax: optionalParam(searchParams.get('amountMax')),
      kind: optionalParam(searchParams.get('kind')),
      category: optionalParam(searchParams.get('category')),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid search query' },
        { status: 400 }
      );
    }

    const results = await searchService.unifiedSearch(user.id, parsed.data);
    return jsonData(results);
  } catch (error) {
    return jsonError(error);
  }
}
