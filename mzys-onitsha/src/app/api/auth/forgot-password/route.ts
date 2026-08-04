import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mail';
import type { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const users = await readData<User>('users.json');
  if (!users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { error: 'No account found with that email' },
      { status: 404 }
    );
  }

  const code = await createOtp(email, 'reset');
  const sent = await sendOtpEmail(email, code, 'reset');

  if (!sent) {
    return NextResponse.json(
      { error: 'We could not send the password reset email. Please check your internet connection and try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'A password reset code has been sent to your email.',
  });
}
