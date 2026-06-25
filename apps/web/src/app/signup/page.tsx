import { AuthSetupAlert } from '@/components/auth/AuthSetupAlert';
import { ShellPage } from '@/components/layout/ShellPage';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
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
