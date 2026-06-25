'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import {
  GlobalSearchField,
  GlobalSearchShortcutHint,
  filtersStateFromInput,
} from '@/components/search/SearchManager';
import type { SearchQueryInput } from '@mileage-copilot/shared';

type SearchPageClientProps = {
  initialQuery: string;
};

function readFiltersFromParams(searchParams: URLSearchParams) {
  return filtersStateFromInput({
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    amountMin: searchParams.get('amountMin')
      ? Number(searchParams.get('amountMin'))
      : undefined,
    amountMax: searchParams.get('amountMax')
      ? Number(searchParams.get('amountMax'))
      : undefined,
    kind: (searchParams.get('kind') as SearchQueryInput['kind']) ?? undefined,
    category: (searchParams.get('category') as SearchQueryInput['category']) ?? undefined,
  });
}

export function SearchPageClient({ initialQuery }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? initialQuery;
  const filters = useMemo(
    () => readFiltersFromParams(searchParams),
    [searchParams]
  );

  const hasSearch = query.trim().length > 0 || Boolean(
    filters.from ||
      filters.to ||
      filters.amountMin ||
      filters.amountMax ||
      filters.kind ||
      filters.category
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      const input = document.getElementById('global-search');
      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      <GlobalSearchField
        initialQuery={query}
        initialFilters={filters}
        autoFocus
        live
      />
      <GlobalSearchShortcutHint />
      {!hasSearch ? (
        <p className="text-body text-muted">
          Search across trips, expenses, receipts, clients, businesses, and vehicles. Open Filters
          to narrow by date range, amount, type, or category.
        </p>
      ) : null}
    </div>
  );
}
