import type { Prisma } from '@prisma/client';
import {
  DUPLICATE_SCORE_THRESHOLD,
  formatDuplicateMessage,
  pickDuplicateMatches,
  type DuplicateMatch,
} from '@/lib/ai/duplicate-detection';
import { DuplicateReceiptDetectedError, NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { logAIInteraction } from '@/server/services/ai-feedback.service';
import { getOwnedReceipt } from '@/server/services/receipt.service';

const activeReceipt = { recordStatus: 'active' as const };
const LOOKBACK_DAYS = 90;

export type DuplicateCheckFields = {
  merchant?: string;
  total?: number;
  receiptDate?: string;
};

function lookbackDate() {
  const since = new Date();
  since.setDate(since.getDate() - LOOKBACK_DAYS);
  return since;
}

async function listCandidateReceipts(userId: string, excludeReceiptId: string) {
  return prisma.receipt.findMany({
    where: {
      userId,
      ...activeReceipt,
      id: { not: excludeReceiptId },
      createdAt: { gte: lookbackDate() },
    },
    select: {
      id: true,
      fileHash: true,
      merchant: true,
      total: true,
      receiptDate: true,
      createdAt: true,
    },
  });
}

function mapCandidates(
  candidates: Awaited<ReturnType<typeof listCandidateReceipts>>
) {
  return candidates.map((candidate) => ({
    id: candidate.id,
    fileHash: candidate.fileHash,
    merchant: candidate.merchant,
    total: candidate.total ? Number(candidate.total) : null,
    receiptDate: candidate.receiptDate,
    createdAt: candidate.createdAt,
  }));
}

export async function findReceiptDuplicates(
  userId: string,
  receiptId: string,
  fields: DuplicateCheckFields = {}
): Promise<DuplicateMatch[]> {
  const receipt = await getOwnedReceipt(userId, receiptId);

  const source = {
    fileHash: receipt.fileHash,
    merchant: fields.merchant ?? receipt.merchant,
    total: fields.total ?? (receipt.total ? Number(receipt.total) : null),
    receiptDate:
      fields.receiptDate ?? receipt.receiptDate?.toISOString().slice(0, 10) ?? null,
  };

  const candidates = await listCandidateReceipts(userId, receiptId);
  return pickDuplicateMatches(source, mapCandidates(candidates));
}

export async function recordDuplicateSuggestions(
  userId: string,
  receiptId: string,
  matches: DuplicateMatch[]
) {
  if (matches.length === 0) return;

  const top = matches[0];
  const existing = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'duplicate_receipt',
      status: 'pending',
    },
  });

  const suggestedValue = {
    matches,
    topMatchReceiptId: top.receiptId,
    score: top.score,
    reason: top.reason,
  } satisfies Prisma.InputJsonValue;

  if (existing) {
    await prisma.aISuggestion.update({
      where: { id: existing.id },
      data: {
        message: formatDuplicateMessage(top),
        suggestedValue,
      },
    });
    return;
  }

  await prisma.aISuggestion.create({
    data: {
      userId,
      suggestionType: 'duplicate_receipt',
      entityType: 'receipt',
      entityId: receiptId,
      message: formatDuplicateMessage(top),
      suggestedValue,
      status: 'pending',
    },
  });
}

export async function checkDuplicatesAfterUpload(userId: string, receiptId: string) {
  const matches = await findReceiptDuplicates(userId, receiptId);
  const flagged = matches.filter((match) => match.score >= DUPLICATE_SCORE_THRESHOLD);
  if (flagged.length > 0) {
    await recordDuplicateSuggestions(userId, receiptId, flagged);
  }
  return flagged;
}

export async function resolveDuplicateSuggestion(
  userId: string,
  receiptId: string,
  status: 'accepted' | 'dismissed'
) {
  const suggestion = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'duplicate_receipt',
      status: 'pending',
    },
  });

  await prisma.aISuggestion.updateMany({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'duplicate_receipt',
      status: 'pending',
    },
    data: {
      status,
      resolvedAt: new Date(),
    },
  });

  if (suggestion) {
    await logAIInteraction(userId, {
      suggestionId: suggestion.id,
      interactionType: 'duplicate_receipt',
      entityType: 'receipt',
      entityId: receiptId,
      outcome: status === 'accepted' ? 'accepted' : 'dismissed',
      accepted: status === 'accepted',
      metadata: { resolution: status },
    });
  }
}

export async function getPendingDuplicateMatches(userId: string, receiptId: string) {
  const suggestion = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'duplicate_receipt',
      status: 'pending',
    },
  });

  if (!suggestion?.suggestedValue || typeof suggestion.suggestedValue !== 'object') {
    return [] as DuplicateMatch[];
  }

  const value = suggestion.suggestedValue as { matches?: DuplicateMatch[] };
  return Array.isArray(value.matches) ? value.matches : [];
}

export async function assertNoBlockingDuplicates(
  userId: string,
  receiptId: string,
  fields: DuplicateCheckFields,
  acknowledgeDuplicate?: boolean
) {
  const matches = await findReceiptDuplicates(userId, receiptId, fields);
  const blocking = matches.filter((match) => match.score >= DUPLICATE_SCORE_THRESHOLD);

  if (blocking.length === 0) {
    return;
  }

  if (!acknowledgeDuplicate) {
    throw new DuplicateReceiptDetectedError(blocking);
  }

  await resolveDuplicateSuggestion(userId, receiptId, 'accepted');
}

export async function getDuplicateCheckForReceipt(
  userId: string,
  receiptId: string,
  fields: DuplicateCheckFields = {}
) {
  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, ...activeReceipt },
    select: { id: true },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  const matches = await findReceiptDuplicates(userId, receiptId, fields);
  await recordDuplicateSuggestions(userId, receiptId, matches);
  return matches.filter((match) => match.score >= DUPLICATE_SCORE_THRESHOLD);
}
