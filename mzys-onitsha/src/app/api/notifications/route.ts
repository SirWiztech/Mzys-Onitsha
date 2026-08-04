import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type { Notification } from '@/lib/types';

export async function GET() {
  const notifications = await readData<Notification>('notifications.json');
  return NextResponse.json(notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { title, body } = await request.json();
  if (!title || !body) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }

  const notification: Notification = {
    id: generateId(),
    title,
    body,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
  };

  const notifications = await readData<Notification>('notifications.json');
  notifications.push(notification);
  await writeData('notifications.json', notifications);

  return NextResponse.json(notification, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const notifications = await readData<Notification>('notifications.json');
  await writeData('notifications.json', notifications.filter((n) => n.id !== id));
  return NextResponse.json({ success: true });
}
