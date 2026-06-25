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
        className="glass-nav sticky top-0 z-40 hidden border-b md:block"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 text-subheading font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-sm font-bold text-primary-foreground shadow-primary transition-transform group-hover:scale-105"
              aria-hidden
            >
              M
            </span>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <ul className="flex flex-wrap items-center justify-end gap-0.5">
              {DESKTOP_TOP_NAV_ITEMS.map((item) => {
                const active = isAppNavActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'rounded-xl px-3 py-2 text-caption transition-all duration-150 focus-visible:outline-none',
                        active ? 'nav-link-active' : 'text-muted hover:bg-hover hover:text-foreground'
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
                  className="rounded-xl px-3 py-2 text-caption font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none"
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
                    'rounded-xl px-3 py-2 text-caption transition-colors focus-visible:outline-none',
                    moreActive
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-muted hover:bg-hover hover:text-foreground'
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
