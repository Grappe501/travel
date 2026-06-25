import { z } from 'zod';

export * from './auth';
export * from './business-vehicle';
export * from './trip';
export * from './receipt';
export * from './report';
export * from './billing';
export * from './expense';
export * from './ai';
export * from './client-project';
export * from './notification';
export * from './search';
export * from './restore';
export * from './settings';
export * from './gps';
export * from './beta';

export const businessCreateSchema = z.object({
  name: z.string().min(1).max(100),
  isDefault: z.boolean().optional(),
  currency: z.string().length(3).optional(),
  defaultMileageRate: z.number().positive().optional(),
});

export type BusinessCreateInput = z.infer<typeof businessCreateSchema>;

export const vehicleCreateSchema = z.object({
  nickname: z.string().min(1).max(100),
  businessId: z.string().uuid().optional(),
  make: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  currentOdometer: z.number().nonnegative().optional(),
  isDefault: z.boolean().optional(),
});

export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;

export const tripStartSchema = z.object({
  businessId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  purpose: z.string().min(1).max(500),
  destination: z.string().max(500).optional(),
  startLocation: z.string().max(500).optional(),
  startOdometer: z.number().nonnegative().optional(),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  trackingEnabled: z.boolean().optional(),
  startLatitude: z.number().min(-90).max(90).optional(),
  startLongitude: z.number().min(-180).max(180).optional(),
});

export type TripStartInput = z.infer<typeof tripStartSchema>;

export const tripEndSchema = z
  .object({
    tripId: z.string().uuid(),
    endLocation: z.string().max(500).optional(),
    endOdometer: z.number().nonnegative().optional(),
    endLatitude: z.number().min(-90).max(90).optional(),
    endLongitude: z.number().min(-180).max(180).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine(
    (data) =>
      data.endOdometer !== undefined ||
      (data.endLatitude !== undefined && data.endLongitude !== undefined),
    {
      message: 'Provide ending odometer or end GPS coordinates',
      path: ['endOdometer'],
    }
  );

export type TripEndInput = z.infer<typeof tripEndSchema>;

export const mileageRateCreateSchema = z.object({
  name: z.string().min(1).max(100),
  rate: z.number().positive(),
  source: z.enum(['irs', 'company', 'custom', 'vehicle', 'business']),
  effectiveFrom: z.string().date(),
  effectiveTo: z.string().date().optional(),
  businessId: z.string().uuid().optional(),
});

export type MileageRateCreateInput = z.infer<typeof mileageRateCreateSchema>;

export const receiptUploadMetaSchema = z.object({
  businessId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  mimeType: z.string().max(100),
  fileSizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
  idempotencyKey: z.string().uuid().optional(),
});

export type ReceiptUploadMetaInput = z.infer<typeof receiptUploadMetaSchema>;
