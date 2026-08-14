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
      select: { id: true },
    });
    
    const productIds = products.map((p) => p.id);

    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: { in: productIds }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => productIds.includes(item.productId));
      const orderRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...order, sellerItems, orderRevenue };
    });

    return NextResponse.json({ orders: sellerOrders });
  } catch (err) {
    console.error('Orders Error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
