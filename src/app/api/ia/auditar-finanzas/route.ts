import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const insight = await AIService.auditFinances(1);
    return NextResponse.json(insight);
  } catch (error) {
    console.error('Error generating financial audit:', error);
    return NextResponse.json({ error: 'Error al generar auditoría financiera con IA' }, { status: 500 });
  }
}
