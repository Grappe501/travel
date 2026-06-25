'use client';

import { usePathname } from 'next/navigation';
import { MobileQuickNav } from '@/components/layout/MobileQuickNav';
import { getContextualQuickNav } from '@/lib/navigation/app-nav';

export function ConditionalMobileQuickNav() {
  const pathname = usePathname();

  if (getContextualQuickNav(pathname).length === 0) {
    return null;
  }

  return <MobileQuickNav />;
}
