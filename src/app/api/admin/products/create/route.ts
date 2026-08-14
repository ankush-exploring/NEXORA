import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, description, price, categoryId, imageUrl, stock, sellerId } = await req.json();

    if (!title || !price || !categoryId || !sellerId) {
      return NextResponse.json({ error: 'Title, price, category, and sellerId required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        price: parseFloat(price),
        categoryId,
        images: JSON.stringify([imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']),
        stock: parseInt(stock, 10) || 50,
        sellerId,
      },
    });

    return NextResponse.json({ message: 'Product created', product });
  } catch (err) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
