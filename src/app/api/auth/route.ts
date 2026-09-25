import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setSession, clearSession, getSession } from '@/lib/auth';
import {
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  getLoginLockoutMs,
  recordFailedLogin,
  clearFailedLogins,
} from '@/lib/login-rate-limit';

function lockoutResponse(remainingMs: number) {
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.ceil((remainingMs % 60000) / 1000);
  const display = seconds === 60
    ? `${minutes + 1} minute${minutes + 1 > 1 ? 's' : ''}`
    : minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds} second${seconds === 1 ? '' : 's'}`;
  return NextResponse.json(
    {
      error: `Too many failed login attempts. Please wait ${display} before trying again.`,
      retryAfterSeconds: Math.ceil(remainingMs / 1000),
    },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(remainingMs / 1000)) },
    }
  );
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Brute-force guard: after MAX_FAILED_ATTEMPTS failed attempts the email is
  // locked out for LOCKOUT_DURATION_MS. Checked before any DB work.
  const lockedMs = getLoginLockoutMs(email);
  if (lockedMs > 0) {
    return lockoutResponse(lockedMs);
  }

  let user: Awaited<ReturnType<typeof authenticateUser>>;
  try {
    user = await authenticateUser(email, password);
  } catch (err) {
    // DB unreachable/unseeded — this is a server problem, not bad credentials.
    // Failed-attempt counters are not touched by server errors.
    console.error('[api/auth] login failed (database error):', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Server database unavailable. Please try again shortly.' },
      { status: 503 }
    );
  }
  if (!user) {
    const remaining = recordFailedLogin(email);
    if (remaining <= 0) {
      return lockoutResponse(LOCKOUT_DURATION_MS);
    }
    return NextResponse.json(
      {
        error:
          remaining === 1
            ? 'Invalid email or password. You have 1 attempt remaining before a 3-minute lockout.'
            : `Invalid email or password. You have ${remaining} attempts remaining before a ${Math.round(LOCKOUT_DURATION_MS / 60000)}-minute lockout.`,
        attemptsRemaining: remaining,
      },
      { status: 401 }
    );
  }

  // Successful login clears the failure counter.
  clearFailedLogins(email);

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
