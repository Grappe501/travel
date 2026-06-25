'use client';

import { useState } from 'react';
import { BusinessForm } from '@/components/businesses/BusinessManager';
import { navigateAfterAuth } from '@/lib/auth/navigate-after-auth';
import { MileageSettingsForm } from '@/components/settings/MileageSettingsForm';
import { VehicleForm } from '@/components/vehicles/VehicleManager';
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import type { MileageSettings, OnboardingStep, SerializedBusiness } from '@/lib/types/core';

type OnboardingWizardProps = {
  initialStep: OnboardingStep;
  businesses: SerializedBusiness[];
  mileageSettings: MileageSettings;
};

const STEPS: { id: OnboardingStep; label: string; title: string; description: string }[] = [
  {
    id: 'business',
    label: 'Business',
    title: 'Create your business',
    description: 'Add the business you track mileage and expenses for.',
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    title: 'Add a vehicle',
    description: 'Pick a nickname for the car or truck you drive for work.',
  },
  {
    id: 'rate',
    label: 'Mileage rate',
    title: 'Set your mileage rate',
    description: 'IRS standard is pre-selected — change it anytime in settings.',
  },
];

function stepIndex(step: OnboardingStep) {
  if (step === 'complete') return STEPS.length;
  return STEPS.findIndex((s) => s.id === step);
}

export function OnboardingWizard({
  initialStep,
  businesses: initialBusinesses,
  mileageSettings,
}: OnboardingWizardProps) {
  const [step, setStep] = useState<OnboardingStep>(
    initialStep === 'complete' ? 'rate' : initialStep
  );
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [error, setError] = useState<string | null>(null);
  const [skipping, setSkipping] = useState(false);

  const currentIndex = stepIndex(step);
  const currentMeta = STEPS[currentIndex] ?? STEPS[0];

  async function refreshBusinesses() {
    const response = await fetch('/api/businesses');
    const result = await response.json();
    if (response.ok) {
      setBusinesses(result.data ?? []);
    }
  }

  async function finishOnboarding() {
    const response = await fetch('/api/onboarding/complete', { method: 'POST' });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not finish onboarding');
      return false;
    }
    navigateAfterAuth('/dashboard');
    return true;
  }

  async function handleSkip() {
    setError(null);
    setSkipping(true);
    const response = await fetch('/api/onboarding/skip', { method: 'POST' });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not skip onboarding');
      setSkipping(false);
      return;
    }
    navigateAfterAuth('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {STEPS.map((item, index) => (
          <div key={item.id} className="flex flex-1 items-center gap-2">
            <Badge variant={index <= currentIndex ? 'primary' : 'default'}>{index + 1}</Badge>
            <span className="hidden text-caption text-muted sm:inline">{item.label}</span>
            {index < STEPS.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
          </div>
        ))}
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>{currentMeta.title}</CardTitle>
          <CardDescription>{currentMeta.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {step === 'business' ? (
            <BusinessForm
              onSuccess={async () => {
                await refreshBusinesses();
                setStep('vehicle');
              }}
            />
          ) : null}

          {step === 'vehicle' ? (
            <VehicleForm
              businesses={businesses}
              onSuccess={() => setStep('rate')}
            />
          ) : null}

          {step === 'rate' ? (
            <div className="space-y-4">
              <MileageSettingsForm settings={mileageSettings} />
              <Button
                type="button"
                fullWidth
                onClick={async () => {
                  await finishOnboarding();
                }}
              >
                Finish setup
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button type="button" variant="ghost" size="sm" onClick={handleSkip} disabled={skipping}>
          {skipping ? 'Skipping…' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}
