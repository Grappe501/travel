import { z } from 'zod';

export const EXPENSE_CATEGORY_SLUGS = [
  'meals',
  'fuel',
  'parking',
  'lodging',
  'supplies',
  'travel',
  'other',
] as const;

export type ExpenseCategorySlug = (typeof EXPENSE_CATEGORY_SLUGS)[number];

export const ocrExtractedFieldsSchema = z.object({
  merchant: z.string().nullable().optional(),
  receipt_date: z.string().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  tax: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  category_slug: z.string().nullable().optional(),
  confidence: z
    .object({
      merchant: z.number().min(0).max(1).optional(),
      receipt_date: z.number().min(0).max(1).optional(),
      subtotal: z.number().min(0).max(1).optional(),
      tax: z.number().min(0).max(1).optional(),
      total: z.number().min(0).max(1).optional(),
      category_slug: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type OcrExtractedFields = z.infer<typeof ocrExtractedFieldsSchema>;

export const receiptApproveSchema = z.object({
  merchant: z.string().min(1).max(200),
  receiptDate: z.string().date(),
  subtotal: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  total: z.number().positive(),
  categorySlug: z.enum(EXPENSE_CATEGORY_SLUGS),
  businessId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
  currency: z.string().length(3).optional(),
  acknowledgeDuplicate: z.boolean().optional(),
});

export type ReceiptApproveInput = z.infer<typeof receiptApproveSchema>;
