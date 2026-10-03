import { FinanceService } from '@/services/finance.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Si es un aporte
    if (body.action === 'aporte') {
      const aporte = await FinanceService.addGoalContribution(
        Number(body.metaId),
        Number(body.monto),
        body.nota
      );
      return NextResponse.json(aporte, { status: 201 });
    }

    // Si es creación de nueva meta
    const meta = await FinanceService.createGoal({
      titulo: body.titulo,
      descripcion: body.descripcion,
      categoria: body.categoria,
      horizonte: body.horizonte,
      montoObjetivo: body.montoObjetivo ? Number(body.montoObjetivo) : undefined,
      fechaLimite: body.fechaLimite ? new Date(body.fechaLimite) : undefined,
      prioridad: body.prioridad ? Number(body.prioridad) : 1,
    });
    return NextResponse.json(meta, { status: 201 });
  } catch (error) {
    console.error('Error handling goals:', error);
    return NextResponse.json({ error: 'Error al procesar la meta' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: 'ID de meta requerido' }, { status: 400 });
    }

    const updated = await FinanceService.updateGoal(id, {
      titulo: body.titulo,
      descripcion: body.descripcion,
      categoria: body.categoria,
      horizonte: body.horizonte,
      montoObjetivo:
        body.montoObjetivo !== undefined && body.montoObjetivo !== ''
          ? parseFloat(body.montoObjetivo)
          : undefined,
      montoAcumulado:
        body.montoAcumulado !== undefined && body.montoAcumulado !== ''
          ? parseFloat(body.montoAcumulado)
          : undefined,
      fechaLimite: body.fechaLimite ? new Date(body.fechaLimite) : null,
      estado: body.estado,
      prioridad: body.prioridad !== undefined ? parseInt(body.prioridad) : undefined,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Error al actualizar la meta' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    let id = idParam ? Number(idParam) : null;

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id ? Number(body.id) : null;
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de meta requerido' }, { status: 400 });
    }

    await FinanceService.deleteGoal(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Error al eliminar la meta' }, { status: 500 });
  }
}
