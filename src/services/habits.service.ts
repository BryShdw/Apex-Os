import prisma from '@/lib/prisma';

export class HabitsService {
  /**
   * Obtiene o inicializa los hábitos de la fecha actual
   */
  static async getTodayHabits(usuarioId: number = 1) {
    const hoyStr = new Date().toISOString().split('T')[0];
    const fecha = new Date(hoyStr);

    let habit = await prisma.registroHabitoDiario.findUnique({
      where: { fecha },
    });

    if (!habit) {
      habit = await prisma.registroHabitoDiario.create({
        data: {
          usuarioId,
          fecha,
          litrosAgua: 0.0,
          skincareAm: false,
          skincarePm: false,
          horasSueno: 7.0,
          calidadSueno: 7,
          pausasPostura: 0,
          minutosRedes: 0,
        },
      });
    }

    // Historial de los últimos 7 días
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    const historial = await prisma.registroHabitoDiario.findMany({
      where: {
        usuarioId,
        fecha: { gte: sieteDiasAtras },
      },
      orderBy: { fecha: 'asc' },
    });

    return {
      habit,
      historial,
    };
  }

  /**
   * Actualiza el registro de hábitos de hoy
   */
  static async updateTodayHabits(data: {
    litrosAgua?: number;
    skincareAm?: boolean;
    skincarePm?: boolean;
    horasSueno?: number;
    calidadSueno?: number;
    pausasPostura?: number;
    minutosRedes?: number;
    notas?: string;
  }) {
    const hoyStr = new Date().toISOString().split('T')[0];
    const fecha = new Date(hoyStr);

    return prisma.registroHabitoDiario.upsert({
      where: { fecha },
      update: data,
      create: {
        usuarioId: 1,
        fecha,
        litrosAgua: data.litrosAgua ?? 0.0,
        skincareAm: data.skincareAm ?? false,
        skincarePm: data.skincarePm ?? false,
        horasSueno: data.horasSueno ?? 7.0,
        calidadSueno: data.calidadSueno ?? 7,
        pausasPostura: data.pausasPostura ?? 0,
        minutosRedes: data.minutosRedes ?? 0,
        notas: data.notas,
      },
    });
  }
}
