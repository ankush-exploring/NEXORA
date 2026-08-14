import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId');

  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId required' }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    const categories = await prisma.category.findMany();

    return NextResponse.json({ products, categories });
  } catch (err) {
    console.error('Products Error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
