import { ShellPage } from '@/components/layout/ShellPage';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <ShellPage title="Forgot password" description="Reset your Mileage & Expense Copilot password.">
      <ForgotPasswordForm />
    </ShellPage>
  );
}
