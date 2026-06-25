'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAV_ITEMS, isAppNavActive } from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-start overflow-x-auto">
        {APP_NAV_ITEMS.map((item) => {
          const active = isAppNavActive(pathname, item.href);
          const label = item.shortLabel ?? item.label;

          return (
            <li key={item.href} className="min-w-[4.25rem] flex-1 shrink-0">
              <Link
                href={item.href}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-micro transition-colors focus-visible:outline-none',
                  active ? 'text-primary' : 'text-muted hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
                title={item.label}
              >
                <span className="text-base leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
