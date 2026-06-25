import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const variantStyles = {
  info: 'alert-accent border-info bg-info/10 text-foreground',
  success: 'alert-accent border-success bg-success/10 text-foreground',
  warning: 'alert-accent border-warning bg-warning/10 text-foreground',
  error: 'alert-accent border-danger bg-danger/10 text-foreground',
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
      className={cn('text-body shadow-sm', variantStyles[variant], className)}
    >
      {title ? <p className="text-subheading font-semibold">{title}</p> : null}
      <div className={cn(title && 'mt-1', 'text-caption leading-relaxed')}>{children}</div>
    </div>
  );
}
