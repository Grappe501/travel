import type { ReactNode } from 'react';
import { SkipLink } from '@/components/a11y/SkipLink';
import { AppTopNav } from '@/components/layout/AppTopNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { ConditionalMobileQuickNav } from '@/components/layout/ConditionalMobileQuickNav';
import { ConditionalGlobalSearchBar } from '@/components/search/ConditionalGlobalSearchBar';
import { OfflineBanner } from '@/components/offline/OfflineBanner';
import { PageHeader } from '@/components/ui/PageHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { ToastProvider } from '@/components/ui/ToastProvider';
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
    <ToastProvider>
      <div className="min-h-screen bg-background">
      <SkipLink />
      <AppTopNav />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pb-12 md:pt-8">
        <ConditionalMobileQuickNav />
        <ConditionalGlobalSearchBar />
        <PageHeader title={title} description={description} badge={badge} actions={actions} />
        <OfflineBanner />
        <main
          id="main-content"
          tabIndex={-1}
          aria-label={title}
          className={cn('mt-8 space-y-6 outline-none', className)}
        >
          {children}
        </main>
        <AppFooter />
      </div>
      <BottomNav />
    </div>
    </ToastProvider>
  );
}
