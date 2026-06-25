import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const variantStyles = {
  primary:
    'bg-gradient-to-b from-primary to-primary-hover text-primary-foreground shadow-primary hover:from-primary-hover hover:to-primary-active active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
  secondary:
    'border border-border bg-surface text-foreground shadow-sm hover:bg-hover active:bg-selected active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
  destructive:
    'bg-danger text-danger-foreground shadow-sm hover:opacity-90 active:opacity-80 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
  ghost:
    'text-foreground hover:bg-hover active:bg-selected disabled:pointer-events-none disabled:opacity-40',
  link: 'text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-40',
} as const;

const sizeStyles = {
  sm: 'h-9 px-3.5 text-caption rounded-lg',
  md: 'h-11 px-5 text-body rounded-xl',
  lg: 'h-12 px-6 text-body-lg rounded-xl',
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </Link>
  );
}
