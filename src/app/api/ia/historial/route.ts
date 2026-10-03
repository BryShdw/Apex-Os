import { AIService } from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const history = await AIService.getInsightsHistory(1);
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching AI history:', error);
    return NextResponse.json({ error: 'Error al obtener historial de IA' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = await AIService.toggleInsightApplied(Number(body.id), Boolean(body.aplicado));
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error toggling AI insight applied:', error);
    return NextResponse.json({ error: 'Error al actualizar estado del insight' }, { status: 500 });
  }
}
