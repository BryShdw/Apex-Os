import { FitnessService } from '@/services/fitness.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await FitnessService.getFitnessOverview();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fitness overview:', error);
    return NextResponse.json({ error: 'Error al obtener información de fitness' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workout = await FitnessService.logWorkout({
      rutinaId: Number(body.rutinaId),
      duracionMinutos: Number(body.duracionMinutos || 45),
      rpeEsfuerzoGeneral: Number(body.rpeEsfuerzoGeneral || 7),
      molestiaCuello: Number(body.molestiaCuello || 0),
      comentarios: body.comentarios,
      series: body.series || [],
    });
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error('Error logging workout:', error);
    return NextResponse.json({ error: 'Error al guardar la sesión de entrenamiento' }, { status: 500 });
  }
}
