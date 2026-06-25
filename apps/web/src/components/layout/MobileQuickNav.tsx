'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getContextualQuickNav } from '@/lib/navigation/app-nav';
import { cn } from '@/lib/utils/cn';

/** Contextual shortcuts on trip-focused mobile pages — complements the five-tab bottom bar. */
export function MobileQuickNav() {
  const pathname = usePathname();
  const links = getContextualQuickNav(pathname);

  if (links.length === 0) {
    return null;
  }

  return (
    <nav
      className="mb-4 flex gap-2 overflow-x-auto border-b border-border pb-3 md:hidden"
      aria-label="Quick actions"
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'shrink-0 rounded-full bg-surface-elevated px-3 py-1.5 text-caption text-muted transition-colors hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
