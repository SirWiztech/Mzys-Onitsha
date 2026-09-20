import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSession, clearSession, getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  let user: Awaited<ReturnType<typeof authenticateUser>>;
  try {
    user = await authenticateUser(email, password);
  } catch (err) {
    // DB unreachable/unseeded — this is a server problem, not bad credentials.
    console.error('[api/auth] login failed (database error):', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Server database unavailable. Please try again shortly.' },
      { status: 503 }
    );
  }
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  await setSession(user.id);

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, role: user.role, memberId: user.memberId },
  });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role, memberId: user.memberId },
  });
}
