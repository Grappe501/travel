import type { ReactNode } from 'react';
import { SkipLink } from '@/components/a11y/SkipLink';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils/cn';

type DashboardShellProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardShell({
  title,
  description,
  badge,
  actions,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pb-12 md:pt-10">
        <PageHeader title={title} description={description} badge={badge} actions={actions} />
        <main
          id="main-content"
          tabIndex={-1}
          aria-label={title}
          className={cn('mt-8 space-y-6 outline-none', className)}
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
