import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="space-y-1">
        <h2 className="text-section-title text-foreground">{title}</h2>
        {description ? <p className="text-caption text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
