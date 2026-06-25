'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/trips', label: 'Trips', icon: '◎' },
  { href: '/receipts', label: 'Receipts', icon: '▣' },
  { href: '/reports', label: 'Reports', icon: '≡' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-micro transition-colors focus-visible:outline-none',
                  active ? 'text-primary' : 'text-muted hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className="text-base leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
