import type { ReactNode } from 'react';

type ShellPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ShellPage({ title, description, children }: ShellPageProps) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </main>
  );
}
