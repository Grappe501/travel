import { z } from 'zod';
import { EXPENSE_CATEGORY_SLUGS } from './receipt';

export const SEARCH_KINDS = [
  'trip',
  'expense',
  'receipt',
  'client',
  'business',
  'vehicle',
] as const;

export type SearchKind = (typeof SEARCH_KINDS)[number];

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const searchFiltersSchema = z
  .object({
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    amountMin: z.coerce.number().nonnegative().optional(),
    amountMax: z.coerce.number().nonnegative().optional(),
    kind: z.enum(SEARCH_KINDS).optional(),
    category: z.enum(EXPENSE_CATEGORY_SLUGS).optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from <= data.to;
      }
      return true;
    },
    { message: 'Start date must be before end date', path: ['to'] }
  )
  .refine(
    (data) => {
      if (data.amountMin !== undefined && data.amountMax !== undefined) {
        return data.amountMin <= data.amountMax;
      }
      return true;
    },
    { message: 'Minimum amount must be less than maximum', path: ['amountMax'] }
  );

export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;

export const searchQuerySchema = z
  .object({
    q: z.string().trim().max(200).optional().default(''),
    limit: z.coerce.number().int().min(1).max(25).optional(),
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    amountMin: z.coerce.number().nonnegative().optional(),
    amountMax: z.coerce.number().nonnegative().optional(),
    kind: z.enum(SEARCH_KINDS).optional(),
    category: z.enum(EXPENSE_CATEGORY_SLUGS).optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from <= data.to;
      }
      return true;
    },
    { message: 'Start date must be before end date', path: ['to'] }
  )
  .refine(
    (data) => {
      if (data.amountMin !== undefined && data.amountMax !== undefined) {
        return data.amountMin <= data.amountMax;
      }
      return true;
    },
    { message: 'Minimum amount must be less than maximum', path: ['amountMax'] }
  )
  .refine(
    (data) => {
      const trimmed = data.q?.trim() ?? '';
      const hasQuery = trimmed.length > 0;
      const hasDate = Boolean(data.from || data.to);
      const hasAmountRange = data.amountMin !== undefined || data.amountMax !== undefined;
      return hasQuery || hasDate || hasAmountRange;
    },
    { message: 'Enter a search term or apply date/amount filters', path: ['q'] }
  );

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

export type ParsedSearchQuery = {
  raw: string;
  text: string | null;
  amount: number | null;
};

export function parseSearchQuery(raw: string): ParsedSearchQuery {
  const trimmed = raw.trim();

  if (trimmed.startsWith('$')) {
    const amount = Number(trimmed.slice(1).replace(/,/g, ''));
    if (!Number.isNaN(amount) && amount >= 0) {
      return { raw: trimmed, text: null, amount };
    }
  }

  return { raw: trimmed, text: trimmed.length > 0 ? trimmed : null, amount: null };
}

export type SearchFiltersApplied = {
  from: string | null;
  to: string | null;
  amountMin: number | null;
  amountMax: number | null;
  kind: SearchKind | null;
  category: (typeof EXPENSE_CATEGORY_SLUGS)[number] | null;
};

export type SearchResultItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string | null;
  href: string;
};

export type UnifiedSearchResults = {
  query: string;
  filters: SearchFiltersApplied;
  trips: SearchResultItem[];
  expenses: SearchResultItem[];
  receipts: SearchResultItem[];
  clients: SearchResultItem[];
  businesses: SearchResultItem[];
  vehicles: SearchResultItem[];
  totalCount: number;
};

export function emptySearchFilters(): SearchFiltersApplied {
  return {
    from: null,
    to: null,
    amountMin: null,
    amountMax: null,
    kind: null,
    category: null,
  };
}

export function appliedFiltersFromQuery(input: SearchQueryInput): SearchFiltersApplied {
  return {
    from: input.from ?? null,
    to: input.to ?? null,
    amountMin: input.amountMin ?? null,
    amountMax: input.amountMax ?? null,
    kind: input.kind ?? null,
    category: input.category ?? null,
  };
}

export function buildSearchQueryString(input: SearchQueryInput): string {
  const params = new URLSearchParams();
  const q = input.q?.trim();
  if (q) params.set('q', q);
  if (input.from) params.set('from', input.from);
  if (input.to) params.set('to', input.to);
  if (input.amountMin !== undefined) params.set('amountMin', String(input.amountMin));
  if (input.amountMax !== undefined) params.set('amountMax', String(input.amountMax));
  if (input.kind) params.set('kind', input.kind);
  if (input.category) params.set('category', input.category);
  return params.toString();
}
