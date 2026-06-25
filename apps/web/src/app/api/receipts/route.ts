import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import * as receiptService from '@/server/services/receipt.service';

export async function GET() {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const receipts = await receiptService.listReceipts(user.id);
    return jsonData(receipts);
  } catch (error) {
    return jsonError(error);
  }
}
