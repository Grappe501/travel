import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md';
  interactive?: boolean;
  variant?: 'default' | 'elevated' | 'soft' | 'highlight';
};

const variantStyles = {
  default: 'surface-card',
  elevated: 'surface-card-elevated',
  soft: 'surface-card-soft',
  highlight: 'surface-card-highlight',
} as const;

export function Card({
  children,
  className,
  padding = 'md',
  interactive = false,
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        interactive ? 'surface-card-interactive' : variantStyles[variant],
        padding === 'sm' && 'p-3',
        padding === 'md' && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-card-title text-foreground', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-caption text-muted', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2 pt-4', className)} {...props}>
      {children}
    </div>
  );
}
