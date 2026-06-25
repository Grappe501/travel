import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { InstallAppPrompt } from '@/components/pwa/InstallAppPrompt';
import { ButtonLink, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { requireSessionUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function InstallAppPage() {
  const user = await requireSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardShell
      title="Install app"
      description="Add Mileage & Expense Copilot to your home screen for offline field use."
      eyebrow="Mobile"
      actions={
        <ButtonLink href="/settings" variant="secondary" size="sm">
          All settings
        </ButtonLink>
      }
    >
      <InstallAppPrompt variant="inline" />

      <Card>
        <CardHeader>
          <CardTitle>Works offline</CardTitle>
          <CardDescription>What you can do without a connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0 text-body text-muted">
          <p>Start and end trips — stored locally until sync</p>
          <p>Queue receipt uploads and expenses</p>
          <p>View pages you&apos;ve opened recently</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Android / Chrome</CardTitle>
          <CardDescription>Tap Install app above when prompted, or use the browser menu.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>iPhone / iPad</CardTitle>
          <CardDescription>Safari → Share → Add to Home Screen</CardDescription>
        </CardHeader>
      </Card>
    </DashboardShell>
  );
}
