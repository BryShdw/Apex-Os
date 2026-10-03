import { FinanceService } from '@/services/finance.service';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await FinanceService.updateCategoria(Number(id), {
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
    console.error('Error updating category by id:', error);
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await FinanceService.deleteCategoria(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
