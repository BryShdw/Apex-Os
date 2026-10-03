import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const practicas = await prisma.practicaDibujo.findMany({
      where: { usuarioId: 1 },
      orderBy: { fecha: 'desc' },
      take: 30,
    });

    // Estadísticas
    const totalMinutos = practicas.reduce((acc, p) => acc + p.minutos, 0);
    const totalSesiones = practicas.length;
    const promedioCalificacion =
      totalSesiones > 0
        ? (practicas.reduce((acc, p) => acc + p.calificacion, 0) / totalSesiones).toFixed(1)
        : '0';

    return NextResponse.json({
      practicas,
      stats: {
        totalMinutos,
        totalSesiones,
        promedioCalificacion,
      },
    });
  } catch (error) {
    console.error('Error fetching drawing practices:', error);
    return NextResponse.json({ error: 'Error al obtener prácticas de dibujo' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const practica = await prisma.practicaDibujo.create({
      data: {
        usuarioId: 1,
        minutos: parseInt(body.minutos) || 30,
        enfoque: body.enfoque || 'Anatomía General',
        calificacion: Math.min(10, Math.max(1, parseInt(body.calificacion) || 7)),
        notas: body.notas,
      },
    });
    return NextResponse.json(practica, { status: 201 });
  } catch (error) {
    console.error('Error recording drawing practice:', error);
    return NextResponse.json({ error: 'Error al registrar sesión de dibujo' }, { status: 500 });
  }
}
