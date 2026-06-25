import { signOut } from '@/lib/auth/actions';
import { Button } from '@/components/ui';

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary" size="sm">
        Log out
      </Button>
    </form>
  );
}
