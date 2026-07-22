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

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  await setSession(user.id);

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, role: user.role },
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
    user: { id: user.id, email: user.email, role: user.role },
  });
}
