import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const report = await AIService.analyzeHabitsAndSleep(1);
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error analyzing habits with AI:', error);
    return NextResponse.json({ error: 'Error al analizar hábitos con IA' }, { status: 500 });
  }
}
