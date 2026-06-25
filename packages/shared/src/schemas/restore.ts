import { z } from 'zod';

export const RESTORABLE_ENTITY_TYPES = [
  'trip',
  'expense',
  'receipt',
  'report',
  'client',
  'project',
  'business',
  'vehicle',
] as const;

export type RestorableEntityType = (typeof RESTORABLE_ENTITY_TYPES)[number];

export const restoreEntitySchema = z.object({
  entityType: z.enum(RESTORABLE_ENTITY_TYPES),
  entityId: z.string().uuid(),
});

export type RestoreEntityInput = z.infer<typeof restoreEntitySchema>;

/** Default undo window shown in delete confirmation copy. */
export const DELETE_UNDO_SECONDS = 5;
