import { HabitsService } from '@/services/habits.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await HabitsService.getTodayHabits(1);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Error al obtener hábitos' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = await HabitsService.updateTodayHabits(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating habits:', error);
    return NextResponse.json({ error: 'Error al actualizar hábitos' }, { status: 500 });
  }
}
