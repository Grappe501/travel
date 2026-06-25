import type { ReactNode } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils/cn';

type ShellPageProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Auth and marketing shells — use DashboardShell for authenticated app routes. */
export function ShellPage({
  title,
  description,
  badge,
  actions,
  children,
  className,
}: ShellPageProps) {
  return (
    <main className="mx-auto min-h-screen max-w-lg bg-background px-4 py-10 md:px-6 md:py-12">
      <PageHeader title={title} description={description} badge={badge} actions={actions} />
      {children ? <div className={cn('mt-8', className)}>{children}</div> : null}
    </main>
  );
}
