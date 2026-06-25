'use client';

import { useEffect } from 'react';
import { applyAppearance, readStoredAppearance } from '@/lib/theme/appearance';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyAppearance(readStoredAppearance());
  }, []);

  return children;
}
