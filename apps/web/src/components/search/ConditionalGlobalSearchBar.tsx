'use client';

import { usePathname } from 'next/navigation';
import { GlobalSearchBar } from '@/components/search/GlobalSearchBar';

export function ConditionalGlobalSearchBar() {
  const pathname = usePathname();

  if (pathname.startsWith('/search')) {
    return null;
  }

  return <GlobalSearchBar />;
}
