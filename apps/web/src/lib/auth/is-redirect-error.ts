/** Re-throw Next.js redirect() from client-side server action handlers. */
export function isRedirectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) {
    return false;
  }

  const digest = String((error as { digest?: string }).digest ?? '');
  return digest.startsWith('NEXT_REDIRECT');
}
