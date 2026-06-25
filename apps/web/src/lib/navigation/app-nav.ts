export type AppNavLinkItem = {
  kind: 'link';
  href: string;
  label: string;
  icon: string;
  shortLabel?: string;
  description?: string;
};

export type AppNavActionItem = {
  kind: 'action';
  id: 'add' | 'more';
  label: string;
  icon: string;
  shortLabel?: string;
};

export type AppNavItem = AppNavLinkItem | AppNavActionItem;

/** Five-item mobile bottom bar: Home · Trips · Add · Reports · More */
export const BOTTOM_NAV_ITEMS: AppNavItem[] = [
  { kind: 'link', href: '/dashboard', label: 'Home', icon: '⌂', shortLabel: 'Home' },
  { kind: 'link', href: '/trips', label: 'Trips', icon: '◎', shortLabel: 'Trips' },
  { kind: 'action', id: 'add', label: 'Add', icon: '+', shortLabel: 'Add' },
  { kind: 'link', href: '/reports', label: 'Reports', icon: '≡', shortLabel: 'Rpts' },
  { kind: 'action', id: 'more', label: 'More', icon: '☰', shortLabel: 'More' },
];

export const ADD_NAV_ACTIONS: AppNavLinkItem[] = [
  {
    kind: 'link',
    href: '/trips/start',
    label: 'Start trip',
    icon: '◎',
    description: 'Log business mileage',
  },
  {
    kind: 'link',
    href: '/receipts/upload',
    label: 'Upload receipt',
    icon: '▣',
    description: 'Scan and categorize',
  },
  {
    kind: 'link',
    href: '/expenses/new',
    label: 'Add expense',
    icon: '$',
    description: 'Manual entry',
  },
];

export const MORE_NAV_ITEMS: AppNavLinkItem[] = [
  { kind: 'link', href: '/receipts', label: 'Receipts', icon: '▣', shortLabel: 'Rcpts' },
  { kind: 'link', href: '/expenses', label: 'Expenses', icon: '$', shortLabel: 'Exp' },
  { kind: 'link', href: '/clients', label: 'Clients', icon: '◉', shortLabel: 'Clients' },
  { kind: 'link', href: '/search', label: 'Search', icon: '⌕', shortLabel: 'Search' },
  {
    kind: 'link',
    href: '/notifications',
    label: 'Notifications',
    icon: '🔔',
    shortLabel: 'Alerts',
  },
  { kind: 'link', href: '/settings', label: 'Settings', icon: '⚙', shortLabel: 'Set' },
  { kind: 'link', href: '/billing', label: 'Billing', icon: '★', shortLabel: 'Bill' },
];

/** Desktop top bar — primary destinations plus Search; More holds the rest. */
export const DESKTOP_TOP_NAV_ITEMS: AppNavLinkItem[] = [
  { kind: 'link', href: '/dashboard', label: 'Home', icon: '⌂' },
  { kind: 'link', href: '/trips', label: 'Trips', icon: '◎' },
  { kind: 'link', href: '/receipts', label: 'Receipts', icon: '▣' },
  { kind: 'link', href: '/expenses', label: 'Expenses', icon: '$' },
  { kind: 'link', href: '/reports', label: 'Reports', icon: '≡' },
  { kind: 'link', href: '/search', label: 'Search', icon: '⌕' },
];

/** @deprecated Use BOTTOM_NAV_ITEMS, MORE_NAV_ITEMS, or DESKTOP_TOP_NAV_ITEMS */
export const APP_NAV_ITEMS: AppNavLinkItem[] = [
  ...DESKTOP_TOP_NAV_ITEMS,
  { kind: 'link', href: '/clients', label: 'Clients', icon: '◉' },
  { kind: 'link', href: '/settings', label: 'Settings', icon: '⚙' },
];

export type QuickNavLink = {
  href: string;
  label: string;
};

export function isAppNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isMoreNavActive(pathname: string): boolean {
  return MORE_NAV_ITEMS.some((item) => isAppNavActive(pathname, item.href));
}

/** Contextual shortcuts on trip-focused mobile pages (replaces duplicated tab strip). */
export function getContextualQuickNav(pathname: string): QuickNavLink[] {
  const tripDetail = pathname.match(/^\/trips\/([^/]+)$/);
  if (tripDetail && tripDetail[1] !== 'start') {
    const tripId = tripDetail[1];
    return [
      { href: `/receipts/upload?tripId=${tripId}`, label: 'Upload receipt' },
      { href: `/expenses/new?tripId=${tripId}`, label: 'Add expense' },
      { href: `/trips/${tripId}/end`, label: 'End trip' },
    ];
  }

  if (pathname === '/trips' || pathname.startsWith('/trips/')) {
    return [
      { href: '/trips/start', label: 'Start trip' },
      { href: '/receipts/upload', label: 'Upload receipt' },
    ];
  }

  if (pathname.startsWith('/expenses')) {
    return [
      { href: '/expenses/new', label: 'Add expense' },
      { href: '/receipts/upload', label: 'Upload receipt' },
    ];
  }

  if (pathname === '/receipts/upload') {
    return [
      { href: '/trips', label: 'Trips' },
      { href: '/expenses/new', label: 'Add expense' },
    ];
  }

  return [];
}
