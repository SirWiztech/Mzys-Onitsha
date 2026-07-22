import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { FinanceRecord } from '@/lib/types';

export async function GET() {
  const records = await readData<FinanceRecord>('finances.json');
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json();
  const record: FinanceRecord = {
    id: generateId(),
    memberId: body.memberId,
    branchId: body.branchId,
    type: body.type,
    amount: body.amount,
    description: body.description || '',
    date: new Date().toISOString(),
    recordedBy: user.id,
  };

  const records = await readData<FinanceRecord>('finances.json');
  records.push(record);
  await writeData('finances.json', records);

  return NextResponse.json(record, { status: 201 });
}
