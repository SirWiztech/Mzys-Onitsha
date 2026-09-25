import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type { Program, ProgramCategory } from '@/lib/types';

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCategory(value: unknown): ProgramCategory {
  return value === 'district' ? 'district' : 'provincial';
}

function normalizeSn(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 999;
}

function requireSuperadmin() {
  return getSession().then((user) => (user && isAdmin(user.role) && user.role === 'superadmin' ? user : null));
}

export async function GET() {
  const programs = await readData<Program>('programs.json');
  const sorted = [...programs].sort((a, b) => {
    if (a.category !== b.category) return a.category === 'provincial' ? -1 : 1;
    return a.sn - b.sn;
  });
  return NextResponse.json(sorted);
}

export async function POST(request: NextRequest) {
  const user = await requireSuperadmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const eventType = str(body.eventType);
  if (!eventType) {
    return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
  }

  const program: Program = {
    id: generateId(),
    category: normalizeCategory(body.category),
    sn: normalizeSn(body.sn),
    eventType,
    date: str(body.date),
    theme: str(body.theme),
    topic: str(body.topic),
    venue: str(body.venue),
    time: str(body.time),
  };

  const programs = await readData<Program>('programs.json');
  programs.push(program);
  await writeData('programs.json', programs);

  return NextResponse.json(program, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const user = await requireSuperadmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const id = str(body.id);
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }
  if (body.eventType !== undefined && !str(body.eventType)) {
    return NextResponse.json({ error: 'Event type cannot be empty' }, { status: 400 });
  }

  const programs = await readData<Program>('programs.json');
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  const current = programs[index];
  const updated: Program = {
    ...current,
    category: body.category !== undefined ? normalizeCategory(body.category) : current.category,
    sn: body.sn !== undefined ? normalizeSn(body.sn) : current.sn,
    eventType: body.eventType !== undefined ? str(body.eventType) : current.eventType,
    date: body.date !== undefined ? str(body.date) : current.date,
    theme: body.theme !== undefined ? str(body.theme) : current.theme,
    topic: body.topic !== undefined ? str(body.topic) : current.topic,
    venue: body.venue !== undefined ? str(body.venue) : current.venue,
    time: body.time !== undefined ? str(body.time) : current.time,
  };
  programs[index] = updated;
  await writeData('programs.json', programs);

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const user = await requireSuperadmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const programs = await readData<Program>('programs.json');
  await writeData('programs.json', programs.filter((p) => p.id !== id));

  return NextResponse.json({ success: true });
}
