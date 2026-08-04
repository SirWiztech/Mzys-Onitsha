import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type { Branch } from '@/lib/types';

export async function GET() {
  const branches = await readData<Branch>('branches.json');
  return NextResponse.json(branches);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const branch: Branch = {
    id: generateId(),
    name: body.name,
    location: body.location || '',
    leaderName: body.leaderName || '',
    leaderPhone: body.leaderPhone || '',
    createdAt: new Date().toISOString(),
  };

  const branches = await readData<Branch>('branches.json');
  branches.push(branch);
  await writeData('branches.json', branches);

  return NextResponse.json(branch, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const branches = await readData<Branch>('branches.json');
  const filtered = branches.filter((b) => b.id !== id);
  await writeData('branches.json', filtered);

  return NextResponse.json({ success: true });
}
