import { z } from 'zod';

export const tripUpdateSchema = z
  .object({
    purpose: z.string().min(1).max(500).optional(),
    destination: z.string().max(500).optional(),
    startLocation: z.string().max(500).optional(),
    endLocation: z.string().max(500).optional(),
    startOdometer: z.number().nonnegative().optional(),
    endOdometer: z.number().nonnegative().optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      if (data.startOdometer !== undefined && data.endOdometer !== undefined) {
        return data.endOdometer >= data.startOdometer;
      }
      return true;
    },
    {
      message: 'Ending odometer must be greater than or equal to starting odometer',
      path: ['endOdometer'],
    }
  );

export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
