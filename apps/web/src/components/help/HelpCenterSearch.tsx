'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { HelpArticle } from '@/lib/help/articles';
import { Input } from '@/components/ui';

type HelpCenterSearchProps = {
  articles: HelpArticle[];
};

export function HelpCenterSearch({ articles }: HelpCenterSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return articles;
    }

    return articles.filter((article) => {
      const haystack = [article.title, article.summary, article.category]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [articles, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, HelpArticle[]>();
    for (const article of filtered) {
      const list = map.get(article.category) ?? [];
      list.push(article);
      map.set(article.category, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="space-y-6">
      <Input
        label="Search help"
        id="help-search"
        type="search"
        placeholder="Trips, receipts, GPS, billing…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-body text-muted">No articles match your search. Try a different keyword.</p>
      ) : (
        grouped.map(([category, categoryArticles]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-section-title">{category}</h2>
            <ul className="space-y-2">
              {categoryArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/help/${article.slug}`}
                    className="surface-card-interactive block p-4 focus-visible:outline-none"
                  >
                    <span className="block font-semibold text-foreground">{article.title}</span>
                    <span className="mt-1 block text-caption text-muted">{article.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
