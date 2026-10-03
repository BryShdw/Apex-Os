import { FinanceService } from '@/services/finance.service';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: 1 },
      select: { dineroActualCaja: true, sueldoBase: true },
    });
    return NextResponse.json({
      dineroActualCaja: usuario ? Number(usuario.dineroActualCaja) : 0,
      sueldoBase: usuario ? Number(usuario.sueldoBase) : 1500,
    });
  } catch (error) {
    console.error('Error getting saldo:', error);
    return NextResponse.json({ error: 'Error al obtener saldo de caja' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const monto = parseFloat(body.monto);
    if (isNaN(monto) || monto < 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const updated = await FinanceService.updateSaldoCaja(monto, 1);
    return NextResponse.json({
      success: true,
      dineroActualCaja: Number(updated.dineroActualCaja),
    });
  } catch (error) {
    console.error('Error updating saldo:', error);
    return NextResponse.json({ error: 'Error al actualizar saldo de caja' }, { status: 500 });
  }
}
