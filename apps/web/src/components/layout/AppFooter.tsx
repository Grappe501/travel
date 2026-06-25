import Link from 'next/link';

export function AppFooter() {
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
        <Link href="/billing" className="hover:text-foreground hover:underline">
          Billing
        </Link>
      </nav>
    </footer>
  );
}
