import { z } from 'zod';
import { EXPENSE_CATEGORY_SLUGS } from './receipt';

const expenseDateSchema = z
  .string()
  .date()
  .refine(
    (value) => {
      const date = new Date(`${value}T12:00:00.000Z`);
      const max = new Date();
      max.setUTCDate(max.getUTCDate() + 1);
      max.setUTCHours(23, 59, 59, 999);
      return date.getTime() <= max.getTime();
    },
    { message: 'Expense date cannot be more than one day in the future' }
  );

export const expenseCreateSchema = z.object({
  businessId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
  categorySlug: z.enum(EXPENSE_CATEGORY_SLUGS),
  merchant: z.string().max(200).optional(),
  amount: z.number().positive(),
  taxAmount: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  expenseDate: expenseDateSchema,
  paymentMethod: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;

export const expenseUpdateSchema = z
  .object({
    businessId: z.string().uuid().optional(),
    tripId: z.string().uuid().nullable().optional(),
    categorySlug: z.enum(EXPENSE_CATEGORY_SLUGS).optional(),
    merchant: z.string().max(200).nullable().optional(),
    amount: z.number().positive().optional(),
    taxAmount: z.number().nonnegative().nullable().optional(),
    currency: z.string().length(3).optional(),
    expenseDate: expenseDateSchema.optional(),
    paymentMethod: z.string().max(50).nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;

export const expenseListQuerySchema = z.object({
  categorySlug: z.enum(EXPENSE_CATEGORY_SLUGS).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  tripId: z.string().uuid().optional(),
  businessId: z.string().uuid().optional(),
});

export type ExpenseListQuery = z.infer<typeof expenseListQuerySchema>;

export const receiptAttachSchema = z.object({
  tripId: z.string().uuid(),
  businessId: z.string().uuid().optional(),
});

export type ReceiptAttachInput = z.infer<typeof receiptAttachSchema>;
