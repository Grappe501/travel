import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ShellNavActions } from '@/components/layout/ShellNavActions';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { q = '' } = await searchParams;

  return (
    <DashboardShell
      title="Search"
      description="Find trips, receipts, expenses, and clients. Use filters for dates and amounts."
      actions={<ShellNavActions backHref="/dashboard" backLabel="Home" />}
    >
      <Suspense fallback={null}>
        <SearchPageClient initialQuery={q} />
      </Suspense>
    </DashboardShell>
  );
}
