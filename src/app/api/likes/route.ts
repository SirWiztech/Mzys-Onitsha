import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Like } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const likes = await readData<Like>('likes.json');

  let filtered = productId
    ? likes.filter((l) => l.productId === productId)
    : likes;

  return NextResponse.json({
    likes: filtered,
    count: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const likes = await readData<Like>('likes.json');
  const existing = likes.find(
    (l) => l.productId === productId && l.memberId === user.memberId
  );

  if (existing) {
    await writeData('likes.json', likes.filter((l) => l.id !== existing.id));
    const remaining = likes.filter((l) => l.productId === productId && l.id !== existing.id);
    return NextResponse.json({ liked: false, count: remaining.length });
  }

  const like: Like = {
    id: generateId(),
    productId,
    memberId: user.memberId,
    createdAt: new Date().toISOString(),
  };

  likes.push(like);
  await writeData('likes.json', likes);

  const productLikes = likes.filter((l) => l.productId === productId);
  return NextResponse.json({ liked: true, count: productLikes.length }, { status: 201 });
}
