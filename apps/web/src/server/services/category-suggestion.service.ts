import type { Prisma } from '@prisma/client';
import {
  categorySuggestFieldsSchema,
  type CategorySuggestFields,
  type CategorySuggestionResult,
  type ExpenseCategorySlug,
} from '@mileage-copilot/shared';
import { buildCategorySuggestion } from '@/lib/ai/category-intelligence';
import { classifyCategoryWithLlm } from '@/lib/ai/category-classify';
import { NotFoundError } from '@/lib/api/response';
import { prisma } from '@/lib/db/prisma';
import { logAIInteraction } from '@/server/services/ai-feedback.service';
import { getOwnedReceipt } from '@/server/services/receipt.service';

const activeExpense = { recordStatus: 'active' as const };
const HISTORY_LIMIT = 400;
const LLM_CONFIDENCE_GATE = 0.75;

async function loadUserMerchantHistory(userId: string) {
  return prisma.expense.findMany({
    where: { userId, ...activeExpense, merchant: { not: null } },
    select: { merchant: true, categorySlug: true },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_LIMIT,
  });
}

async function maybeLoadLlmSuggestion(
  merchant: string,
  topConfidence: number,
  fields: CategorySuggestFields
) {
  if (topConfidence >= LLM_CONFIDENCE_GATE || !merchant.trim()) {
    return null;
  }

  return classifyCategoryWithLlm({
    merchant: merchant.trim(),
    rawText: fields.rawText,
    amount: fields.amount,
  });
}

export async function suggestCategoryForReceipt(
  userId: string,
  receiptId: string,
  fields: CategorySuggestFields = {}
): Promise<CategorySuggestionResult> {
  const parsed = categorySuggestFieldsSchema.parse(fields);
  await getOwnedReceipt(userId, receiptId);

  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, recordStatus: 'active' },
    include: { ocrResult: true },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  const merchant =
    parsed.merchant ?? receipt.merchant ?? receipt.ocrResult?.merchant ?? undefined;

  if (!merchant?.trim()) {
    return buildCategorySuggestion({});
  }

  const ocrResult = receipt.ocrResult;
  const ocrScores =
    ocrResult?.confidenceScores &&
    typeof ocrResult.confidenceScores === 'object' &&
    !Array.isArray(ocrResult.confidenceScores)
      ? (ocrResult.confidenceScores as Record<string, number>)
      : null;

  const preliminary = buildCategorySuggestion({
    merchant,
    rawText: parsed.rawText,
    ocrCategorySlug: (parsed.ocrCategorySlug ??
      ocrResult?.suggestedCategorySlug) as ExpenseCategorySlug | null,
    ocrCategoryConfidence:
      parsed.ocrCategoryConfidence ?? ocrScores?.category_slug ?? null,
    userHistory: await loadUserMerchantHistory(userId),
  });

  const llmSuggestion = await maybeLoadLlmSuggestion(
    merchant,
    preliminary.primary.confidence,
    parsed
  );

  const result = llmSuggestion
    ? buildCategorySuggestion({
        merchant,
        rawText: parsed.rawText,
        ocrCategorySlug: (parsed.ocrCategorySlug ??
          ocrResult?.suggestedCategorySlug) as ExpenseCategorySlug | null,
        ocrCategoryConfidence:
          parsed.ocrCategoryConfidence ?? ocrScores?.category_slug ?? null,
        userHistory: await loadUserMerchantHistory(userId),
        llmSuggestion,
      })
    : preliminary;

  await recordCategorySuggestion(userId, receiptId, result);
  return result;
}

export async function recordCategorySuggestion(
  userId: string,
  receiptId: string,
  result: CategorySuggestionResult
) {
  const existing = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'category',
      status: 'pending',
    },
  });

  const suggestedValue = {
    primary: result.primary,
    alternatives: result.alternatives,
  } satisfies Prisma.InputJsonValue;

  const message = `Suggested ${result.primary.slug} (${Math.round(result.primary.confidence * 100)}% confidence)`;

  if (existing) {
    await prisma.aISuggestion.update({
      where: { id: existing.id },
      data: { message, suggestedValue },
    });
    return;
  }

  await prisma.aISuggestion.create({
    data: {
      userId,
      suggestionType: 'category',
      entityType: 'receipt',
      entityId: receiptId,
      message,
      suggestedValue,
      status: 'pending',
    },
  });
}

export async function getPendingCategorySuggestion(
  userId: string,
  receiptId: string
): Promise<CategorySuggestionResult | null> {
  const suggestion = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'category',
      status: 'pending',
    },
  });

  if (!suggestion?.suggestedValue || typeof suggestion.suggestedValue !== 'object') {
    return null;
  }

  const value = suggestion.suggestedValue as CategorySuggestionResult;
  if (!value.primary?.slug) return null;
  return value;
}

export async function resolveCategorySuggestion(
  userId: string,
  receiptId: string,
  chosenCategorySlug: string
) {
  const suggestion = await prisma.aISuggestion.findFirst({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'category',
      status: 'pending',
    },
  });

  const pending = await getPendingCategorySuggestion(userId, receiptId);
  if (!suggestion && !pending) return;

  const suggestedSlug = pending?.primary.slug;
  const accepted = suggestedSlug === chosenCategorySlug;
  const status = accepted ? 'accepted' : 'dismissed';

  await prisma.aISuggestion.updateMany({
    where: {
      userId,
      entityType: 'receipt',
      entityId: receiptId,
      suggestionType: 'category',
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
      interactionType: 'category',
      entityType: 'receipt',
      entityId: receiptId,
      outcome: accepted ? 'accepted' : 'corrected',
      accepted,
      confidence: pending?.primary.confidence,
      metadata: {
        suggestedSlug,
        chosenCategorySlug,
      },
    });
  }
}

export async function getCategorySuggestionForReceipt(
  userId: string,
  receiptId: string,
  fields: CategorySuggestFields = {}
) {
  const receipt = await prisma.receipt.findFirst({
    where: { id: receiptId, userId, recordStatus: 'active' },
    select: { id: true },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt not found');
  }

  return suggestCategoryForReceipt(userId, receiptId, fields);
}
