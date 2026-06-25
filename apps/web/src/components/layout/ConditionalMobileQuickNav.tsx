'use client';

import { usePathname } from 'next/navigation';
import { MobileQuickNav } from '@/components/layout/MobileQuickNav';

function isTripScopedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/trips') ||
    pathname.startsWith('/expenses') ||
    pathname === '/receipts/upload'
  );
}

export function ConditionalMobileQuickNav() {
  const pathname = usePathname();

  if (!isTripScopedRoute(pathname)) {
    return null;
  }

  return <MobileQuickNav />;
}
