import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className
      )}
    >
      {icon ? <div className="mb-4 text-muted">{icon}</div> : null}
      <h3 className="text-card-title text-foreground">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-caption text-muted">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
