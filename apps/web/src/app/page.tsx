import { APP_NAME, APP_TAGLINE } from '@mileage-copilot/shared';
import { InstallAppPrompt } from '@/components/pwa/InstallAppPrompt';
import { ButtonLink } from '@/components/ui';
import { APP_RELEASE } from '@/lib/app-release';
import { env } from '@/lib/env';

export default function HomePage() {
  const appName = env.NEXT_PUBLIC_APP_NAME || APP_NAME;

  return (
    <main className="app-shell-bg flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 md:px-6">
        <p className="animate-fade-in text-micro font-semibold uppercase tracking-wider text-primary">
          v{APP_RELEASE.version}
        </p>
        <h1 className="animate-fade-in mt-3 text-display text-foreground">{appName}</h1>
        <p className="animate-fade-in mt-4 text-body-lg text-muted">{APP_TAGLINE}</p>

        <ul className="animate-fade-in mt-8 space-y-3 text-body text-muted">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm">
              📲
            </span>
            Install on your phone — works offline, syncs when connected
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm">
              🚗
            </span>
            Log trips and mileage with one tap
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm">
              📄
            </span>
            Scan receipts and let AI categorize expenses
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm">
              📊
            </span>
            Export tax-ready reports when you need them
          </li>
        </ul>

        <div className="animate-fade-in mt-8">
          <InstallAppPrompt variant="banner" />
        </div>

        <div className="animate-fade-in mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/login" size="lg">
            Log in
          </ButtonLink>
          <ButtonLink href="/signup" variant="secondary" size="lg">
            Sign up
          </ButtonLink>
        </div>
        <p className="animate-fade-in mt-6 text-caption text-muted">
          Already exploring?{' '}
          <a href="/health" className="font-medium text-primary hover:underline">
            Check system health
          </a>
        </p>
      </div>
    </main>
  );
}
