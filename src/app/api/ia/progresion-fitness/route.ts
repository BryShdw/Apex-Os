import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const insight = await AIService.evaluateFitnessProgression(1);
    return NextResponse.json(insight);
  } catch (error) {
    console.error('Error generating workout progression:', error);
    return NextResponse.json({ error: 'Error al generar progresión física con IA' }, { status: 500 });
  }
}
