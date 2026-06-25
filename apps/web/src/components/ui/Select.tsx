import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={selectId} className="block text-subheading text-foreground">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-foreground',
          'focus-visible:border-primary focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-40',
          error && 'border-danger',
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
