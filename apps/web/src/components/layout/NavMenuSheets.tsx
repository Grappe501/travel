'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSheet } from '@/components/layout/NavSheet';
import {
  ADD_NAV_ACTIONS,
  isAppNavActive,
  MORE_NAV_ITEMS,
  type AppNavLinkItem,
} from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

type NavMenuSheetsProps = {
  addOpen: boolean;
  moreOpen: boolean;
  onAddClose: () => void;
  onMoreClose: () => void;
};

function NavLinkRow({ item, onNavigate }: { item: AppNavLinkItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isAppNavActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-hover',
        active && 'bg-selected text-primary'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-base leading-none">
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-medium">{item.label}</span>
        {item.description ? (
          <span className="block text-caption text-muted">{item.description}</span>
        ) : null}
      </span>
    </Link>
  );
}

export function NavMenuSheets({ addOpen, moreOpen, onAddClose, onMoreClose }: NavMenuSheetsProps) {
  return (
    <>
      <NavSheet open={addOpen} onClose={onAddClose} title="Add" description="Quick actions for the field">
        <ul className="space-y-1">
          {ADD_NAV_ACTIONS.map((item) => (
            <li key={item.href}>
              <NavLinkRow item={item} onNavigate={onAddClose} />
            </li>
          ))}
        </ul>
      </NavSheet>

      <NavSheet open={moreOpen} onClose={onMoreClose} title="More" description="Receipts, clients, alerts, and settings">
        <ul className="space-y-1">
          {MORE_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLinkRow item={item} onNavigate={onMoreClose} />
            </li>
          ))}
        </ul>
      </NavSheet>
    </>
  );
}
