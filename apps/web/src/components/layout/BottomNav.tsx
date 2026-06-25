'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NavMenuSheets } from '@/components/layout/NavMenuSheets';
import {
  BOTTOM_NAV_ITEMS,
  isAppNavActive,
  isMoreNavActive,
  type AppNavActionItem,
  type AppNavLinkItem,
} from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

export function BottomNav() {
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = isMoreNavActive(pathname);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Primary navigation"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5 items-stretch">
          {BOTTOM_NAV_ITEMS.map((item) => {
            if (item.kind === 'action') {
              return (
                <li key={item.id}>
                  <NavActionButton
                    item={item}
                    onClick={() => {
                      if (item.id === 'add') setAddOpen(true);
                      if (item.id === 'more') setMoreOpen(true);
                    }}
                    active={item.id === 'more' && moreActive}
                  />
                </li>
              );
            }

            return (
              <li key={item.href}>
                <NavLinkButton item={item} pathname={pathname} />
              </li>
            );
          })}
        </ul>
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

function NavLinkButton({ item, pathname }: { item: AppNavLinkItem; pathname: string }) {
  const active = isAppNavActive(pathname, item.href);
  const label = item.shortLabel ?? item.label;

  return (
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
  );
}

function NavActionButton({
  item,
  onClick,
  active,
}: {
  item: AppNavActionItem;
  onClick: () => void;
  active: boolean;
}) {
  const label = item.shortLabel ?? item.label;
  const isAdd = item.id === 'add';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 text-micro transition-colors focus-visible:outline-none',
        isAdd
          ? 'text-primary-foreground'
          : active
            ? 'text-primary'
            : 'text-muted hover:text-foreground'
      )}
      aria-label={item.label}
      aria-haspopup="dialog"
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center text-lg leading-none',
          isAdd && 'rounded-full bg-primary font-semibold shadow-sm'
        )}
        aria-hidden
      >
        {item.icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
