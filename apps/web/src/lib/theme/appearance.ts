import type { AppearancePreference } from '@mileage-copilot/shared';

export const THEME_STORAGE_KEY = 'mec-appearance';

export const APPEARANCE_OPTIONS: { value: AppearancePreference; label: string; description: string }[] =
  [
    { value: 'system', label: 'System', description: 'Match your device setting' },
    { value: 'light', label: 'Light', description: 'Always use light mode' },
    { value: 'dark', label: 'Dark', description: 'Always use dark mode' },
  ];

export function isAppearancePreference(value: string | null | undefined): value is AppearancePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function readStoredAppearance(): AppearancePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isAppearancePreference(stored) ? stored : 'system';
}

export function applyAppearance(preference: AppearancePreference) {
  const root = document.documentElement;
  root.setAttribute('data-theme', preference);
}

export function persistAppearance(preference: AppearancePreference) {
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  applyAppearance(preference);
}
