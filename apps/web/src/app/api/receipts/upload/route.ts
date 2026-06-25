import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as receiptService from '@/server/services/receipt.service';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const businessId = formData.get('businessId');
    const tripId = formData.get('tripId');
    const idempotencyKey = formData.get('idempotencyKey');

    const receipt = await receiptService.uploadReceipt(user.id, file, {
      ...(typeof businessId === 'string' && businessId ? { businessId } : {}),
      ...(typeof tripId === 'string' && tripId ? { tripId } : {}),
      ...(typeof idempotencyKey === 'string' && idempotencyKey ? { idempotencyKey } : {}),
    });

    return jsonData(receipt, 201);
  } catch (error) {
    return jsonError(error);
  }
}
