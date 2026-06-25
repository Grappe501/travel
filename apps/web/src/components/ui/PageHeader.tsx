import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
  eyebrow?: string;
};

export function PageHeader({ title, description, badge, actions, className, eyebrow }: PageHeaderProps) {
  return (
    <header className={cn('animate-fade-in space-y-3', className)}>
      <div className="h-1 w-12 rounded-full bg-primary/80" aria-hidden />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-micro uppercase tracking-wider text-primary">{eyebrow}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-page-title text-foreground">{title}</h1>
            {badge}
          </div>
          {description ? <p className="max-w-2xl text-body-lg text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
