import { prisma } from '@/lib/db/prisma';
import { ensureSubscription } from '@/lib/billing/subscription-access';

type AuthUser = {
  id: string;
  email: string;
  emailVerified?: boolean;
};

/**
 * Ensures a UserProfile row exists for the authenticated Supabase user.
 * Called after login/signup and on protected page loads.
 */
export async function ensureUserProfile(user: AuthUser) {
  const emailVerified = user.emailVerified ?? false;

  const profile = await prisma.userProfile.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      emailVerified,
      lastLoginAt: new Date(),
    },
    update: {
      email: user.email,
      emailVerified,
      lastLoginAt: new Date(),
    },
  });

  await ensureSubscription(user.id);

  return profile;
}

export async function getUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { id: userId },
  });
}
