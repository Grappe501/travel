'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAV_ITEMS, isAppNavActive } from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

/** Compact top nav on mobile — complements the bottom tab bar when pages feel trip-focused. */
export function MobileQuickNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-4 flex gap-2 overflow-x-auto border-b border-border pb-3 md:hidden"
      aria-label="Quick navigation"
    >
      {APP_NAV_ITEMS.map((item) => {
        const active = isAppNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-caption transition-colors',
              active
                ? 'bg-selected font-medium text-primary'
                : 'bg-surface-elevated text-muted hover:text-foreground'
            )}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
