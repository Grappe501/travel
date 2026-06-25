import { ShellPage } from '@/components/layout/ShellPage';
import { HelpCenterSearch } from '@/components/help/HelpCenterSearch';
import { HelpFooter } from '@/components/help/HelpArticle';
import { HELP_ARTICLES } from '@/lib/help/articles';

export const metadata = {
  title: 'Help Center',
  description: 'Guides for trips, receipts, GPS tracking, reports, and field testing.',
};

export default function HelpCenterPage() {
  return (
    <ShellPage
      title="Help Center"
      description="Self-service guides for mileage, receipts, and reports."
      eyebrow="Support"
    >
      <HelpCenterSearch articles={HELP_ARTICLES} />
      <HelpFooter />
    </ShellPage>
  );
}
