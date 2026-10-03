import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const smartGoal = await AIService.generateSmartGoal(
      body.idea,
      body.categoria || 'FINANZAS',
      1
    );
    return NextResponse.json(smartGoal);
  } catch (error) {
    console.error('Error generating SMART goal with AI:', error);
    return NextResponse.json({ error: 'Error al generar meta SMART con IA' }, { status: 500 });
  }
}
