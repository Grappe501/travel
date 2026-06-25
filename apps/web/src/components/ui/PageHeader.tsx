import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, badge, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-page-title text-foreground">{title}</h1>
            {badge}
          </div>
          {description ? <p className="max-w-2xl text-body text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
