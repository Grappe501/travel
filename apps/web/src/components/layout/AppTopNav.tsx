'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { APP_NAME } from '@mileage-copilot/shared';
import { NavMenuSheets } from '@/components/layout/NavMenuSheets';
import { NotificationBellLink } from '@/components/notifications/NotificationManager';
import { DESKTOP_TOP_NAV_ITEMS, isAppNavActive, isMoreNavActive } from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

export function AppTopNav() {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = isMoreNavActive(pathname);

  return (
    <>
      <nav
        className="sticky top-0 z-40 hidden border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 md:block"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/dashboard" className="text-subheading font-medium text-foreground hover:text-primary">
            {APP_NAME}
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <ul className="flex flex-wrap items-center justify-end gap-1">
              {DESKTOP_TOP_NAV_ITEMS.map((item) => {
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
              <li>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="rounded-lg px-3 py-2 text-caption font-medium text-primary transition-colors hover:bg-surface-elevated focus-visible:outline-none"
                  aria-haspopup="dialog"
                >
                  Add
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-caption transition-colors focus-visible:outline-none',
                    moreActive
                      ? 'bg-selected font-medium text-primary'
                      : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                  )}
                  aria-haspopup="dialog"
                >
                  More
                </button>
              </li>
            </ul>
            <NotificationBellLink />
          </div>
        </div>
      </nav>

      <NavMenuSheets
        addOpen={addOpen}
        moreOpen={moreOpen}
        onAddClose={() => setAddOpen(false)}
        onMoreClose={() => setMoreOpen(false)}
      />
    </>
  );
}
