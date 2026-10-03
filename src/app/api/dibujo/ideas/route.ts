import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ideas = await prisma.ideaDibujo.findMany({
      where: { usuarioId: 1 },
      orderBy: [{ completada: 'asc' }, { fechaCreacion: 'desc' }],
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching drawing ideas:', error);
    return NextResponse.json({ error: 'Error al obtener ideas de dibujo' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idea = await prisma.ideaDibujo.create({
      data: {
        usuarioId: 1,
        titulo: body.titulo,
        categoria: body.categoria || 'ANATOMIA',
        descripcion: body.descripcion,
        referenciaUrl: body.referenciaUrl,
        dificultad: body.dificultad || 'MEDIO',
        completada: false,
      },
    });
    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error('Error creating drawing idea:', error);
    return NextResponse.json({ error: 'Error al crear idea de dibujo' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const updated = await prisma.ideaDibujo.update({
      where: { id },
      data: {
        titulo: body.titulo,
        categoria: body.categoria,
        descripcion: body.descripcion,
        referenciaUrl: body.referenciaUrl,
        dificultad: body.dificultad,
        completada: body.completada !== undefined ? Boolean(body.completada) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating drawing idea:', error);
    return NextResponse.json({ error: 'Error al actualizar idea' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.ideaDibujo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drawing idea:', error);
    return NextResponse.json({ error: 'Error al eliminar idea' }, { status: 500 });
  }
}
