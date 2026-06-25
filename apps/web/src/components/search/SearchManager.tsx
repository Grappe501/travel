'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  EXPENSE_CATEGORY_SLUGS,
  SEARCH_KINDS,
  buildSearchQueryString,
  type SearchFiltersInput,
  type SearchQueryInput,
  type SearchResultItem,
  type UnifiedSearchResults,
} from '@mileage-copilot/shared';
import { Alert, Card, CardContent, Input, Select } from '@/components/ui';
import { formatCategoryLabel } from '@/lib/receipts/categories';

const GROUP_LABELS: Record<keyof Omit<UnifiedSearchResults, 'query' | 'filters' | 'totalCount'>, string> = {
  trips: 'Trips',
  expenses: 'Expenses',
  receipts: 'Receipts',
  clients: 'Clients',
  businesses: 'Businesses',
  vehicles: 'Vehicles',
};

const KIND_OPTIONS = [
  { value: '', label: 'All types' },
  ...SEARCH_KINDS.map((kind) => ({
    value: kind,
    label: kind.charAt(0).toUpperCase() + kind.slice(1) + 's',
  })),
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'Any category' },
  ...EXPENSE_CATEGORY_SLUGS.map((slug) => ({
    value: slug,
    label: formatCategoryLabel(slug),
  })),
];

export type SearchFiltersState = {
  from: string;
  to: string;
  amountMin: string;
  amountMax: string;
  kind: string;
  category: string;
};

export function emptySearchFiltersState(): SearchFiltersState {
  return {
    from: '',
    to: '',
    amountMin: '',
    amountMax: '',
    kind: '',
    category: '',
  };
}

export function filtersStateFromInput(input: Partial<SearchQueryInput>): SearchFiltersState {
  return {
    from: input.from ?? '',
    to: input.to ?? '',
    amountMin: input.amountMin !== undefined ? String(input.amountMin) : '',
    amountMax: input.amountMax !== undefined ? String(input.amountMax) : '',
    kind: input.kind ?? '',
    category: input.category ?? '',
  };
}

function filtersStateToInput(
  filters: SearchFiltersState
): Pick<
  SearchQueryInput,
  'from' | 'to' | 'amountMin' | 'amountMax' | 'kind' | 'category'
> {
  return {
    ...(filters.from ? { from: filters.from } : {}),
    ...(filters.to ? { to: filters.to } : {}),
    ...(filters.amountMin ? { amountMin: Number(filters.amountMin) } : {}),
    ...(filters.amountMax ? { amountMax: Number(filters.amountMax) } : {}),
    ...(filters.kind ? { kind: filters.kind as SearchFiltersInput['kind'] } : {}),
    ...(filters.category
      ? { category: filters.category as SearchFiltersInput['category'] }
      : {}),
  };
}

function hasActiveFilters(filters: SearchFiltersState) {
  return Boolean(
    filters.from ||
      filters.to ||
      filters.amountMin ||
      filters.amountMax ||
      filters.kind ||
      filters.category
  );
}

function buildSearchUrl(query: string, filters: SearchFiltersState) {
  const qs = buildSearchQueryString({
    q: query.trim(),
    ...filtersStateToInput(filters),
  });
  return qs ? `/search?${qs}` : '/search';
}

function buildApiUrl(query: string, filters: SearchFiltersState) {
  const qs = buildSearchQueryString({
    q: query.trim(),
    ...filtersStateToInput(filters),
  });
  return qs ? `/api/search?${qs}` : '/api/search';
}

type GlobalSearchFieldProps = {
  initialQuery?: string;
  initialFilters?: SearchFiltersState;
  autoFocus?: boolean;
  live?: boolean;
};

export function GlobalSearchField({
  initialQuery = '',
  initialFilters = emptySearchFiltersState(),
  autoFocus = false,
  live = false,
}: GlobalSearchFieldProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(hasActiveFilters(initialFilters));
  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const debouncedFilters = useDebouncedValue(filters, 300);

  const canSearch = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    return trimmed.length >= 2 || hasActiveFilters(debouncedFilters);
  }, [debouncedQuery, debouncedFilters]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setFilters(initialFilters);
    if (hasActiveFilters(initialFilters)) {
      setShowFilters(true);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (!live || !canSearch) {
      setResults(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetch(buildApiUrl(debouncedQuery, debouncedFilters))
      .then(async (response) => {
        const payload = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          setError(payload.error ?? 'Search failed');
          setResults(null);
          return;
        }
        setResults(payload.data as UnifiedSearchResults);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Search failed');
          setResults(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, debouncedFilters, live, canSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildSearchUrl(query, filters));
  }

  function clearFilters() {
    setFilters(emptySearchFiltersState());
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trips, receipts, clients… ($12.50 for exact amount)"
              autoFocus={autoFocus}
              aria-label="Search"
              className="flex-1"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((open) => !open)}
            className="mt-auto shrink-0 rounded-lg border border-border px-3 py-2 text-caption font-medium text-foreground hover:bg-surface-elevated"
            aria-expanded={showFilters}
          >
            Filters
          </button>
          <button
            type="submit"
            className="mt-auto shrink-0 rounded-lg bg-primary px-4 py-2 text-caption font-medium text-primary-foreground hover:opacity-90"
          >
            Search
          </button>
        </div>

        {showFilters ? (
          <SearchFiltersPanel filters={filters} onChange={setFilters} onClear={clearFilters} />
        ) : null}
      </form>

      {live && loading ? <p className="text-caption text-muted">Searching…</p> : null}
      {live && error ? <Alert variant="error">{error}</Alert> : null}
      {live && results ? <SearchResults groups={results} compact /> : null}
    </div>
  );
}

type SearchFiltersPanelProps = {
  filters: SearchFiltersState;
  onChange: (filters: SearchFiltersState) => void;
  onClear: () => void;
};

export function SearchFiltersPanel({ filters, onChange, onClear }: SearchFiltersPanelProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2">
      <Input
        label="From date"
        id="search-from"
        type="date"
        value={filters.from}
        onChange={(e) => onChange({ ...filters, from: e.target.value })}
      />
      <Input
        label="To date"
        id="search-to"
        type="date"
        value={filters.to}
        onChange={(e) => onChange({ ...filters, to: e.target.value })}
      />
      <Input
        label="Min amount"
        id="search-amount-min"
        type="number"
        min={0}
        step="0.01"
        value={filters.amountMin}
        onChange={(e) => onChange({ ...filters, amountMin: e.target.value })}
        placeholder="0.00"
      />
      <Input
        label="Max amount"
        id="search-amount-max"
        type="number"
        min={0}
        step="0.01"
        value={filters.amountMax}
        onChange={(e) => onChange({ ...filters, amountMax: e.target.value })}
        placeholder="999.99"
      />
      <Select
        label="Type"
        id="search-kind"
        value={filters.kind}
        onChange={(e) => onChange({ ...filters, kind: e.target.value })}
        options={KIND_OPTIONS}
      />
      <Select
        label="Expense category"
        id="search-category"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        options={CATEGORY_OPTIONS}
      />
      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={onClear}
          className="text-caption font-medium text-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

type SearchResultsProps = {
  groups: UnifiedSearchResults;
  compact?: boolean;
};

export function SearchResults({ groups, compact = false }: SearchResultsProps) {
  const filterSummary = formatFilterSummary(groups.filters);

  if (groups.totalCount === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-body text-muted">
          No results
          {groups.query ? (
            <>
              {' '}
              for &ldquo;{groups.query}&rdquo;
            </>
          ) : null}
          {filterSummary ? <> with {filterSummary}</> : null}. Try broader terms or adjust filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!compact ? (
        <p className="text-caption text-muted">
          {groups.totalCount} result{groups.totalCount === 1 ? '' : 's'}
          {groups.query ? (
            <>
              {' '}
              for &ldquo;{groups.query}&rdquo;
            </>
          ) : null}
          {filterSummary ? <> · {filterSummary}</> : null}
        </p>
      ) : null}

      {(Object.keys(GROUP_LABELS) as Array<keyof typeof GROUP_LABELS>).map((key) => {
        const items = groups[key];
        if (items.length === 0) return null;

        return (
          <section key={key} className="space-y-2">
            <h2 className="text-section-title text-foreground">{GROUP_LABELS[key]}</h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <SearchResultRow key={`${item.kind}-${item.id}`} item={item} />
              ))}
            </ul>
          </section>
        );
      })}

      {!compact ? (
        <p className="text-caption text-muted">
          Tip: prefix with <span className="font-mono">$</span> for an exact amount, or use date and
          amount filters above.
        </p>
      ) : null}
    </div>
  );
}

function formatFilterSummary(filters: UnifiedSearchResults['filters']) {
  const parts: string[] = [];
  if (filters.from || filters.to) {
    parts.push(
      `dates ${filters.from ?? '…'} – ${filters.to ?? '…'}`
    );
  }
  if (filters.amountMin !== null || filters.amountMax !== null) {
    parts.push(
      `amount ${filters.amountMin ?? '…'} – ${filters.amountMax ?? '…'}`
    );
  }
  if (filters.kind) parts.push(`type ${filters.kind}`);
  if (filters.category) parts.push(`category ${filters.category}`);
  return parts.join(', ');
}

function SearchResultRow({ item }: { item: SearchResultItem }) {
  return (
    <li>
      <Link
        href={item.href}
        className="block rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40 hover:bg-surface-elevated"
      >
        <p className="font-medium text-foreground">{item.title}</p>
        {item.subtitle ? <p className="text-caption text-muted">{item.subtitle}</p> : null}
      </Link>
    </li>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function GlobalSearchShortcutHint() {
  return (
    <p className="text-caption text-muted">
      Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-micro">/</kbd>{' '}
      on the search page to focus the search field. Use Filters for date and amount ranges.
    </p>
  );
}
