import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { shipping, paymentMethod, items, totalAmount } = await req.json();

    if (!shipping || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Find or create customer account by email
    let user = await prisma.user.findUnique({
      where: { email: shipping.email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: shipping.name,
          email: shipping.email.toLowerCase(),
          password: 'guest_checkout_password',
          role: 'CUSTOMER',
        },
      });
    }

    // Calculate items and gather product data to update stock and seller balances
    let totalCalculatedAmount = 0;
    const sellerBalances: Record<string, number> = {};
    const stockUpdates: { id: string; deduct: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (product) {
        totalCalculatedAmount += product.price * item.quantity;
        stockUpdates.push({ id: product.id, deduct: item.quantity });
        if (!sellerBalances[product.sellerId]) {
          sellerBalances[product.sellerId] = 0;
        }
        sellerBalances[product.sellerId] += product.price * item.quantity;
      }
    }

    // Execute everything in a transaction for safety
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionId = `TXN-${Date.now()}`; // Simulated Paytm TXN ID

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount: parseFloat(totalAmount),
          status: 'PROCESSING',
          shippingName: shipping.name,
          shippingEmail: shipping.email.toLowerCase(),
          shippingAddress: shipping.address,
          shippingCity: shipping.state ? `${shipping.city}, ${shipping.state}` : shipping.city,
          shippingZip: shipping.pincode || shipping.zip || '000000',
          paymentMethod: paymentMethod || 'UPI',
          transactionId,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
        include: { items: true },
      }),
      // Deduct stock
      ...stockUpdates.map(update => 
        prisma.product.update({
          where: { id: update.id },
          data: { stock: { decrement: update.deduct } }
        })
      ),
      // Add balances to sellers
      ...Object.entries(sellerBalances).map(([sellerId, amount]) => 
        prisma.user.update({
          where: { id: sellerId },
          data: { balance: { increment: amount } }
        })
      )
    ]);

    // Send Email (Async)
    try {
      const { sendEmail } = require('@/lib/sendgrid');
      await sendEmail(
        shipping.email,
        `Order Confirmed: ${orderNumber}`,
        `<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #10b981;">Order Confirmed!</h2>
          <p>Hi ${shipping.name},</p>
          <p>Thank you for shopping at NEXORA. Your order <strong>${orderNumber}</strong> has been successfully placed via ${paymentMethod || 'UPI'} and your payment of ₹${totalAmount} has been routed to the sellers.</p>
          <p>We'll notify you once it ships.</p>
          <br/>
          <p>Best regards,<br/>The NEXORA Team</p>
        </div>`
      );
    } catch (emailErr) {
      console.error('Failed to send email:', emailErr);
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
