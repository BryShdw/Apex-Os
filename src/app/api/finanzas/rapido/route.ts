import { FinanceService } from '@/services/finance.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const monto = parseFloat(body.monto);
    if (isNaN(monto) || monto <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const transaccion = await FinanceService.createQuickExpense({
      descripcion: body.descripcion || 'Gasto Rápido',
      monto,
      categoriaNombre: body.categoriaNombre,
      esAntojo: body.esAntojo !== undefined ? Boolean(body.esAntojo) : true,
      esComidaDiaria: Boolean(body.esComidaDiaria),
      metodoPago: body.metodoPago || 'EFECTIVO',
      usuarioId: 1,
    });

    return NextResponse.json(transaccion, { status: 201 });
  } catch (error) {
    console.error('Error in quick expense:', error);
    return NextResponse.json({ error: 'Error al registrar gasto rápido' }, { status: 500 });
  }
}
