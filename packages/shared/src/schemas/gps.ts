import { z } from 'zod';

export const gpsTrackingDefaultSchema = z.enum(['off', 'ask', 'on']);
export type GpsTrackingDefault = z.infer<typeof gpsTrackingDefaultSchema>;

export const appPrefsSchema = z.object({
  gpsTrackingDefault: gpsTrackingDefaultSchema.default('ask'),
  gpsHighAccuracy: z.boolean().default(false),
  betaTester: z.boolean().optional(),
  betaJoinedAt: z.string().datetime().optional(),
  fieldTestLabel: z.string().max(100).optional(),
});

export type AppPrefs = z.infer<typeof appPrefsSchema>;

export const DEFAULT_APP_PREFS: AppPrefs = {
  gpsTrackingDefault: 'ask',
  gpsHighAccuracy: false,
};

export const appPrefsUpdateSchema = appPrefsSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'No preference fields to update' }
);

export type AppPrefsUpdateInput = z.infer<typeof appPrefsUpdateSchema>;

export const gpsPointSourceSchema = z.enum(['live', 'start', 'end', 'sync_batch']);

export const gpsPointInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyM: z.number().nonnegative().optional(),
  altitudeM: z.number().optional(),
  speedMps: z.number().optional(),
  heading: z.number().min(0).max(360).optional(),
  recordedAt: z.string().datetime(),
  source: gpsPointSourceSchema.default('live'),
});

export type GpsPointInput = z.infer<typeof gpsPointInputSchema>;

export const gpsPointsBatchSchema = z.object({
  points: z.array(gpsPointInputSchema).min(1).max(100),
});

export type GpsPointsBatchInput = z.infer<typeof gpsPointsBatchSchema>;

export const tripTrackingPatchSchema = z.object({
  trackingEnabled: z.boolean(),
});

export type TripTrackingPatchInput = z.infer<typeof tripTrackingPatchSchema>;

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
