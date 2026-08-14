import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/sendgrid';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Send Login Notification Email
    await sendEmail(
      user.email,
      'New Login to NEXORA',
      `<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">New Login Alert</h2>
        <p>Hi ${user.name},</p>
        <p>We detected a new login to your NEXORA account.</p>
        <p>If this was you, no further action is required. If you did not authorize this login, please change your password immediately.</p>
      </div>`
    );

    return NextResponse.json({ user: userData, token, message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
