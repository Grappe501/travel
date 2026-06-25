import type { OCRResult, Prisma, Receipt } from '@prisma/client';
import { EXPENSE_CATEGORY_SLUGS } from '@mileage-copilot/shared';
import { receiptApproveSchema, type ReceiptApproveInput } from '@mileage-copilot/shared';
import { extractReceiptFieldsFromImage } from '@/lib/ai/receipt-vision';
import { getOpenAiConfig } from '@/lib/ai/config';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/api/response';
import { getReceiptDisplayStatus } from '@/lib/receipts/constants';
import { prisma } from '@/lib/db/prisma';
import { getOwnedBusiness } from '@/server/services/business.service';
import { createExpenseFromReceipt } from '@/server/services/expense.service';
import { assertNoBlockingDuplicates, resolveDuplicateSuggestion } from '@/server/services/duplicate-detection.service';
import { getOwnedReceipt, getReceiptSignedUrl } from '@/server/services/receipt.service';
import { getOwnedTrip } from '@/server/services/trip.service';

const activeReceipt = { recordStatus: 'active' as const };

function parseReceiptDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeCategorySlug(value: string | null | undefined): string | null {
  if (!value) return null;
  return (EXPENSE_CATEGORY_SLUGS as readonly string[]).includes(value) ? value : 'other';
}

function decimalOrNull(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return value;
}

export function serializeOcrResult(ocr: OCRResult) {
  const scores = ocr.confidenceScores;
  return {
    id: ocr.id,
    merchant: ocr.merchant,
    receiptDate: ocr.receiptDate?.toISOString().slice(0, 10) ?? null,
    subtotal: ocr.subtotal ? Number(ocr.subtotal) : null,
    tax: ocr.tax ? Number(ocr.tax) : null,
    total: ocr.total ? Number(ocr.total) : null,
    suggestedCategorySlug: ocr.suggestedCategorySlug,
    confidenceScores:
      scores && typeof scores === 'object' && !Array.isArray(scores)
        ? (scores as Record<string, number>)
        : null,
    processingEngine: ocr.processingEngine,
    modelVersion: ocr.modelVersion,
    processedAt: ocr.processedAt?.toISOString() ?? null,
  };
}

export type SerializedOcrResult = ReturnType<typeof serializeOcrResult>;

export function serializeReceiptWithOcr(
  receipt: Receipt & { ocrResult?: OCRResult | null; expenses?: { id: string }[] }
) {
  return {
    id: receipt.id,
    businessId: receipt.businessId,
    tripId: receipt.tripId,
    storagePath: receipt.storagePath,
    fileSizeBytes: receipt.fileSizeBytes,
    mimeType: receipt.mimeType,
    merchant: receipt.merchant,
    receiptDate: receipt.receiptDate?.toISOString().slice(0, 10) ?? null,
    subtotal: receipt.subtotal ? Number(receipt.subtotal) : null,
    tax: receipt.tax ? Number(receipt.tax) : null,
    total: receipt.total ? Number(receipt.total) : null,
    currency: receipt.currency,
    uploadStatus: receipt.uploadStatus,
    reviewStatus: receipt.reviewStatus,
    displayStatus: getReceiptDisplayStatus(receipt.uploadStatus, receipt.reviewStatus),
    ocrConfidence: receipt.ocrConfidence ? Number(receipt.ocrConfidence) : null,
    ocrResult: receipt.ocrResult ? serializeOcrResult(receipt.ocrResult) : null,
    expenseId: receipt.expenses?.[0]?.id ?? null,
    createdAt: receipt.createdAt.toISOString(),
    updatedAt: receipt.updatedAt.toISOString(),
  };
}

export type SerializedReceiptWithOcr = ReturnType<typeof serializeReceiptWithOcr>;

export async function getReceiptForReview(userId: string, receiptId: string) {
  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, ...activeReceipt },
    include: {
      ocrResult: true,
      expenses: { where: { recordStatus: 'active' }, take: 1, select: { id: true } },
    },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  return serializeReceiptWithOcr(receipt);
}

export async function runReceiptOcr(userId: string, receiptId: string) {
  const { isConfigured } = getOpenAiConfig();
  if (!isConfigured) {
    throw new ValidationError('OpenAI is not configured. Add OPENAI_API_KEY to the server environment.');
  }

  const receipt = await getOwnedReceipt(userId, receiptId);

  if (receipt.reviewStatus === 'confirmed') {
    throw new ConflictError('Receipt is already approved');
  }

  if (receipt.mimeType === 'application/pdf') {
    await prisma.receipt.update({
      where: { id: receiptId },
      data: { uploadStatus: 'failed' },
    });
    throw new ValidationError(
      'PDF OCR is not supported yet. Enter receipt details manually on the review screen.'
    );
  }

  if (!receipt.mimeType?.startsWith('image/')) {
    await prisma.receipt.update({
      where: { id: receiptId },
      data: { uploadStatus: 'failed' },
    });
    throw new ValidationError('Only image receipts can be scanned automatically.');
  }

  await prisma.receipt.update({
    where: { id: receiptId },
    data: { uploadStatus: 'processing' },
  });

  try {
    const { signedUrl } = await getReceiptSignedUrl(userId, receiptId);
    const { model } = getOpenAiConfig();
    const extracted = await extractReceiptFieldsFromImage(signedUrl);

    const receiptDate = parseReceiptDate(extracted.receipt_date ?? undefined);
    const confidenceScores = extracted.confidence ?? {};
    const overallConfidence =
      extracted.confidence?.total ??
      extracted.confidence?.merchant ??
      (Object.values(confidenceScores).length
        ? Object.values(confidenceScores).reduce((a, b) => a + b, 0) /
          Object.values(confidenceScores).length
        : null);

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const ocrResult = await tx.oCRResult.upsert({
        where: { receiptId },
        create: {
          receiptId,
          rawResponse: extracted as Prisma.InputJsonValue,
          merchant: extracted.merchant ?? null,
          receiptDate,
          subtotal: decimalOrNull(extracted.subtotal),
          tax: decimalOrNull(extracted.tax),
          total: decimalOrNull(extracted.total),
          suggestedCategorySlug: normalizeCategorySlug(extracted.category_slug),
          confidenceScores: confidenceScores as Prisma.InputJsonValue,
          processingEngine: 'openai-vision',
          modelVersion: model,
          processedAt: new Date(),
        },
        update: {
          rawResponse: extracted as Prisma.InputJsonValue,
          merchant: extracted.merchant ?? null,
          receiptDate,
          subtotal: decimalOrNull(extracted.subtotal),
          tax: decimalOrNull(extracted.tax),
          total: decimalOrNull(extracted.total),
          suggestedCategorySlug: normalizeCategorySlug(extracted.category_slug),
          confidenceScores: confidenceScores as Prisma.InputJsonValue,
          processingEngine: 'openai-vision',
          modelVersion: model,
          processedAt: new Date(),
        },
      });

      const receiptUpdate = await tx.receipt.update({
        where: { id: receiptId },
        data: {
          merchant: extracted.merchant ?? undefined,
          receiptDate: receiptDate ?? undefined,
          subtotal: decimalOrNull(extracted.subtotal) ?? undefined,
          tax: decimalOrNull(extracted.tax) ?? undefined,
          total: decimalOrNull(extracted.total) ?? undefined,
          ocrConfidence: overallConfidence ?? undefined,
          uploadStatus: 'ready',
          reviewStatus: 'pending',
        },
        include: {
          ocrResult: true,
          expenses: { where: { recordStatus: 'active' }, take: 1, select: { id: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'receipt',
          entityId: receiptId,
          action: 'update',
          newValues: {
            ocrCompleted: true,
            merchant: ocrResult.merchant,
            total: ocrResult.total ? Number(ocrResult.total) : null,
          },
          source: 'system',
        },
      });

      await tx.businessEvent.create({
        data: {
          userId,
          businessId: receipt.businessId,
          eventType: 'receipt.ocr_completed',
          entityType: 'receipt',
          entityId: receiptId,
          payload: {
            model,
            suggestedCategory: extracted.category_slug,
          },
          occurredAt: new Date(),
        },
      });

      return receiptUpdate;
    });

    return serializeReceiptWithOcr(updated);
  } catch (error) {
    await prisma.receipt.update({
      where: { id: receiptId },
      data: { uploadStatus: 'failed' },
    });
    throw error;
  }
}

export async function approveReceipt(userId: string, receiptId: string, input: ReceiptApproveInput) {
  const data = receiptApproveSchema.parse(input);

  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, ...activeReceipt },
    include: {
      ocrResult: true,
      expenses: { where: { recordStatus: 'active' }, take: 1 },
    },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  if (receipt.reviewStatus === 'confirmed') {
    throw new ConflictError('Receipt is already approved');
  }

  if (receipt.expenses.length > 0) {
    throw new ConflictError('An expense already exists for this receipt');
  }

  await getOwnedBusiness(userId, data.businessId);

  if (data.tripId) {
    const trip = await getOwnedTrip(userId, data.tripId);
    if (trip.businessId !== data.businessId) {
      throw new ValidationError('Trip does not belong to the selected business');
    }
  }

  const receiptDate = parseReceiptDate(data.receiptDate);
  if (!receiptDate) {
    throw new ValidationError('Invalid receipt date');
  }

  const currency = data.currency ?? receipt.currency ?? 'USD';

  await assertNoBlockingDuplicates(userId, receiptId, {
    merchant: data.merchant,
    total: data.total,
    receiptDate: data.receiptDate,
  }, data.acknowledgeDuplicate);

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updatedReceipt = await tx.receipt.update({
      where: { id: receiptId },
      data: {
        businessId: data.businessId,
        tripId: data.tripId ?? receipt.tripId,
        merchant: data.merchant,
        receiptDate,
        subtotal: data.subtotal ?? null,
        tax: data.tax ?? null,
        total: data.total,
        currency,
        reviewStatus: 'confirmed',
        uploadStatus: 'ready',
      },
      include: {
        ocrResult: true,
        expenses: { where: { recordStatus: 'active' }, take: 1, select: { id: true } },
      },
    });

    const expense = await createExpenseFromReceipt(tx, {
      userId,
      receiptId,
      businessId: data.businessId,
      tripId: data.tripId ?? receipt.tripId,
      categorySlug: data.categorySlug,
      merchant: data.merchant,
      amount: data.total,
      taxAmount: data.tax ?? null,
      currency,
      expenseDate: receiptDate,
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'receipt',
        entityId: receiptId,
        action: 'update',
        newValues: {
          reviewStatus: 'confirmed',
          expenseId: expense.id,
        },
        source: 'web',
      },
    });

    return { receipt: updatedReceipt, expenseId: expense.id };
  });

  if (!data.acknowledgeDuplicate) {
    await resolveDuplicateSuggestion(userId, receiptId, 'dismissed');
  }

  return {
    ...serializeReceiptWithOcr(result.receipt),
    expenseId: result.expenseId,
  };
}
