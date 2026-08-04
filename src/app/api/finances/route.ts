import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession, isAdmin } from '@/lib/auth';
import type { FinanceRecord } from '@/lib/types';

export async function GET() {
  const records = await readData<FinanceRecord>('finances.json');
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const userIsAdmin = isAdmin(user.role);

  // Members can only submit dues with a receipt; admins can submit any record
  if (!userIsAdmin && body.type !== 'dues') {
    return NextResponse.json({ error: 'Members can only submit dues' }, { status: 403 });
  }
  if (!userIsAdmin && !body.receipt) {
    return NextResponse.json({ error: 'Receipt is required for member submissions' }, { status: 400 });
  }

  const record: FinanceRecord = {
    id: generateId(),
    memberId: body.memberId || user.memberId!,
    branchId: body.branchId,
    type: body.type || 'dues',
    amount: Number(body.amount),
    description: body.description || '',
    date: body.date || new Date().toISOString(),
    recordedBy: user.id,
    receipt: body.receipt || undefined,
    status: userIsAdmin ? 'approved' : 'pending',
  };

  const records = await readData<FinanceRecord>('finances.json');
  records.push(record);
  await writeData('finances.json', records);

  return NextResponse.json(record, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const { id, memberId, branchId, type, amount, description, status } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const records = await readData<FinanceRecord>('finances.json');
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  records[index] = {
    ...records[index],
    memberId: memberId ?? records[index].memberId,
    branchId: branchId ?? records[index].branchId,
    type: type ?? records[index].type,
    amount: amount !== undefined ? Number(amount) : records[index].amount,
    description: description ?? records[index].description,
    status: status ?? records[index].status,
  };

  await writeData('finances.json', records);
  return NextResponse.json(records[index]);
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const records = await readData<FinanceRecord>('finances.json');
  await writeData('finances.json', records.filter((r) => r.id !== id));
  return NextResponse.json({ success: true });
}
