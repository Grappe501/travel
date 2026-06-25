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
    <header className={cn('animate-slide-up space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <div className="h-px flex-1 bg-border/80" aria-hidden />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-micro font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-page-title text-foreground">{title}</h1>
            {badge}
          </div>
          {description ? <p className="max-w-2xl text-body-lg leading-relaxed text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
