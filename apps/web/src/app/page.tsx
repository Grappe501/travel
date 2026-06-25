import { APP_NAME, APP_TAGLINE } from '@mileage-copilot/shared';
import { InstallAppPrompt } from '@/components/pwa/InstallAppPrompt';
import { ButtonLink } from '@/components/ui';
import { APP_RELEASE } from '@/lib/app-release';
import { env } from '@/lib/env';

const FEATURES = [
  { icon: '📲', text: 'Install on your phone — works offline, syncs when connected' },
  { icon: '🛰️', text: 'GPS trip tracking while the app is open' },
  { icon: '🚗', text: 'Log trips and mileage with one tap' },
  { icon: '📄', text: 'Scan receipts and let AI categorize expenses' },
  { icon: '📊', text: 'Export tax-ready reports when you need them' },
] as const;

export default function HomePage() {
  const appName = env.NEXT_PUBLIC_APP_NAME || APP_NAME;

  return (
    <main className="app-shell-bg hero-mesh flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16 md:px-6">
        <div className="marketing-hero-card animate-slide-up">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" aria-hidden />

          <p className="text-micro font-semibold uppercase tracking-widest text-primary">
            v{APP_RELEASE.version}
          </p>
          <h1 className="mt-3 text-display text-foreground">{appName}</h1>
          <p className="mt-4 text-body-lg leading-relaxed text-muted">{APP_TAGLINE}</p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-body text-muted">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm ring-1 ring-primary/10">
                  {item.icon}
                </span>
                {item.text}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <InstallAppPrompt variant="banner" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/login" size="lg">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup" variant="secondary" size="lg">
              Sign up
            </ButtonLink>
          </div>
        </div>

        <p className="animate-fade-in mt-8 text-center text-caption text-muted">
          Already exploring?{' '}
          <a href="/health" className="font-medium text-primary hover:underline">
            Check system health
          </a>
        </p>
      </div>
    </main>
  );
}
