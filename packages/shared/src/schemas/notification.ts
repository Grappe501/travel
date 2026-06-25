import { z } from 'zod';

export const NOTIFICATION_TYPES = [
  'trip_active_expenses',
  'trip_forgot_end',
  'trip_end_checklist',
  'receipt_review_pending',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const notificationPayloadSchema = z.object({
  href: z.string().min(1),
  tripId: z.string().uuid().optional(),
  entityId: z.string().uuid().optional(),
  count: z.number().int().nonnegative().optional(),
});

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;

export const notificationPrefsSchema = z.object({
  inApp: z.boolean().default(true),
  tripReminders: z.boolean().default(true),
  receiptReminders: z.boolean().default(true),
  tripEndChecklist: z.boolean().default(true),
  emailTripSummary: z.boolean().default(true),
  emailReceiptProcessed: z.boolean().default(true),
});

export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  inApp: true,
  tripReminders: true,
  receiptReminders: true,
  tripEndChecklist: true,
  emailTripSummary: true,
  emailReceiptProcessed: true,
};

export const notificationListQuerySchema = z.object({
  unreadOnly: z.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type NotificationListQuery = z.infer<typeof notificationListQuerySchema>;

export const notificationMarkReadSchema = z.object({
  read: z.boolean().default(true),
});

export type NotificationMarkReadInput = z.infer<typeof notificationMarkReadSchema>;

export const notificationPrefsUpdateSchema = notificationPrefsSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'No preference fields to update' }
);

export type NotificationPrefsUpdateInput = z.infer<typeof notificationPrefsUpdateSchema>;
