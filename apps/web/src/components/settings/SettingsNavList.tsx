import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export type SettingsNavItem = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

export function SettingsNavList({ items }: { items: SettingsNavItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              'group surface-card-interactive flex items-center gap-4 p-4',
              'focus-visible:outline-none'
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-accent/8 text-lg shadow-sm ring-1 ring-primary/10">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">{item.title}</span>
              <span className="block text-caption text-muted">{item.description}</span>
            </span>
            <span className="text-lg text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden>
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const SETTINGS_SUPPORT_GROUP: SettingsNavItem[] = [
  {
    href: '/help',
    title: 'Help center',
    description: 'Guides for trips, receipts, GPS, and reports',
    icon: '❓',
  },
];

export const SETTINGS_ACCOUNT_GROUP: SettingsNavItem[] = [
  {
    href: '/settings/account',
    title: 'Account',
    description: 'Name, timezone, currency, and tax year',
    icon: '👤',
  },
  {
    href: '/settings/install',
    title: 'Install app',
    description: 'Add to home screen for offline field use',
    icon: '📲',
  },
  {
    href: '/settings/appearance',
    title: 'Appearance',
    description: 'Light, dark, or system theme',
    icon: '◐',
  },
  {
    href: '/settings/security',
    title: 'Security',
    description: 'Password, email verification, and sign out',
    icon: '🔒',
  },
];

export const SETTINGS_PREFERENCES_GROUP: SettingsNavItem[] = [
  {
    href: '/settings/notifications',
    title: 'Notifications',
    description: 'In-app reminders and email preferences',
    icon: '🔔',
  },
  {
    href: '/settings/mileage',
    title: 'Mileage rates',
    description: 'IRS, company, or custom reimbursement',
    icon: '🛣️',
  },
  {
    href: '/billing',
    title: 'Billing & plan',
    description: 'Usage limits and subscription',
    icon: '★',
  },
  {
    href: '/settings/privacy',
    title: 'Data & privacy',
    description: 'Export records and legal policies',
    icon: '🛡️',
  },
];

export const SETTINGS_WORKSPACE_GROUP: SettingsNavItem[] = [
  {
    href: '/businesses',
    title: 'Businesses',
    description: 'Profiles used for trips and reports',
    icon: '🏢',
  },
  {
    href: '/vehicles',
    title: 'Vehicles',
    description: 'Cars and trucks for mileage logging',
    icon: '🚗',
  },
  {
    href: '/clients',
    title: 'Clients & projects',
    description: 'Organize work by client or job',
    icon: '👥',
  },
  {
    href: '/ai/history',
    title: 'AI history',
    description: 'Past OCR runs and suggestions',
    icon: '✨',
  },
];
