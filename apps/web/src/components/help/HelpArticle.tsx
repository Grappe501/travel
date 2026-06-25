import Link from 'next/link';
import type { HelpArticle } from '@/lib/help/articles';

export function HelpArticleBody({ article }: { article: HelpArticle }) {
  return (
    <article className="space-y-6">
      <header className="space-y-2 border-b border-border pb-4">
        <p className="text-caption font-medium uppercase tracking-wide text-primary">{article.category}</p>
        <h1 className="text-page-title">{article.title}</h1>
        <p className="text-body text-muted">{article.summary}</p>
      </header>

      {article.sections.map((section, index) => (
        <section key={index} className="space-y-3">
          {section.heading ? <h2 className="text-section-title">{section.heading}</h2> : null}
          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="text-body text-muted">
              {paragraph}
            </p>
          ))}
          {section.list?.length ? (
            <ul className="list-inside list-disc space-y-1 text-body text-muted">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </article>
  );
}

export function HelpFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-6 text-caption text-muted">
      <nav className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/help" className="hover:text-foreground hover:underline">
          All articles
        </Link>
        <Link href="/legal/privacy" className="hover:text-foreground hover:underline">
          Privacy
        </Link>
        <Link href="/legal/terms" className="hover:text-foreground hover:underline">
          Terms
        </Link>
        <Link href="/login" className="hover:text-foreground hover:underline">
          Log in
        </Link>
      </nav>
      <p className="mt-3">
        Still stuck? Contact your field test coordinator or support for your deployment.
      </p>
    </footer>
  );
}
