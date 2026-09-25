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
  // profileImage is stored as a base64 data URI and can be hundreds of KB per
  // member. It is stripped from the bulk payload — pages that need the current
  // user's image use /api/members/me instead.
  const enriched = members.map((m) => {
    const { profileImage, ...rest } = m;
    return {
      ...rest,
      profileImage: null as string | null,
      role: m.role || roleByMember.get(m.id) || ('member' as UserRole),
    };
  });
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

  const allowed = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'occupation', 'address', 'profileImage', 'cherubSeraph', 'branchId'] as const;
  const updated = { ...members[index] };
  for (const key of allowed) {
    if (body[key] !== undefined) {
      (updated as Record<string, unknown>)[key] = body[key];
    }
  }

  // Branch changes are validated server-side so members can only move to a
  // branch that actually exists.
  if (body.branchId !== undefined) {
    if (typeof body.branchId !== 'string') {
      return NextResponse.json({ error: 'Invalid branch' }, { status: 400 });
    }
    const branches = await readData<{ id: string }>('branches.json');
    if (body.branchId !== '' && !branches.some((b) => b.id === body.branchId)) {
      return NextResponse.json({ error: 'Selected branch does not exist' }, { status: 400 });
    }
  }

  members[index] = updated as Member;

  await writeData('members.json', members);
  return NextResponse.json(members[index]);
}
