import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ShellPage } from '@/components/layout/ShellPage';
import { requireOnboardingAccess } from '@/lib/auth/guards';
import * as businessService from '@/server/services/business.service';
import * as mileageService from '@/server/services/mileage.service';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const { user, onboarding } = await requireOnboardingAccess();
  const [businesses, mileageSettings] = await Promise.all([
    businessService.listBusinesses(user.id),
    mileageService.getMileageSettings(user.id),
  ]);

  return (
    <ShellPage
      title="Welcome"
      description="Set up your workspace in a few quick steps."
      className="max-w-2xl"
    >
      <OnboardingWizard
        initialStep={onboarding.currentStep}
        businesses={businesses}
        mileageSettings={mileageSettings}
      />
    </ShellPage>
  );
}
