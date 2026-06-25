import { ShellPage } from '@/components/layout/ShellPage';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <ShellPage title="Reset password" description="Choose a new password for your account.">
      <ResetPasswordForm />
    </ShellPage>
  );
}
