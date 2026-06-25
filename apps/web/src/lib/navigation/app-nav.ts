export type AppNavItem = {
  href: string;
  label: string;
  icon: string;
  /** Shorter label for compact mobile bottom nav */
  shortLabel?: string;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { href: '/dashboard', label: 'Home', icon: '⌂', shortLabel: 'Home' },
  { href: '/trips', label: 'Trips', icon: '◎', shortLabel: 'Trips' },
  { href: '/receipts', label: 'Receipts', icon: '▣', shortLabel: 'Rcpts' },
  { href: '/expenses', label: 'Expenses', icon: '$', shortLabel: 'Exp' },
  { href: '/clients', label: 'Clients', icon: '◉', shortLabel: 'Clients' },
  { href: '/reports', label: 'Reports', icon: '≡', shortLabel: 'Rpts' },
  { href: '/settings', label: 'Settings', icon: '⚙', shortLabel: 'Set' },
];

export function isAppNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
