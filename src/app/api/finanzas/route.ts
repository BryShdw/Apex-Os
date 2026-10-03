import { FinanceService } from '@/services/finance.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await FinanceService.getFinancialOverview(1);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching finance overview:', error);
    return NextResponse.json({ error: 'Error al obtener datos financieros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaccion = await FinanceService.createTransaction({
      presupuestoId: Number(body.presupuestoId),
      categoriaId: Number(body.categoriaId),
      tipo: body.tipo,
      monto: Number(body.monto),
      descripcion: body.descripcion,
      metodoPago: body.metodoPago,
      esGastoHormiga: Boolean(body.esGastoHormiga),
      metaId: body.metaId ? Number(body.metaId) : undefined,
    });
    return NextResponse.json(transaccion, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Error al registrar transacción' }, { status: 500 });
  }
}
