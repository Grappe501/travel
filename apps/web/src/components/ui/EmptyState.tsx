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
        'surface-card-soft flex flex-col items-center justify-center border-dashed px-6 py-16 text-center animate-scale-in',
        className
      )}
    >
      {icon ? (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 text-3xl shadow-sm ring-1 ring-primary/15">
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
