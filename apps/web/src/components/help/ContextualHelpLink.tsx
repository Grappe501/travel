import Link from 'next/link';

type ContextualHelpLinkProps = {
  href: string;
  label?: string;
};

export function ContextualHelpLink({ href, label = 'Help with this' }: ContextualHelpLinkProps) {
  return (
    <p className="text-caption text-muted">
      <Link href={href} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    </p>
  );
}
