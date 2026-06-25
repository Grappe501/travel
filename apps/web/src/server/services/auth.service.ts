import { prisma } from '@/lib/db/prisma';

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

  return prisma.userProfile.upsert({
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
}

export async function getUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { id: userId },
  });
}
