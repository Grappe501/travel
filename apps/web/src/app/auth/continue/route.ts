import { redirect } from 'next/navigation';
import { resolvePostAuthPath } from '@/lib/auth/guards';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect');
  const destination = await resolvePostAuthPath(redirectTo);
  redirect(destination);
}
