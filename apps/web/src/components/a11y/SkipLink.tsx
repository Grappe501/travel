import { cn } from '@/lib/utils/cn';

type SkipLinkProps = {
  targetId?: string;
  label?: string;
};

export function SkipLink({ targetId = 'main-content', label = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-lg bg-primary px-4 py-2 text-body font-medium text-primary-foreground shadow-md transition-transform',
        'focus:translate-y-0 focus:outline-none'
      )}
    >
      {label}
    </a>
  );
}
