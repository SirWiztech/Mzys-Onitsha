import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Member, User, UserRole } from '@/lib/types';

export async function GET() {
  const [members, users] = await Promise.all([
    readData<Member>('members.json'),
    readData<User>('users.json'),
  ]);
  const roleByMember = new Map<string, UserRole>();
  for (const u of users) {
    if (u.memberId) roleByMember.set(u.memberId, u.role);
  }
  const enriched = members.map((m) => ({
    ...m,
    role: m.role || roleByMember.get(m.id) || ('member' as UserRole),
  }));
  return NextResponse.json(enriched);
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const members = await readData<Member>('members.json');
  const index = members.findIndex((m) => m.id === user.memberId);
  if (index === -1) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  const allowed = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'occupation', 'address', 'profileImage', 'cherubSeraph'] as const;
  const updated = { ...members[index] };
  for (const key of allowed) {
    if (body[key] !== undefined) {
      (updated as Record<string, unknown>)[key] = body[key];
    }
  }
  members[index] = updated as Member;

  await writeData('members.json', members);
  return NextResponse.json(members[index]);
}
