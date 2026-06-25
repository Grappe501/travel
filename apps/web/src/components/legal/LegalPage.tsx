import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShellPage } from '@/components/layout/ShellPage';

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <ShellPage title={title}>
      <article className="prose-legal space-y-4 text-body text-foreground">{children}</article>
      <LegalFooter />
    </ShellPage>
  );
}

export function LegalFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-6 text-caption text-muted">
      <nav className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/legal/privacy" className="hover:text-foreground hover:underline">
          Privacy
        </Link>
        <Link href="/legal/terms" className="hover:text-foreground hover:underline">
          Terms
        </Link>
        <Link href="/legal/refunds" className="hover:text-foreground hover:underline">
          Refunds
        </Link>
        <Link href="/help" className="hover:text-foreground hover:underline">
          Help
        </Link>
        <Link href="/login" className="hover:text-foreground hover:underline">
          Log in
        </Link>
      </nav>
      <p className="mt-3">
        Mileage &amp; Expense Copilot helps organize travel and expense records. It does not provide
        tax, legal, or accounting advice.
      </p>
    </footer>
  );
}
