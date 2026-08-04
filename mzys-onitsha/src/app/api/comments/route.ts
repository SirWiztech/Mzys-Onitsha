import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Comment, Member } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const comments = await readData<Comment>('comments.json');
  const members = await readData<Member>('members.json');

  let filtered = productId
    ? comments.filter((c) => c.productId === productId)
    : comments;

  const enriched = filtered.map((c) => {
    const member = members.find((m) => m.id === c.memberId);
    return {
      ...c,
      memberName: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
      memberImage: member?.profileImage || null,
    };
  });

  return NextResponse.json(
    enriched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  );
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, body } = await request.json();
  if (!productId || !body) {
    return NextResponse.json({ error: 'productId and body are required' }, { status: 400 });
  }

  const comment: Comment = {
    id: generateId(),
    productId,
    memberId: user.memberId,
    body,
    createdAt: new Date().toISOString(),
  };

  const comments = await readData<Comment>('comments.json');
  comments.push(comment);
  await writeData('comments.json', comments);

  const members = await readData<Member>('members.json');
  const member = members.find((m) => m.id === user.memberId);

  return NextResponse.json({
    ...comment,
    memberName: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
    memberImage: member?.profileImage || null,
  }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const comments = await readData<Comment>('comments.json');
  const comment = comments.find((c) => c.id === id);
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (comment.memberId !== user.memberId && user.role === 'member') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await writeData('comments.json', comments.filter((c) => c.id !== id));
  return NextResponse.json({ success: true });
}
