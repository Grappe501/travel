'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@mileage-copilot/shared';
import { NotificationBellLink } from '@/components/notifications/NotificationManager';
import { APP_NAV_ITEMS, isAppNavActive } from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

export function AppTopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-40 hidden border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 md:block"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/dashboard" className="text-subheading font-medium text-foreground hover:text-primary">
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBellLink />
          <ul className="flex flex-wrap items-center gap-1">
          {APP_NAV_ITEMS.map((item) => {
            const active = isAppNavActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-caption transition-colors focus-visible:outline-none',
                    active
                      ? 'bg-selected font-medium text-primary'
                      : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
