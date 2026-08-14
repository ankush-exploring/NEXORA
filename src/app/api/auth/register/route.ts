import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendgrid';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'CUSTOMER',
      },
    });

    // Send Welcome Email
    await sendEmail(
      user.email,
      'Welcome to NEXORA!',
      `<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">Welcome to NEXORA, ${user.name}!</h2>
        <p>Your account has been created successfully. We're thrilled to have you onboard.</p>
        <p>Log in anytime to explore our marketplace.</p>
      </div>`
    );

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
