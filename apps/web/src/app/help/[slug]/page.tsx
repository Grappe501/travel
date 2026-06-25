import { notFound } from 'next/navigation';
import { ShellPage } from '@/components/layout/ShellPage';
import { HelpArticleBody, HelpFooter } from '@/components/help/HelpArticle';
import { getHelpArticle, HELP_SLUGS } from '@/lib/help/articles';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return HELP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) {
    return { title: 'Help article' };
  }
  return {
    title: `${article.title} — Help`,
    description: article.summary,
  };
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getHelpArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <ShellPage title={article.title} description={article.summary} eyebrow="Help Center">
      <HelpArticleBody article={article} />
      <HelpFooter />
    </ShellPage>
  );
}
