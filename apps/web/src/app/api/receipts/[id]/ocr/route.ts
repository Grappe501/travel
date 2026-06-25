import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import {
  checkRateLimit,
  rateLimitKey,
  RECEIPT_OCR_RATE_LIMIT,
} from '@/lib/security/rate-limit';
import * as ocrService from '@/server/services/ocr.service';

export const runtime = 'nodejs';
export const maxDuration = 60;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    checkRateLimit(
      rateLimitKey(user.id, 'receipt-ocr'),
      RECEIPT_OCR_RATE_LIMIT.limit,
      RECEIPT_OCR_RATE_LIMIT.windowMs
    );

    const receipt = await ocrService.runReceiptOcr(user.id, id);
    return jsonData(receipt);
  } catch (error) {
    return jsonError(error);
  }
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const receipt = await ocrService.getReceiptForReview(user.id, id);
    return jsonData(receipt);
  } catch (error) {
    return jsonError(error);
  }
}
