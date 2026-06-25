import { describe, expect, it } from 'vitest';
import { parseSearchQuery, searchQuerySchema } from './search';

describe('parseSearchQuery', () => {
  it('parses text queries', () => {
    expect(parseSearchQuery('client visit')).toEqual({
      raw: 'client visit',
      text: 'client visit',
      amount: null,
    });
  });

  it('parses dollar amount queries', () => {
    expect(parseSearchQuery('$42.50')).toEqual({
      raw: '$42.50',
      text: null,
      amount: 42.5,
    });
  });

  it('treats invalid dollar prefix as text', () => {
    expect(parseSearchQuery('$abc')).toEqual({
      raw: '$abc',
      text: '$abc',
      amount: null,
    });
  });

  it('returns null text for empty string', () => {
    expect(parseSearchQuery('')).toEqual({
      raw: '',
      text: null,
      amount: null,
    });
  });
});

describe('searchQuerySchema', () => {
  it('accepts text query only', () => {
    expect(searchQuerySchema.safeParse({ q: 'coffee' }).success).toBe(true);
  });

  it('accepts date filters without text', () => {
    const parsed = searchQuerySchema.parse({ from: '2026-01-01', to: '2026-01-31' });
    expect(parsed.from).toBe('2026-01-01');
  });

  it('accepts amount range without text', () => {
    expect(searchQuerySchema.safeParse({ amountMin: 10, amountMax: 50 }).success).toBe(true);
  });

  it('rejects empty query with no filters', () => {
    expect(searchQuerySchema.safeParse({ q: '' }).success).toBe(false);
  });

  it('rejects inverted date range', () => {
    expect(
      searchQuerySchema.safeParse({ from: '2026-02-01', to: '2026-01-01' }).success
    ).toBe(false);
  });

  it('rejects inverted amount range', () => {
    expect(searchQuerySchema.safeParse({ amountMin: 100, amountMax: 10 }).success).toBe(false);
  });
});
