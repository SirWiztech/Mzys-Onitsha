import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type { Leadership } from '@/lib/types';

export async function GET() {
  const leaders = await readData<Leadership>('leadership.json');
  return NextResponse.json(leaders);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const leader: Leadership = {
    id: generateId(),
    memberId: body.memberId,
    position: body.position,
    level: body.level || 'branch',
    branchId: body.branchId || null,
    responsibilities: body.responsibilities || '',
    startDate: new Date().toISOString(),
  };

  const leaders = await readData<Leadership>('leadership.json');
  leaders.push(leader);
  await writeData('leadership.json', leaders);

  return NextResponse.json(leader, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const leaders = await readData<Leadership>('leadership.json');
  await writeData('leadership.json', leaders.filter((l) => l.id !== id));

  return NextResponse.json({ success: true });
}
