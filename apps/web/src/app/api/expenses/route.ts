import { expenseCreateSchema, expenseListQuerySchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as expenseService from '@/server/services/expense.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = expenseListQuerySchema.safeParse({
      categorySlug: searchParams.get('categorySlug') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
      tripId: searchParams.get('tripId') ?? undefined,
      businessId: searchParams.get('businessId') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid query' },
        { status: 400 }
      );
    }

    const expenses = await expenseService.listExpenses(user.id, parsed.data);
    return jsonData(expenses);
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
    const parsed = expenseCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const expense = await expenseService.createExpense(user.id, parsed.data);
    return jsonData(expense, 201);
  } catch (error) {
    return jsonError(error);
  }
}
