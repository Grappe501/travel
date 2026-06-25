import { describe, expect, it } from 'vitest';
import { getHelpArticle, HELP_ARTICLES, HELP_SLUGS, searchHelpArticles } from '@/lib/help/articles';

describe('help articles', () => {
  it('includes eight launch articles', () => {
    expect(HELP_ARTICLES).toHaveLength(8);
    expect(HELP_SLUGS).toContain('getting-started');
    expect(HELP_SLUGS).toContain('field-test-faq');
  });

  it('resolves articles by slug', () => {
    const article = getHelpArticle('gps-tracking');
    expect(article?.title).toMatch(/GPS/i);
  });

  it('filters articles by search query', () => {
    const results = searchHelpArticles('receipt');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((article) => article.slug === 'scan-receipts')).toBe(true);
  });
});
