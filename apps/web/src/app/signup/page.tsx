import { redirect } from 'next/navigation';
import { AuthSetupAlert } from '@/components/auth/AuthSetupAlert';
import { ShellPage } from '@/components/layout/ShellPage';
import { SignupForm } from '@/components/auth/SignupForm';
import { isBetaModeEnabled } from '@/lib/auth/beta';

export default function SignupPage() {
  if (isBetaModeEnabled()) {
    redirect('/beta/login');
  }

  return (
    <ShellPage
      title="Sign up"
      description="Create your Mileage & Expense Copilot account."
      eyebrow="Get started"
      auth
    >
      <AuthSetupAlert />
      <SignupForm />
    </ShellPage>
  );
}
