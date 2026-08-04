import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { hashPassword } from '@/lib/auth';
import { verifyOtp } from '@/lib/otp';
import type { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  const { email, code, newPassword } = await request.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json(
      { error: 'Email, code and new password are required' },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const valid = await verifyOtp(email, code, 'reset');
  if (!valid) {
    return NextResponse.json(
      { error: 'Invalid or expired verification code' },
      { status: 400 }
    );
  }

  const users = await readData<User>('users.json');
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) {
    return NextResponse.json({ error: 'No account found' }, { status: 404 });
  }

  users[index] = { ...users[index], passwordHash: await hashPassword(newPassword) };
  await writeData('users.json', users);

  return NextResponse.json({ success: true, message: 'Password updated. You can now sign in.' });
}
