import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ message: 'Order status updated', order: updated });
  } catch (err) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
