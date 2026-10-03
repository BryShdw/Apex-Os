import { FinanceService } from '@/services/finance.service';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: 1 },
      select: { ahorroBlindado: true, dineroActualCaja: true },
    });
    return NextResponse.json({
      ahorroBlindado: usuario ? Number(usuario.ahorroBlindado) : 0,
      dineroTotal: usuario ? Number(usuario.dineroActualCaja) : 0,
      dineroDisponibleGasto: usuario
        ? Math.max(0, Number(usuario.dineroActualCaja) - Number(usuario.ahorroBlindado))
        : 0,
    });
  } catch (error) {
    console.error('Error getting ahorro blindado:', error);
    return NextResponse.json({ error: 'Error al obtener ahorro blindado' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const monto = parseFloat(body.monto);
    const action = body.action || 'apartar'; // 'apartar' o 'ajustar'

    if (isNaN(monto) || monto < 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    let updated;
    if (action === 'apartar') {
      updated = await FinanceService.apartarAhorroBlindado(monto, 1);
    } else {
      updated = await FinanceService.updateAhorroBlindado(monto, 1);
    }

    const dineroTotal = Number(updated.dineroActualCaja);
    const ahorroBlindado = Number(updated.ahorroBlindado);
    const dineroDisponibleGasto = Math.max(0, dineroTotal - ahorroBlindado);

    return NextResponse.json({
      success: true,
      dineroTotal,
      ahorroBlindado,
      dineroDisponibleGasto,
      message:
        action === 'apartar'
          ? `Se apartaron S/ ${monto.toFixed(2)} al Ahorro Blindado Intocable.`
          : `Ahorro Blindado ajustado a S/ ${monto.toFixed(2)}.`,
    });
  } catch (error) {
    console.error('Error updating ahorro blindado:', error);
    return NextResponse.json({ error: 'Error al actualizar ahorro blindado' }, { status: 500 });
  }
}
