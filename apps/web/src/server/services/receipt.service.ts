import { createHash, randomUUID } from 'crypto';
import type { Prisma, Receipt } from '@prisma/client';
import { receiptUploadMetaSchema } from '@mileage-copilot/shared';
import type { ReceiptUploadMetaInput } from '@mileage-copilot/shared';
import { NotFoundError, ValidationError } from '@/lib/api/response';
import {
  extensionForMimeType,
  getReceiptDisplayStatus,
  isAllowedReceiptMimeType,
  MAX_RECEIPT_FILE_BYTES,
} from '@/lib/receipts/constants';
import { bufferMatchesReceiptMimeType } from '@/lib/receipts/magic-bytes';
import { buildReceiptStoragePath, getStorageConfig } from '@/lib/storage/config';
import { getSupabaseAdmin } from '@/lib/storage/server';
import { prisma } from '@/lib/db/prisma';
import {
  assertCanUploadReceipt,
  incrementReceiptUsage,
} from '@/server/services/usage.service';
import { checkDuplicatesAfterUpload } from '@/server/services/duplicate-detection.service';
import { recalculateTripExpenseTotal } from '@/server/services/expense.service';
import { getOwnedBusiness } from '@/server/services/business.service';
import { getOwnedTrip } from '@/server/services/trip.service';

const activeReceipt = { recordStatus: 'active' as const };

export function serializeReceipt(receipt: Receipt) {
  return {
    id: receipt.id,
    businessId: receipt.businessId,
    tripId: receipt.tripId,
    storagePath: receipt.storagePath,
    fileSizeBytes: receipt.fileSizeBytes,
    mimeType: receipt.mimeType,
    merchant: receipt.merchant,
    receiptDate: receipt.receiptDate?.toISOString().slice(0, 10) ?? null,
    total: receipt.total ? Number(receipt.total) : null,
    currency: receipt.currency,
    uploadStatus: receipt.uploadStatus,
    reviewStatus: receipt.reviewStatus,
    displayStatus: getReceiptDisplayStatus(receipt.uploadStatus, receipt.reviewStatus),
    createdAt: receipt.createdAt.toISOString(),
    updatedAt: receipt.updatedAt.toISOString(),
  };
}

export type SerializedReceipt = ReturnType<typeof serializeReceipt>;

function hashFileBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

async function assertReceiptRelations(
  userId: string,
  meta: { businessId?: string; tripId?: string }
) {
  if (meta.businessId) {
    await getOwnedBusiness(userId, meta.businessId);
  }

  if (meta.tripId) {
    const trip = await getOwnedTrip(userId, meta.tripId);
    if (meta.businessId && trip.businessId !== meta.businessId) {
      throw new ValidationError('Trip does not belong to the selected business');
    }
  }
}

export async function listReceipts(userId: string) {
  const receipts = await prisma.receipt.findMany({
    where: { userId, ...activeReceipt },
    orderBy: { createdAt: 'desc' },
  });

  return receipts.map(serializeReceipt);
}

export async function listUnlinkedReceiptsForBusiness(userId: string, businessId: string) {
  await getOwnedBusiness(userId, businessId);

  const receipts = await prisma.receipt.findMany({
    where: {
      userId,
      tripId: null,
      ...activeReceipt,
      OR: [{ businessId }, { businessId: null }],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return receipts.map(serializeReceipt);
}

export async function getOwnedReceipt(userId: string, receiptId: string) {
  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, ...activeReceipt },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  return receipt;
}

export async function uploadReceipt(
  userId: string,
  file: File,
  metaInput: Omit<ReceiptUploadMetaInput, 'mimeType' | 'fileSizeBytes'> = {}
) {
  const mimeType = file.type || 'application/octet-stream';
  const fileSizeBytes = file.size;

  const meta = receiptUploadMetaSchema.parse({
    ...metaInput,
    mimeType,
    fileSizeBytes,
  });

  if (!isAllowedReceiptMimeType(mimeType)) {
    throw new ValidationError('File type not supported. Use JPEG, PNG, WebP, HEIC, or PDF.');
  }

  if (fileSizeBytes > MAX_RECEIPT_FILE_BYTES) {
    throw new ValidationError('File must be 10 MB or smaller.');
  }

  if (meta.idempotencyKey) {
    const existing = await prisma.receipt.findFirst({
      where: { userId, idempotencyKey: meta.idempotencyKey, ...activeReceipt },
    });
    if (existing) {
      return serializeReceipt(existing);
    }
  }

  await assertReceiptRelations(userId, meta);
  await assertCanUploadReceipt(userId);

  const { bucket, isConfigured } = getStorageConfig();
  if (!isConfigured) {
    throw new ValidationError(
      'Receipt storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY to the server environment.'
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!bufferMatchesReceiptMimeType(buffer, mimeType)) {
    throw new ValidationError('File content does not match the declared file type.');
  }

  const fileHash = hashFileBuffer(buffer);
  const receiptId = randomUUID();
  const ext = extensionForMimeType(mimeType);
  const storagePath = buildReceiptStoragePath(userId, receiptId, ext);

  const supabase = getSupabaseAdmin();
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (uploadError) {
    throw new ValidationError(`Storage upload failed: ${uploadError.message}`);
  }

  try {
    const receipt = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await incrementReceiptUsage(userId, tx);

      const created = await tx.receipt.create({
        data: {
          id: receiptId,
          userId,
          businessId: meta.businessId,
          tripId: meta.tripId,
          storagePath,
          fileHash,
          fileSizeBytes,
          mimeType,
          uploadStatus: 'ready',
          reviewStatus: 'pending',
          idempotencyKey: meta.idempotencyKey,
        },
      });

      await tx.fileAsset.create({
        data: {
          userId,
          kind: 'receipt',
          storagePath,
          mimeType,
          fileSizeBytes,
          fileHash,
          entityType: 'receipt',
          entityId: created.id,
          receiptId: created.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          entityType: 'receipt',
          entityId: created.id,
          action: 'create',
          newValues: {
            storagePath,
            fileSizeBytes,
            mimeType,
            uploadStatus: 'ready',
          },
          source: 'web',
        },
      });

      return created;
    });

    await checkDuplicatesAfterUpload(userId, receiptId).catch(() => undefined);

    return serializeReceipt(receipt);
  } catch (error) {
    await supabase.storage.from(bucket).remove([storagePath]);
    throw error;
  }
}

export async function getReceiptSignedUrl(userId: string, receiptId: string, expiresIn = 3600) {
  const receipt = await getOwnedReceipt(userId, receiptId);
  const { bucket, isConfigured } = getStorageConfig();

  if (!isConfigured) {
    throw new ValidationError('Storage is not configured');
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(receipt.storagePath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new ValidationError(error?.message ?? 'Could not create download URL');
  }

  return {
    signedUrl: data.signedUrl,
    mimeType: receipt.mimeType,
    expiresIn,
  };
}

export async function deleteReceipt(userId: string, receiptId: string) {
  const receipt = await getOwnedReceipt(userId, receiptId);
  const tripId = receipt.tripId;
  const storagePath = receipt.storagePath;

  const linkedExpenses = await prisma.expense.findMany({
    where: { receiptId, userId, recordStatus: 'active' },
    select: { id: true, tripId: true },
  });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (linkedExpenses.length > 0) {
      await tx.expense.updateMany({
        where: { receiptId, userId, recordStatus: 'active' },
        data: { recordStatus: 'deleted', deletedAt: new Date() },
      });
    }

    await tx.receipt.update({
      where: { id: receiptId },
      data: {
        recordStatus: 'deleted',
        deletedAt: new Date(),
        tripId: null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        entityType: 'receipt',
        entityId: receiptId,
        action: 'delete',
        oldValues: {
          merchant: receipt.merchant,
          tripId: receipt.tripId,
          linkedExpenseCount: linkedExpenses.length,
        },
        source: 'web',
      },
    });
  });

  const tripIds = new Set<string>();
  if (tripId) tripIds.add(tripId);
  for (const expense of linkedExpenses) {
    if (expense.tripId) tripIds.add(expense.tripId);
  }

  for (const id of tripIds) {
    await recalculateTripExpenseTotal(userId, id);
  }

  const { bucket, isConfigured } = getStorageConfig();
  if (isConfigured && storagePath) {
    const supabase = getSupabaseAdmin();
    await supabase.storage.from(bucket).remove([storagePath]).catch(() => undefined);
  }

  return { id: receiptId, deleted: true };
}
