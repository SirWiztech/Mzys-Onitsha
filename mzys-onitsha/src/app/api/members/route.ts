import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import type { Member } from '@/lib/types';

export async function GET() {
  const members = await readData<Member>('members.json');
  return NextResponse.json(members);
}
