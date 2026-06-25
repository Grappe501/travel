import { redirect } from 'next/navigation';
import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel';
import { ShellPage } from '@/components/layout/ShellPage';
import { requireAuthenticatedUser } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

export default async function VerifyEmailPage() {
  const { user } = await requireAuthenticatedUser({ allowUnverifiedEmail: true });

  if (user.email_confirmed_at) {
    redirect('/auth/continue');
  }

  return (
    <ShellPage title="Verify your email" description="One more step before you can use the app.">
      <VerifyEmailPanel email={user.email ?? ''} />
    </ShellPage>
  );
}
