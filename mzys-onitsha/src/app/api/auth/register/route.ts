import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { hashPassword } from '@/lib/auth';
import type { User, Member } from '@/lib/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    firstName, lastName, email, phone, password,
    dateOfBirth, gender, branchId, cherubSeraph, occupation, address,
  } = body;

  if (!firstName || !lastName || !email || !password || !gender || !branchId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const users = await readData<User>('users.json');
  if (users.find((u) => u.email === email)) {
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
    createdAt: new Date().toISOString(),
  };

  const members = await readData<Member>('members.json');
  members.push(member);
  await writeData('members.json', members);

  users.push(user);
  await writeData('users.json', users);

  return NextResponse.json({ success: true }, { status: 201 });
}
