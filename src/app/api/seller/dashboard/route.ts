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
    });

    const productIds = products.map(p => p.id);

    // Orders that contain at least one item from this seller
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

    // Filter order items to only this seller's products for revenue calculation
    let totalRevenue = 0;
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => productIds.includes(item.productId));
      const orderRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      totalRevenue += orderRevenue;
      return { ...order, sellerItems, orderRevenue };
    });

    const lowStockCount = products.filter((p) => p.stock <= 20).length;

    const user = await prisma.user.findUnique({ where: { id: sellerId } });
    const balance = user?.balance || 0;

    return NextResponse.json({
      balance,
      totalRevenue,
      totalOrders: sellerOrders.length,
      activeProducts: products.length,
      lowStockCount,
      recentOrders: sellerOrders.slice(0, 8),
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
