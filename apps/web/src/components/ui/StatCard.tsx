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
  default: 'from-surface to-surface-muted/60 ring-border/60',
  primary: 'from-primary/10 to-surface ring-primary/20',
  accent: 'from-accent/10 to-surface ring-accent/20',
};

export function StatCard({ label, value, icon, tone = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl bg-gradient-to-br p-4 ring-1 ring-inset',
        toneStyles[tone],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-caption font-medium text-muted">{label}</p>
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/80 text-base shadow-sm ring-1 ring-border/50">
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
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg text-primary transition-all duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-primary">
            {item.icon}
          </span>
          <span className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-caption text-muted">{item.description}</p>
          </span>
          <span
            className="self-center text-lg text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          >
            →
          </span>
        </a>
      ))}
    </div>
  );
}
