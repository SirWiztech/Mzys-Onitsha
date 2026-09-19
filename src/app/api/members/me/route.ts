import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Member } from '@/lib/types';

// Returns the session user's full member record (including profileImage).
// The bulk /api/members endpoint omits profileImage to keep its payload small.
export async function GET() {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const members = await readData<Member>('members.json');
  const member = members.find((m) => m.id === user.memberId);
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  return NextResponse.json(member);
}
