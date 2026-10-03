import { FinanceService } from '@/services/finance.service';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categorias = await prisma.categoriaFinanzas.findMany({
      orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
    });
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoria = await FinanceService.createCategoria({
      nombre: body.nombre,
      tipo: body.tipo,
      presupuestoEstimado: body.presupuestoEstimado
        ? parseFloat(body.presupuestoEstimado)
        : undefined,
      esComidaDiaria: body.esComidaDiaria,
      esSalidaOcio: body.esSalidaOcio,
      esAporteHogar: body.esAporteHogar,
      esModuloAhorro: body.esModuloAhorro,
      esGastoHormiga: body.esGastoHormiga,
      colorHex: body.colorHex,
      icono: body.icono,
    });
    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: 'ID de categoría requerido' }, { status: 400 });
    }

    const updated = await FinanceService.updateCategoria(id, {
      nombre: body.nombre,
      tipo: body.tipo,
      presupuestoEstimado:
        body.presupuestoEstimado !== undefined
          ? parseFloat(body.presupuestoEstimado)
          : undefined,
      esComidaDiaria: body.esComidaDiaria,
      esSalidaOcio: body.esSalidaOcio,
      esAporteHogar: body.esAporteHogar,
      esModuloAhorro: body.esModuloAhorro,
      esGastoHormiga: body.esGastoHormiga,
      colorHex: body.colorHex,
      icono: body.icono,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id') ? Number(searchParams.get('id')) : null;

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id ? Number(body.id) : null;
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de categoría requerido' }, { status: 400 });
    }

    await FinanceService.deleteCategoria(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
