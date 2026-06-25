import { z } from 'zod';

export const appearancePreferenceSchema = z.enum(['system', 'light', 'dark']);
export type AppearancePreference = z.infer<typeof appearancePreferenceSchema>;

export const accountSettingsSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  firstName: z.string().max(50).optional().nullable(),
  lastName: z.string().max(50).optional().nullable(),
  timezone: z.string().min(1).max(64),
  currency: z.string().length(3),
  taxYear: z.number().int().min(2020).max(2100),
});

export type AccountSettingsInput = z.infer<typeof accountSettingsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
