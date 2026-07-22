import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { MZYSEvent } from '@/lib/types';

export async function GET() {
  const events = await readData<MZYSEvent>('events.json');
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const event: MZYSEvent = {
    id: generateId(),
    title: body.title,
    description: body.description || '',
    date: body.date,
    endDate: body.endDate || null,
    location: body.location || '',
    type: body.type || 'other',
    createdBy: user.id,
  };

  const events = await readData<MZYSEvent>('events.json');
  events.push(event);
  await writeData('events.json', events);

  return NextResponse.json(event, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const events = await readData<MZYSEvent>('events.json');
  await writeData('events.json', events.filter((e) => e.id !== id));

  return NextResponse.json({ success: true });
}
