import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/data';
import { getSession } from '@/lib/auth';
import type { Product } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  const products = await readData<Product>('products.json');
  if (memberId) return NextResponse.json(products.filter((p) => p.memberId === memberId));
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const product: Product = {
    id: generateId(),
    memberId: user.memberId,
    name: body.name,
    description: body.description || '',
    images: body.images || [],
    price: Number(body.price) || 0,
    createdAt: new Date().toISOString(),
  };

  const products = await readData<Product>('products.json');
  products.push(product);
  await writeData('products.json', products);

  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  const products = await readData<Product>('products.json');
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (products[index].memberId !== user.memberId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  products[index] = {
    ...products[index],
    name: updates.name ?? products[index].name,
    description: updates.description ?? products[index].description,
    images: updates.images ?? products[index].images,
    price: updates.price !== undefined ? Number(updates.price) : products[index].price,
  };

  await writeData('products.json', products);
  return NextResponse.json(products[index]);
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.memberId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const products = await readData<Product>('products.json');
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (product.memberId !== user.memberId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await writeData('products.json', products.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
