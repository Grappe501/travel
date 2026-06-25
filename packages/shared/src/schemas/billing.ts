import { z } from 'zod';

export const checkoutPlanSchema = z.enum(['pro', 'small_business']);

export type CheckoutPlanInput = z.infer<typeof checkoutPlanSchema>;
