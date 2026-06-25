import { z } from 'zod';

export const PROJECT_STATUSES = ['active', 'completed', 'archived'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const clientCreateSchema = z.object({
  name: z.string().min(1).max(200),
  businessId: z.string().uuid().optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
  notes: z.string().max(2000).optional(),
});

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;

export const clientUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  businessId: z.string().uuid().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  email: z.string().email().max(200).nullable().optional().or(z.literal('')),
  notes: z.string().max(2000).nullable().optional(),
});

export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;

export const projectCreateSchema = z.object({
  name: z.string().min(1).max(200),
  businessId: z.string().uuid(),
  clientId: z.string().uuid().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  budget: z.number().nonnegative().optional(),
  notes: z.string().max(2000).optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const projectUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  clientId: z.string().uuid().nullable().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  budget: z.number().nonnegative().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
