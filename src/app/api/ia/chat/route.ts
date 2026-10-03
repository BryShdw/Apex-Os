import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reply = await AIService.chatWithOracle(
      body.message,
      body.history || [],
      1
    );
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({ error: 'Error procesando consulta con el Oráculo' }, { status: 500 });
  }
}
