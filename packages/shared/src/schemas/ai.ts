import { z } from 'zod';
import { EXPENSE_CATEGORY_SLUGS } from './receipt';

export const categorySuggestionPrimarySchema = z.object({
  slug: z.enum(EXPENSE_CATEGORY_SLUGS),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  source: z.string(),
});

export const categorySuggestionAlternativeSchema = z.object({
  slug: z.enum(EXPENSE_CATEGORY_SLUGS),
  confidence: z.number().min(0).max(1),
});

export const categorySuggestionResultSchema = z.object({
  primary: categorySuggestionPrimarySchema,
  alternatives: z.array(categorySuggestionAlternativeSchema),
});

export type CategorySuggestionPrimary = z.infer<typeof categorySuggestionPrimarySchema>;
export type CategorySuggestionAlternative = z.infer<typeof categorySuggestionAlternativeSchema>;
export type CategorySuggestionResult = z.infer<typeof categorySuggestionResultSchema>;

export const categorySuggestFieldsSchema = z.object({
  merchant: z.string().min(1).max(200).optional(),
  rawText: z.string().max(2000).optional(),
  amount: z.number().positive().optional(),
  ocrCategorySlug: z.enum(EXPENSE_CATEGORY_SLUGS).optional(),
  ocrCategoryConfidence: z.number().min(0).max(1).optional(),
});

export type CategorySuggestFields = z.infer<typeof categorySuggestFieldsSchema>;

export const AI_INTERACTION_TYPES = [
  'category',
  'duplicate_receipt',
  'missing_receipt',
  'ocr',
  'trip_association',
  'anomaly',
] as const;

export type AIInteractionType = (typeof AI_INTERACTION_TYPES)[number];

export const AI_INTERACTION_OUTCOMES = [
  'accepted',
  'rejected',
  'dismissed',
  'corrected',
] as const;

export type AIInteractionOutcome = (typeof AI_INTERACTION_OUTCOMES)[number];

export const aiFeedbackSchema = z
  .object({
    suggestionId: z.string().uuid().optional(),
    accepted: z.boolean(),
    interactionType: z.enum(AI_INTERACTION_TYPES).optional(),
    entityType: z.string().max(50).optional(),
    entityId: z.string().uuid().optional(),
    correction: z.record(z.unknown()).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (data) => data.suggestionId || (data.interactionType && data.entityType && data.entityId),
    { message: 'Provide suggestionId or interactionType with entityType and entityId' }
  );

export type AIFeedbackInput = z.infer<typeof aiFeedbackSchema>;

export const aiInteractionLogInputSchema = z.object({
  suggestionId: z.string().uuid().optional(),
  interactionType: z.enum(AI_INTERACTION_TYPES),
  entityType: z.string().max(50).optional(),
  entityId: z.string().uuid().optional(),
  stage: z.string().max(50).optional(),
  outcome: z.enum(AI_INTERACTION_OUTCOMES),
  accepted: z.boolean().optional(),
  confidence: z.number().min(0).max(1).optional(),
  engineVersion: z.string().max(100).optional(),
  processingMs: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AIInteractionLogInput = z.infer<typeof aiInteractionLogInputSchema>;
