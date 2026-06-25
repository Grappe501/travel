import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@mileage-copilot/shared';
import { env } from '@/lib/env';

export default function HomePage() {
  const appName = env.NEXT_PUBLIC_APP_NAME || APP_NAME;
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">V1 scaffold</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{appName}</h1>
      <p className="mt-3 text-slate-600">{APP_TAGLINE}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Dashboard
        </Link>
        <Link
          href="/health"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Health
        </Link>
      </div>
    </main>
  );
}
