import { z } from 'zod';

export const businessUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isDefault: z.boolean().optional(),
  currency: z.string().length(3).optional(),
  defaultMileageRate: z.number().positive().nullable().optional(),
});

export type BusinessUpdateInput = z.infer<typeof businessUpdateSchema>;

export const vehicleUpdateSchema = z.object({
  nickname: z.string().min(1).max(100).optional(),
  businessId: z.string().uuid().nullable().optional(),
  make: z.string().max(50).nullable().optional(),
  model: z.string().max(50).nullable().optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  currentOdometer: z.number().nonnegative().nullable().optional(),
  isDefault: z.boolean().optional(),
});

export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;

export const mileageSettingsSchema = z
  .object({
    mileageRateType: z.enum(['irs', 'company', 'custom']),
    customMileageRate: z.number().positive().optional(),
  })
  .refine(
    (data) => data.mileageRateType !== 'custom' || data.customMileageRate !== undefined,
    { message: 'Enter a custom rate per mile', path: ['customMileageRate'] }
  );

export type MileageSettingsInput = z.infer<typeof mileageSettingsSchema>;
