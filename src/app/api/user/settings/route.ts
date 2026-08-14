import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        upiId: true,
        twoFactorEnabled: true,
        lastPasswordChange: true,
        notifyOrderUpdates: true,
        notifyPromotions: true,
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, upiId, twoFactorEnabled, notifyOrderUpdates, notifyPromotions } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        upiId: upiId !== undefined ? upiId : undefined,
        twoFactorEnabled: twoFactorEnabled !== undefined ? twoFactorEnabled : undefined,
        notifyOrderUpdates: notifyOrderUpdates !== undefined ? notifyOrderUpdates : undefined,
        notifyPromotions: notifyPromotions !== undefined ? notifyPromotions : undefined,
      },
      select: {
        upiId: true,
        twoFactorEnabled: true,
        notifyOrderUpdates: true,
        notifyPromotions: true,
      }
    });

    return NextResponse.json({ success: true, settings: updatedUser });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
