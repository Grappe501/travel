import { describe, expect, it } from 'vitest';
import {
  buildCategorySuggestion,
  CATEGORY_CONFIDENCE_THRESHOLD,
  formatCategorySuggestionMessage,
  scoreFromUserHistory,
  shouldShowCategoryAlternatives,
} from '@/lib/ai/category-intelligence';

describe('buildCategorySuggestion', () => {
  it('suggests fuel for known gas station merchants', () => {
    const result = buildCategorySuggestion({ merchant: 'Shell #4521' });

    expect(result.primary.slug).toBe('fuel');
    expect(result.primary.confidence).toBeGreaterThanOrEqual(0.9);
    expect(result.primary.source).toBe('merchant_kb');
  });

  it('uses user history when merchant matches past expenses', () => {
    const result = buildCategorySuggestion({
      merchant: 'Acme Consulting',
      userHistory: [
        { merchant: 'Acme Consulting', categorySlug: 'meals' },
        { merchant: 'Acme Consulting', categorySlug: 'meals' },
        { merchant: 'Acme Consulting', categorySlug: 'travel' },
      ],
    });

    expect(result.primary.slug).toBe('meals');
    expect(result.primary.source).toBe('user_history');
  });

  it('falls back to other with low confidence when no signals', () => {
    const result = buildCategorySuggestion({ merchant: 'Unknown Vendor XYZ' });

    expect(result.primary.slug).toBe('other');
    expect(result.primary.confidence).toBeLessThan(CATEGORY_CONFIDENCE_THRESHOLD);
    expect(result.alternatives.length).toBeGreaterThan(0);
  });

  it('prefers merchant kb over weaker ocr hint', () => {
    const result = buildCategorySuggestion({
      merchant: 'Chevron',
      ocrCategorySlug: 'meals',
      ocrCategoryConfidence: 0.6,
    });

    expect(result.primary.slug).toBe('fuel');
  });
});

describe('scoreFromUserHistory', () => {
  it('returns null when no matching merchant history', () => {
    expect(
      scoreFromUserHistory('New Shop', [{ merchant: 'Other', categorySlug: 'fuel' }])
    ).toBeNull();
  });
});

describe('category suggestion helpers', () => {
  it('shows alternatives below confidence threshold', () => {
    const result = buildCategorySuggestion({ merchant: 'Unknown Vendor XYZ' });
    expect(shouldShowCategoryAlternatives(result)).toBe(true);
  });

  it('formats a user-facing message', () => {
    const result = buildCategorySuggestion({ merchant: 'Shell' });
    expect(formatCategorySuggestionMessage(result)).toContain('Fuel');
  });
});
