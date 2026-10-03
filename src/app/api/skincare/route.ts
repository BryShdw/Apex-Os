import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productos = await prisma.productoSkincare.findMany({
      where: { usuarioId: 1 },
      orderBy: [{ momento: 'asc' }, { pasoNumero: 'asc' }],
    });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error fetching skincare products:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const producto = await prisma.productoSkincare.create({
      data: {
        usuarioId: 1,
        nombre: body.nombre,
        marca: body.marca || 'Personal',
        pasoNumero: Number(body.pasoNumero || 1),
        momento: body.momento || 'AM_PM',
        categoria: body.categoria || 'HIDRATANTE',
        enUso: body.enUso !== undefined ? Boolean(body.enUso) : true,
        precio: body.precio ? parseFloat(body.precio) : undefined,
        instrucciones: body.instrucciones,
        notas: body.notas,
      },
    });
    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error creating skincare product:', error);
    return NextResponse.json({ error: 'Error al agregar producto' }, { status: 500 });
  }
}
