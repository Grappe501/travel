import type { ReactNode } from 'react';
import { forbidden, redirect } from 'next/navigation';
import { isAdminUser } from '@/lib/auth/admin';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }
  if (!isAdminUser(user)) {
    forbidden();
  }

  return children;
}
