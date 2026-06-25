import { prisma } from '@/lib/db/prisma';
import type { OnboardingStatus, OnboardingStep } from '@/lib/types/core';

const active = { recordStatus: 'active' as const };

export async function getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  const [profile, businessCount, vehicleCount] = await Promise.all([
    prisma.userProfile.findUnique({ where: { id: userId } }),
    prisma.business.count({ where: { userId, ...active } }),
    prisma.vehicle.count({ where: { userId, ...active } }),
  ]);

  const hasBusiness = businessCount > 0;
  const hasVehicle = vehicleCount > 0;
  const onboardingCompleted = profile?.onboardingCompleted ?? false;

  let currentStep: OnboardingStep = 'complete';
  if (!onboardingCompleted) {
    if (!hasBusiness) {
      currentStep = 'business';
    } else if (!hasVehicle) {
      currentStep = 'vehicle';
    } else {
      currentStep = 'rate';
    }
  }

  return {
    onboardingCompleted,
    hasBusiness,
    hasVehicle,
    needsOnboarding: !onboardingCompleted,
    currentStep,
  };
}

export async function markOnboardingComplete(userId: string) {
  return prisma.userProfile.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });
}

export async function skipOnboarding(userId: string) {
  return markOnboardingComplete(userId);
}
