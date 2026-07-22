import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Complaint } from '@/lib/types';

export async function GET() {
  const complaints = await readData<Complaint>('complaints.json');
  return NextResponse.json(complaints);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const complaint: Complaint = {
    id: generateId(),
    memberId: user.memberId || user.id,
    title: body.title,
    description: body.description,
    category: body.category || 'general',
    status: 'open',
    response: null,
    respondedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const complaints = await readData<Complaint>('complaints.json');
  complaints.push(complaint);
  await writeData('complaints.json', complaints);

  return NextResponse.json(complaint, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const body = await request.json();
  const complaints = await readData<Complaint>('complaints.json');
  const index = complaints.findIndex((c) => c.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  complaints[index] = {
    ...complaints[index],
    status: body.status || complaints[index].status,
    response: body.response || complaints[index].response,
    respondedBy: user.id,
    updatedAt: new Date().toISOString(),
  };

  await writeData('complaints.json', complaints);
  return NextResponse.json(complaints[index]);
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const complaints = await readData<Complaint>('complaints.json');
  await writeData('complaints.json', complaints.filter((c) => c.id !== id));

  return NextResponse.json({ success: true });
}
