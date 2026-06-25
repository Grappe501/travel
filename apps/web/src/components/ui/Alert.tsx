import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const variantStyles = {
  info: 'border-info/30 bg-info/10 text-foreground',
  success: 'border-success/30 bg-success/10 text-foreground',
  warning: 'border-warning/30 bg-warning/10 text-foreground',
  error: 'border-danger/30 bg-danger/10 text-foreground',
} as const;

export type AlertVariant = keyof typeof variantStyles;

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-body',
        variantStyles[variant],
        className
      )}
    >
      {title ? <p className="text-subheading">{title}</p> : null}
      <div className={cn(title && 'mt-1', 'text-caption')}>{children}</div>
    </div>
  );
}
