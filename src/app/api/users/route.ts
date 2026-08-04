import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type {
  User,
  Member,
  Product,
  Comment,
  Like,
  Complaint,
  FinanceRecord,
  Leadership,
  MZYSEvent,
  Notification,
} from '@/lib/types';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const users = await readData<User>('users.json');
  const safe = users.map(({ passwordHash, ...rest }) => rest);
  return NextResponse.json(safe);
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, status, role } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  if (userId === user.id) {
    return NextResponse.json({ error: 'Cannot modify yourself' }, { status: 400 });
  }

  const users = await readData<User>('users.json');
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (status && ['active', 'blocked'].includes(status)) {
    users[index] = { ...users[index], status: status as 'active' | 'blocked' };
  }

  if (role && ['member', 'exco', 'superadmin'].includes(role)) {
    users[index] = { ...users[index], role: role as 'member' | 'exco' | 'superadmin' };
  }

  await writeData('users.json', users);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }
  if (userId === user.id) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  const users = await readData<User>('users.json');
  const target = users.find((u) => u.id === userId);
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await writeData('users.json', users.filter((u) => u.id !== userId));

  const memberId = target.memberId;
  if (memberId) {
    const members = await readData<Member>('members.json');
    await writeData('members.json', members.filter((m) => m.id !== memberId));

    const filterByMember = async <T extends { memberId: string }>(
      filename: string
    ) => {
      const rows = await readData<T>(filename);
      const filtered = rows.filter((r) => r.memberId !== memberId);
      if (filtered.length !== rows.length) {
        await writeData(filename, filtered);
      }
    };

    await Promise.all([
      filterByMember<Product>('products.json'),
      filterByMember<Comment>('comments.json'),
      filterByMember<Like>('likes.json'),
      filterByMember<Complaint>('complaints.json'),
      filterByMember<FinanceRecord>('finances.json'),
      filterByMember<Leadership>('leadership.json'),
    ]);
  }

  const events = await readData<MZYSEvent>('events.json');
  if (events.some((e) => e.createdBy === userId)) {
    await writeData('events.json', events.filter((e) => e.createdBy !== userId));
  }

  const notifications = await readData<Notification>('notifications.json');
  if (notifications.some((n) => n.createdBy === userId)) {
    await writeData('notifications.json', notifications.filter((n) => n.createdBy !== userId));
  }

  return NextResponse.json({ success: true });
}
