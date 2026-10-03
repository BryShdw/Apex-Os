import prisma from '@/lib/prisma';
import { DiaSemana } from '@prisma/client';

export class FitnessService {
  /**
   * Obtiene la rutina sugerida para hoy según la matriz Tipo A / Tipo B
   */
  static async getTodayRoutine() {
    const daysMap: Record<number, { dia: DiaSemana; tipo: 'A' | 'B' | 'SABADO' | 'DOMINGO'; desc: string; rutinaCodigo?: string }> = {
      0: { dia: DiaSemana.DOMINGO, tipo: 'DOMINGO', desc: 'Descanso activo, hobbies y recarga mental' },
      1: { dia: DiaSemana.LUNES, tipo: 'A', desc: 'Día Tipo A: Clases de Universidad (19:30 - 22:30). Cero culpa por no entrenar.' },
      2: { dia: DiaSemana.MARTES, tipo: 'B', desc: 'Día Tipo B: Calistenia Torso A (Dominadas, Fondos, Postura) + Crestron', rutinaCodigo: 'TORSO_A' },
      3: { dia: DiaSemana.MIERCOLES, tipo: 'A', desc: 'Día Tipo A: Clases de Universidad (19:30 - 22:30).' },
      4: { dia: DiaSemana.JUEVES, tipo: 'B', desc: 'Día Tipo B: Pierna & Core (Búlgaras, Abdomen en Barra)', rutinaCodigo: 'PIERNA_CORE' },
      5: { dia: DiaSemana.VIERNES, tipo: 'A', desc: 'Día Tipo A: Clases de Universidad (19:30 - 22:30).' },
      6: { dia: DiaSemana.SABADO, tipo: 'SABADO', desc: 'Jornada corta: Llegada 15:00. Ventana de oro para Full Body y ocio.', rutinaCodigo: 'FULL_BODY_SABADO' },
    };

    const dayIndex = new Date().getDay();
    const config = daysMap[dayIndex];

    let rutina = null;
    if (config.rutinaCodigo) {
      rutina = await prisma.rutinaEjercicio.findUnique({
        where: { codigo: config.rutinaCodigo },
      });
    }

    return {
      ...config,
      rutina,
    };
  }

  /**
   * Obtiene catálogo de ejercicios y entrenamientos recientes
   */
  static async getFitnessOverview() {
    const today = await this.getTodayRoutine();
    const ejercicios = await prisma.ejercicioCatalogo.findMany({
      orderBy: { grupoMuscular: 'asc' },
    });
    const rutinas = await prisma.rutinaEjercicio.findMany();
    const entrenamientosRecientes = await prisma.registroEntrenamiento.findMany({
      take: 10,
      orderBy: { fecha: 'desc' },
      include: {
        rutina: true,
        series: {
          include: { ejercicio: true },
          orderBy: { numeroSerie: 'asc' },
        },
      },
    });

    return {
      today,
      ejercicios,
      rutinas,
      entrenamientosRecientes,
    };
  }

  /**
   * Guarda una sesión de entrenamiento completa con sus series
   */
  static async logWorkout(data: {
    rutinaId: number;
    duracionMinutos?: number;
    rpeEsfuerzoGeneral: number;
    molestiaCuello: number;
    comentarios?: string;
    series: Array<{
      ejercicioId: number;
      numeroSerie: number;
      repeticiones: number;
      pesoLastreKg?: number;
      rpeSerie?: number;
      falloMuscular?: boolean;
    }>;
  }) {
    return prisma.registroEntrenamiento.create({
      data: {
        usuarioId: 1,
        rutinaId: data.rutinaId,
        duracionMinutos: data.duracionMinutos || 45,
        rpeEsfuerzoGeneral: data.rpeEsfuerzoGeneral,
        molestiaCuello: data.molestiaCuello,
        comentarios: data.comentarios,
        series: {
          create: data.series.map((s) => ({
            ejercicioId: s.ejercicioId,
            numeroSerie: s.numeroSerie,
            repeticiones: s.repeticiones,
            pesoLastreKg: s.pesoLastreKg || 0,
            rpeSerie: s.rpeSerie,
            falloMuscular: s.falloMuscular || false,
          })),
        },
      },
      include: {
        series: { include: { ejercicio: true } },
      },
    });
  }
}
