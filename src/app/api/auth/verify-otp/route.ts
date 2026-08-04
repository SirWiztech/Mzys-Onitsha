import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { hashPassword } from '@/lib/auth';
import { verifyOtp } from '@/lib/otp';
import type { User, Member } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, code, firstName, lastName, phone, password, dateOfBirth, gender, branchId, cherubSeraph, occupation, address } = body;

  if (!email || !code) {
    return NextResponse.json(
      { error: 'Email and verification code are required' },
      { status: 400 }
    );
  }

  const valid = await verifyOtp(email, code, 'register');
  if (!valid) {
    return NextResponse.json(
      { error: 'Invalid or expired verification code' },
      { status: 400 }
    );
  }

  if (!firstName || !lastName || !password || !gender || !branchId) {
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

  const memberId = generateId();
  const userId = generateId();
  const passwordHash = await hashPassword(password);

  const member: Member = {
    id: memberId,
    firstName,
    lastName,
    email,
    phone: phone || '',
    dateOfBirth: dateOfBirth || '',
    gender: gender as 'male' | 'female',
    branchId,
    cherubSeraph: (cherubSeraph as 'cherub' | 'seraph') || null,
    occupation: occupation || '',
    address: address || '',
    status: 'active',
    registrationDate: new Date().toISOString(),
    profileImage: null,
  };

  const user: User = {
    id: userId,
    email,
    passwordHash,
    role: 'member',
    memberId,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const members = await readData<Member>('members.json');
  members.push(member);
  await writeData('members.json', members);

  users.push(user);
  await writeData('users.json', users);

  return NextResponse.json({ success: true }, { status: 201 });
}
