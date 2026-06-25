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
              'surface-card-interactive flex items-center gap-4 p-4',
              'focus-visible:outline-none'
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-foreground">{item.title}</span>
              <span className="block text-caption text-muted">{item.description}</span>
            </span>
            <span className="text-muted" aria-hidden>
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const SETTINGS_ACCOUNT_GROUP: SettingsNavItem[] = [
  {
    href: '/settings/account',
    title: 'Account',
    description: 'Name, timezone, currency, and tax year',
    icon: '👤',
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
