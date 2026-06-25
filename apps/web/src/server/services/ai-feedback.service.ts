import type { AIInteractionOutcome as PrismaOutcome, Prisma } from '@prisma/client';
import {
  aiFeedbackSchema,
  aiInteractionLogInputSchema,
  type AIFeedbackInput,
  type AIInteractionLogInput,
  type AIInteractionType,
} from '@mileage-copilot/shared';
import { NotFoundError } from '@/lib/api/response';
import { resolveFeedbackOutcome } from '@/lib/ai/feedback-outcome';
import { prisma } from '@/lib/db/prisma';

export { resolveFeedbackOutcome } from '@/lib/ai/feedback-outcome';

export function serializeInteractionLog(log: {
  id: string;
  interactionType: string;
  entityType: string | null;
  entityId: string | null;
  stage: string | null;
  outcome: string;
  accepted: boolean | null;
  confidence: { toNumber?: () => number } | null;
  message?: string | null;
  createdAt: Date;
  suggestionId: string | null;
}) {
  return {
    id: log.id,
    kind: 'interaction' as const,
    interactionType: log.interactionType,
    entityType: log.entityType,
    entityId: log.entityId,
    stage: log.stage,
    outcome: log.outcome,
    accepted: log.accepted,
    confidence: log.confidence ? Number(log.confidence) : null,
    message: log.message ?? null,
    suggestionId: log.suggestionId,
    createdAt: log.createdAt.toISOString(),
  };
}

export function serializeSuggestionHistory(suggestion: {
  id: string;
  suggestionType: string;
  entityType: string;
  entityId: string;
  message: string | null;
  status: string;
  createdAt: Date;
  resolvedAt: Date | null;
}) {
  return {
    id: suggestion.id,
    kind: 'suggestion' as const,
    interactionType: suggestion.suggestionType,
    entityType: suggestion.entityType,
    entityId: suggestion.entityId,
    stage: null,
    outcome: suggestion.status,
    accepted: suggestion.status === 'accepted',
    confidence: null,
    message: suggestion.message,
    suggestionId: suggestion.id,
    createdAt: (suggestion.resolvedAt ?? suggestion.createdAt).toISOString(),
  };
}

export type SerializedAIHistoryItem =
  | ReturnType<typeof serializeInteractionLog>
  | ReturnType<typeof serializeSuggestionHistory>;

export async function logAIInteraction(userId: string, input: AIInteractionLogInput) {
  const data = aiInteractionLogInputSchema.parse(input);

  const log = await prisma.aIInteractionLog.create({
    data: {
      userId,
      suggestionId: data.suggestionId,
      interactionType: data.interactionType,
      entityType: data.entityType,
      entityId: data.entityId,
      stage: data.stage,
      outcome: data.outcome as PrismaOutcome,
      accepted: data.accepted,
      confidence: data.confidence,
      engineVersion: data.engineVersion,
      processingMs: data.processingMs,
      metadata: data.metadata as Prisma.InputJsonValue | undefined,
    },
  });

  return serializeInteractionLog(log);
}

export async function submitAIFeedback(userId: string, input: AIFeedbackInput) {
  const data = aiFeedbackSchema.parse(input);
  const hasCorrection = Boolean(data.correction && Object.keys(data.correction).length > 0);
  const outcome = resolveFeedbackOutcome(data.accepted, hasCorrection);

  let interactionType: AIInteractionType | undefined = data.interactionType;
  let entityType = data.entityType;
  let entityId = data.entityId;
  let suggestionId = data.suggestionId;

  if (data.suggestionId) {
    const suggestion = await prisma.aISuggestion.findFirst({
      where: { id: data.suggestionId, userId },
    });

    if (!suggestion) {
      throw new NotFoundError('AI suggestion not found');
    }

    interactionType =
      interactionType ?? (suggestion.suggestionType as AIInteractionType);
    entityType = entityType ?? suggestion.entityType;
    entityId = entityId ?? suggestion.entityId;
    suggestionId = suggestion.id;

    const suggestionStatus = data.accepted ? 'accepted' : hasCorrection ? 'dismissed' : 'rejected';

    await prisma.aISuggestion.update({
      where: { id: suggestion.id },
      data: {
        status: suggestionStatus,
        resolvedAt: new Date(),
      },
    });
  }

  if (!interactionType || !entityType || !entityId) {
    throw new NotFoundError('Could not resolve feedback target');
  }

  return logAIInteraction(userId, {
    suggestionId,
    interactionType,
    entityType,
    entityId,
    outcome,
    accepted: data.accepted,
    metadata: {
      ...(data.correction ? { correction: data.correction } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
    },
  });
}

export async function listAIHistory(userId: string, limit = 50) {
  const [suggestions, interactions] = await Promise.all([
    prisma.aISuggestion.findMany({
      where: { userId, status: { not: 'pending' } },
      orderBy: [{ resolvedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    }),
    prisma.aIInteractionLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
  ]);

  const timeline: SerializedAIHistoryItem[] = [
    ...suggestions.map(serializeSuggestionHistory),
    ...interactions.map(serializeInteractionLog),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  const stats = {
    suggestionsResolved: suggestions.length,
    interactionsLogged: interactions.length,
    acceptanceRate:
      interactions.length > 0
        ? interactions.filter((row) => row.accepted === true).length / interactions.length
        : null,
  };

  return { timeline, stats };
}
