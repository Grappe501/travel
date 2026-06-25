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
