import { z } from 'zod';

export const betaLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  betaPassword: z.string().min(1, 'Field test access code is required'),
  fieldTestLabel: z.string().max(100).optional(),
});

export type BetaLoginInput = z.infer<typeof betaLoginSchema>;
