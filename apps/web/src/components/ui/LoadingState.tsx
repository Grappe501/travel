import { cn } from '@/lib/utils/cn';

type LoadingStateProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export function LoadingState({ label = 'Loading…', size = 'md', className }: LoadingStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-border border-t-primary',
          sizeStyles[size]
        )}
        aria-hidden
      />
      <p className="text-caption text-muted">{label}</p>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-hover', className)}
      aria-hidden
    />
  );
}
