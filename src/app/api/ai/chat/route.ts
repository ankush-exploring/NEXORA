import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'mock_key',
});

export async function POST(req: Request) {
  try {
    const { message, role } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let systemPrompt = `You are the NEXORA AI Support Assistant. NEXORA is a multi-vendor e-commerce platform. Be concise, helpful, and polite. Keep answers relatively short.`;

    if (role === 'SELLER') {
      systemPrompt += ` You are talking to a Seller. Help them with store management, UTR verification, direct UPI payments, and adding products.`;
    } else {
      systemPrompt += ` You are talking to a Buyer. Help them with finding products, checkout, tracking orders, and canceling unfulfilled orders.`;
    }

    if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock')) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 500,
      });

      return NextResponse.json({
        reply: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
      });
    } else {
      // Mock response if no key is provided yet
      return NextResponse.json({
        reply: `[Simulated AI Reply]: I see you are a ${role || 'user'}. I received your message: "${message}". Please add a GROQ_API_KEY to your .env to chat with real Llama 3!`,
      });
    }
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
