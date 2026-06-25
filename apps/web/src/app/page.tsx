import { APP_NAME, APP_TAGLINE } from '@mileage-copilot/shared';
import { ButtonLink } from '@/components/ui';
import { env } from '@/lib/env';

export default function HomePage() {
  const appName = env.NEXT_PUBLIC_APP_NAME || APP_NAME;
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center bg-background px-4 py-16 md:px-6">
      <p className="text-micro font-medium uppercase tracking-wide text-primary">V1 scaffold</p>
      <h1 className="mt-2 text-display text-foreground">{appName}</h1>
      <p className="mt-3 text-body text-muted">{APP_TAGLINE}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/dashboard">Dashboard</ButtonLink>
        <ButtonLink href="/health" variant="secondary">
          Health
        </ButtonLink>
      </div>
    </main>
  );
}
