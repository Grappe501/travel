import { z } from 'zod';

export const MAX_REPORT_RANGE_DAYS = 366;

export const reportTypeSchema = z.enum(['mileage', 'expense', 'combined']);
export const reportFormatSchema = z.enum(['pdf', 'csv', 'xlsx']);

export const reportGenerateSchema = z
  .object({
    reportType: reportTypeSchema,
    format: reportFormatSchema,
    dateRangeStart: z.string().date(),
    dateRangeEnd: z.string().date(),
    businessId: z.string().uuid().optional(),
    vehicleId: z.string().uuid().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.dateRangeStart}T00:00:00.000Z`);
      const end = new Date(`${data.dateRangeEnd}T00:00:00.000Z`);
      return end >= start;
    },
    { message: 'End date must be on or after start date' }
  )
  .refine(
    (data) => {
      const start = new Date(`${data.dateRangeStart}T00:00:00.000Z`);
      const end = new Date(`${data.dateRangeEnd}T00:00:00.000Z`);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days <= MAX_REPORT_RANGE_DAYS;
    },
    { message: `Date range cannot exceed ${MAX_REPORT_RANGE_DAYS} days` }
  );

export type ReportGenerateInput = z.infer<typeof reportGenerateSchema>;
