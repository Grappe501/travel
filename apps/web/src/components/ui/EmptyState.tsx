import type { ReactNode } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
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
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'surface-card flex flex-col items-center justify-center border-dashed bg-gradient-to-b from-surface to-background-subtle/50 px-6 py-14 text-center',
        className
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-card-title text-foreground">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-body text-muted">{description}</p> : null}
      {actionLabel && actionHref ? (
        <ButtonLink href={actionHref} className="mt-6" size="sm">
          {actionLabel}
        </ButtonLink>
      ) : actionLabel && onAction ? (
        <Button className="mt-6" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
