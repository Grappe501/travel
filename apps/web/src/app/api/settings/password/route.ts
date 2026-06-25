import { changePasswordSchema } from '@mileage-copilot/shared';
import { NextResponse } from 'next/server';
import { jsonData, jsonError } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.currentPassword,
    });

    if (verifyError) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.newPassword,
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return jsonData({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
