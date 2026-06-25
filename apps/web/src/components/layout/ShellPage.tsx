import type { ReactNode } from 'react';
import { SkipLink } from '@/components/a11y/SkipLink';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils/cn';

type ShellPageProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  /** Wrap main content in elevated auth card */
  auth?: boolean;
};

/** Auth and marketing shells — use DashboardShell for authenticated app routes. */
export function ShellPage({
  title,
  description,
  badge,
  actions,
  eyebrow,
  children,
  className,
  auth = false,
}: ShellPageProps) {
  return (
    <div className="app-shell-bg">
      <SkipLink />
      <main
        id="main-content"
        tabIndex={-1}
        aria-label={title}
        className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10 outline-none md:px-6 md:py-14"
      >
        <PageHeader
          title={title}
          description={description}
          badge={badge}
          actions={actions}
          eyebrow={eyebrow}
        />
        {children ? (
          <div className={cn('mt-8', auth && 'auth-panel animate-fade-in', className)}>{children}</div>
        ) : null}
      </main>
    </div>
  );
}
