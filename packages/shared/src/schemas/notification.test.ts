import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NOTIFICATION_PREFS,
  notificationPrefsSchema,
  notificationPrefsUpdateSchema,
} from './notification';

describe('notificationPrefsSchema', () => {
  it('applies defaults for empty object', () => {
    expect(notificationPrefsSchema.parse({})).toEqual(DEFAULT_NOTIFICATION_PREFS);
  });

  it('rejects empty preference updates', () => {
    expect(notificationPrefsUpdateSchema.safeParse({}).success).toBe(false);
  });
});
