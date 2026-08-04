import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mail';
import type { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, phone, password, gender, branchId } = body;

  if (!firstName || !lastName || !email || !password || !gender || !branchId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const users = await readData<User>('users.json');
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 400 }
    );
  }

  const code = await createOtp(email, 'register');
  const sent = await sendOtpEmail(email, code, 'register');

  if (!sent) {
    return NextResponse.json(
      { error: 'We could not send the verification email. Please check your internet connection and try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'A verification code has been sent to your email.',
  });
}
