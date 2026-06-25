import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'primary' | 'accent';
  className?: string;
};

const toneStyles = {
  default: 'from-surface to-background-subtle/80',
  primary: 'from-primary/8 to-surface',
  accent: 'from-accent/10 to-surface',
};

export function StatCard({ label, value, icon, tone = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'surface-card flex flex-col gap-2 bg-gradient-to-br p-4',
        toneStyles[tone],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption font-medium text-muted">{label}</p>
        {icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base text-primary">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
}

type QuickActionProps = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

export function QuickActionGrid({ actions }: { actions: QuickActionProps[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((item) => (
        <a key={item.href} href={item.href} className="quick-action-tile group">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {item.icon}
          </span>
          <span className="min-w-0">
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-caption text-muted">{item.description}</p>
          </span>
        </a>
      ))}
    </div>
  );
}
