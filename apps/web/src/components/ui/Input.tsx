import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-subheading text-foreground">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-foreground',
          'placeholder:text-muted',
          'focus-visible:border-primary focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          error && 'border-danger focus-visible:border-danger',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="block text-subheading text-foreground">
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={cn(
          'min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-foreground',
          'placeholder:text-muted focus-visible:border-primary focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          error && 'border-danger',
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormField({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-1', className)}>{children}</div>;
}
