import { ai, GEMINI_MODEL } from '@/lib/gemini';
import prisma from '@/lib/prisma';
import { ModuloIA } from '@prisma/client';

export class AIService {
  /**
   * Obtiene el contexto completo de Brayan para inyectar en Gemini
   */
  private static async getUserFullContext(usuarioId: number = 1) {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    const now = new Date();
    const presupuesto = await prisma.presupuestoMensual.findUnique({
      where: { uk_anio_mes: { anio: now.getFullYear(), mes: now.getMonth() + 1 } },
      include: { transacciones: { take: 15, orderBy: { fecha: 'desc' } } },
    });
    const metas = await prisma.meta.findMany({ where: { usuarioId } });
    const hoyStr = now.toISOString().split('T')[0];
    const habitoHoy = await prisma.registroHabitoDiario.findUnique({ where: { fecha: new Date(hoyStr) } });
    const ultimoEntreno = await prisma.registroEntrenamiento.findFirst({
      where: { usuarioId },
      include: { rutina: true, series: { include: { ejercicio: true } } },
      orderBy: { fecha: 'desc' },
    });

    return {
      usuario,
      presupuesto,
      metas,
      habitoHoy,
      ultimoEntreno,
    };
  }

  /**
   * Chat interactivo con el Oráculo Personal de Alto Rendimiento
   */
  static async chatWithOracle(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [],
    usuarioId: number = 1
  ) {
    const ctx = await this.getUserFullContext(usuarioId);

    const systemInstruction = `
Eres el "Oráculo de Apex OS", el mentor personal y estratega de vida de Brayan.
Perfil de Brayan:
- Edad: 22 años, Lima, Perú.
- Ocupación: Técnico de Integración Audiovisual (Crestron SIMPL/Construct, Q-SYS, Extron) y estudiante de 9no ciclo de Ing. de Sistemas.
- Físico: 180cm, 70kg, ecto-mesomorfo. Meta: 75kg magro en "V", ganar fuerza en calistenia (barra fija).
- Postura: Síndrome cruzado superior (text neck, hombros adelantados por trabajo en laptop).
- Finanzas: Sueldo neto S/ 1,500 PEN. Aporte innegociable a casa: S/ 500. Fijos: transporte S/ 120, plan móvil S/ 28. Meta ahorro: S/ 200/mes.
- Sueño: Ancla sagrada de 7 horas (dormir a las 22:50 PM - despertar a las 05:50 AM).
- Skincare: Rutina Yanbal C10 AM y PM.
- Regla Clave: Brayan prefiere usar NotebookLM para consultas de estudio técnico o lectura de manuales; por lo tanto, no des clases teóricas de Crestron o universidad a menos que te pregunte sobre organización de tiempo o hábitos. Tu enfoque es: DISCIPLINA, PRODUCTIVIDAD, FINANZAS, CALISTENIA, POSTURA Y HÁBITOS DE VIDA.
- Tono: Inteligente, motivador, directo, con toques estoicos y metáforas del sistema Shadow Slave / Spell cuando sea oportuno.

Estado actual del sistema:
- Presupuesto mensual: S/ ${ctx.presupuesto?.ingresoTotal || 1500}
- Agua hoy: ${ctx.habitoHoy?.litrosAgua || 0}L
- Sueño anoche: ${ctx.habitoHoy?.horasSueno || 7}h (calidad: ${ctx.habitoHoy?.calidadSueno || 8}/10)
- Skincare AM: ${ctx.habitoHoy?.skincareAm ? 'Completado' : 'Pendiente'} | PM: ${ctx.habitoHoy?.skincarePm ? 'Completado' : 'Pendiente'}
- Metas activas: ${ctx.metas.map((m) => `${m.titulo} (${m.estado})`).join(', ')}
`;

    try {
      // Formatear contenidos para el SDK
      const contents = [
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || 'El Hechizo no pudo procesar tu respuesta en este instante.';
    } catch (error) {
      console.error('Error en chatWithOracle:', error);
      return 'Hubo un error de conexión con Google AI Studio. Verifica tu conexión a internet o intenta nuevamente en unos segundos.';
    }
  }

  /**
   * Auditoría Financiera y Detección de Gastos Hormiga con Gemini
   */
  static async auditFinances(usuarioId: number = 1) {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    const now = new Date();
    const presupuesto = await prisma.presupuestoMensual.findUnique({
      where: { uk_anio_mes: { anio: now.getFullYear(), mes: now.getMonth() + 1 } },
      include: {
        transacciones: {
          include: { categoria: true },
          orderBy: { fecha: 'desc' },
          take: 30,
        },
      },
    });

    const metas = await prisma.meta.findMany({
      where: { usuarioId, categoria: 'FINANZAS', estado: 'EN_PROGRESO' },
    });

    const prompt = `
Actúa como un Asesor Financiero Personal de Alto Rendimiento para Brayan (22 años, Lima Perú).
Contexto:
- Sueldo mensual: S/ ${usuario?.sueldoBase || 1500} PEN.
- Aporte innegociable a casa: S/ 500 PEN.
- Fijos declarados: S/ 120 transporte, S/ 28 plan móvil.
- Margen variable máximo mensual: S/ ${presupuesto?.presupuestoVariableMax || 652} PEN.
- Metas financieras activas: ${JSON.stringify(metas.map((m) => ({ titulo: m.titulo, objetivo: m.montoObjetivo, acumulado: m.montoAcumulado })))}

Transacciones recientes:
${JSON.stringify(
  presupuesto?.transacciones.map((t) => ({
    monto: Number(t.monto),
    categoria: t.categoria.nombre,
    tipo: t.tipo,
    descripcion: t.descripcion,
    esGastoHormiga: t.esGastoHormiga,
    metodo: t.metodoPago,
  }))
)}

Tu tarea:
1. Analizar el ritmo de gasto actual y advertir si hay desvíos en el presupuesto variable.
2. Identificar y cuantificar fugas por gastos hormiga (snacks, kioscos, compras espontáneas).
3. Entregar exactamente 3 recomendaciones accionables para proteger el ahorro de S/ 200 este mes.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "diagnostico": "Breve resumen en 2 oraciones del estado financiero de Brayan este mes.",
  "nivelAlerta": "VERDE" | "AMBAR" | "ROJO",
  "totalGastosHormigaDetectados": number,
  "ahorroProyectadoMes": number,
  "recomendaciones": [
    "Recomendación 1",
    "Recomendación 2",
    "Recomendación 3"
  ],
  "mensajeMotivacional": "Frase corta y estoica enfocada en disciplina financiera y metas futuras."
}
`;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      await prisma.insightIA.create({
        data: {
          usuarioId,
          modulo: ModuloIA.FINANZAS,
          diagnostico: parsed.diagnostico,
          recomendacionesJson: parsed,
        },
      });

      return parsed;
    } catch (error) {
      console.error('Error al consultar Gemini en auditFinances:', error);
      return {
        diagnostico: 'Tus finanzas se mantienen dentro del margen operativo base de S/ 1,500.',
        nivelAlerta: 'VERDE',
        totalGastosHormigaDetectados: 4.5,
        ahorroProyectadoMes: 200,
        recomendaciones: [
          'Mantén bloqueados los S/ 500 para el apoyo familiar.',
          'Monitorea el gasto hormiga en el transporte de ida y vuelta.',
          'Asigna S/ 50 semanales directos al fondo de emergencia.',
        ],
        mensajeMotivacional: 'El dinero ahorrado hoy es la libertad e independencia de mañana.',
      };
    }
  }

  /**
   * Generador de Progresiones Físicas de Calistenia y Alerta Postural
   */
  static async evaluateFitnessProgression(usuarioId: number = 1) {
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    const entrenamientos = await prisma.registroEntrenamiento.findMany({
      where: { usuarioId },
      include: {
        rutina: true,
        series: { include: { ejercicio: true } },
      },
      orderBy: { fecha: 'desc' },
      take: 5,
    });

    const prompt = `
Actúa como un Entrenador de Calistenia y Postura de Élite para Brayan:
Contexto:
- Edad: 22 años, 180cm, 70kg (Ecto-mesomorfo).
- Meta: Ganar masa muscular magra en "V" (75kg) y corregir el síndrome cruzado superior (cuello adelantado / text neck y hombros adelantados por trabajo en laptop/AV).
- Equipamiento: Barra fija en pared de su cuarto.

Historial de entrenamientos recientes:
${JSON.stringify(
  entrenamientos.map((e) => ({
    rutina: e.rutina.nombre,
    fecha: e.fecha,
    rpeGeneral: e.rpeEsfuerzoGeneral,
    molestiaCuello: e.molestiaCuello,
    series: e.series.map((s) => ({
      ejercicio: s.ejercicio.nombre,
      reps: s.repeticiones,
      rpe: s.rpeSerie,
      fallo: s.falloMuscular,
    })),
  }))
)}

Tu tarea:
1. Evaluar si está listo para aumentar repeticiones o cambiar a una variante más desafiante en dominadas y fondos.
2. Analizar el nivel de molestia de cuello reportada (0 a 10) y prescribir ejercicios correctivos (Chin Tucks, retracción escapular).
3. Generar una meta física para la próxima semana.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "diagnostico": "Resumen técnico de 2 oraciones sobre su rendimiento y postura.",
  "progresionSugerida": "Ejercicio y variación recomendada para la siguiente sesión (ej. 3x8 dominadas estrictas con pausa).",
  "alertaPostural": "Recomendación específica para cuello/text neck.",
  "rutinaCorrectivaMinutos": number,
  "metaSemanal": "Meta concreta medible (ej. Lograr 8 dominadas sin balanceo en la primera serie).",
  "consejoRecuperacion": "Consejo enfocado en sueño y nutrición proteica casera."
}
`;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      await prisma.insightIA.create({
        data: {
          usuarioId,
          modulo: ModuloIA.FITNESS,
          diagnostico: parsed.diagnostico,
          recomendacionesJson: parsed,
        },
      });

      return parsed;
    } catch (error) {
      console.error('Error al consultar Gemini en evaluateFitnessProgression:', error);
      return {
        diagnostico: 'Buen volumen inicial en barra fija. La base de calistenia se consolida con repeticiones controladas.',
        progresionSugerida: 'Dominadas pronas: enfócate en 3 series de 6 a 8 repeticiones con descenso lento (3 segundos excéntrico).',
        alertaPostural: 'Realiza 2 series de 10 Chin Tucks contra la pared antes de acostarte para desactivar los trapecios.',
        rutinaCorrectivaMinutos: 5,
        metaSemanal: 'Acumular 25 dominadas totales de calidad en la sesión de Torso A.',
        consejoRecuperacion: 'Prioriza 7 horas completas de sueño (22:50 PM) para máxima síntesis proteica.',
      };
    }
  }

  /**
   * Análisis de Hábitos, Sueño e Hidratación
   */
  static async analyzeHabitsAndSleep(usuarioId: number = 1) {
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    const historial = await prisma.registroHabitoDiario.findMany({
      where: { usuarioId, fecha: { gte: sieteDiasAtras } },
      orderBy: { fecha: 'asc' },
    });

    const prompt = `
Actúa como un Especialista en Neurobiología del Sueño y Hábitos de Alto Rendimiento para Brayan:
Contexto:
- Meta de sueño: 7 horas reales (acostarse 22:50 PM - despertar 05:50 AM).
- Hidratación meta: 2.5 Litros de agua al día.
- Problema identificado: Procrastinación con redes sociales antes de dormir y fatiga mental al despertar.

Historial de los últimos 7 días:
${JSON.stringify(historial)}

Tu tarea:
1. Evaluar la consistencia del ancla de sueño y su correlación con la energía.
2. Evaluar el cumplimiento del consumo de agua y descansos posturales.
3. Brindar un protocolo de noche para reducir fricción y dormir sin mirar la pantalla del celular.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "diagnostico": "Resumen de 2 oraciones sobre la consistencia de sueño e hidratación.",
  "puntuacionRecuperacion": number, // 1 al 100
  "estadoAnclaSueno": "OPTIMO" | "IRREGULAR" | "CRITICO",
  "protocoloNocturno": [
    "Paso 1 (ej. Soltar móvil a las 22:20)",
    "Paso 2 (ej. Skincare PM + estiramiento de cuello)",
    "Paso 3 (ej. Luces cálidas y lectura física)"
  ],
  "consejoHidratacion": "Consejo para llegar a los 2.5L sin levantarse de noche al baño."
}
`;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      await prisma.insightIA.create({
        data: {
          usuarioId,
          modulo: ModuloIA.HABITOS_SUENO,
          diagnostico: parsed.diagnostico,
          recomendacionesJson: parsed,
        },
      });

      return parsed;
    } catch (error) {
      console.error('Error en analyzeHabitsAndSleep:', error);
      return {
        diagnostico: 'Tu ancla de sueño de 7 horas se mantiene como el pilar central de tu energía y recuperación celular.',
        puntuacionRecuperacion: 82,
        estadoAnclaSueno: 'OPTIMO',
        protocoloNocturno: [
          'Dejar el smartphone cargando a más de 2 metros de la cama a partir de las 22:15 PM.',
          'Realizar el Skincare PM Yanbal (limpiador suave y reparador de barrera) a las 22:30 PM.',
          'Apagar luces a las 22:50 PM en habitación completamente oscura y fresca.',
        ],
        consejoHidratacion: 'Consume 1.5L entre 06:00 AM y 14:00 PM, y los 1.0L restantes antes de las 19:30 PM para no interrumpir el sueño profundo.',
      };
    }
  }

  /**
   * Generador de Metas SMART con IA
   */
  static async generateSmartGoal(ideaUsuario: string, categoria: string, usuarioId: number = 1) {
    const prompt = `
Convierte la siguiente idea de Brayan en una Meta SMART formal (Específica, Medible, Alcanzable, Relevante y con Tiempo Límite):
Idea: "${ideaUsuario}"
Categoría propuesta: "${categoria}"
Contexto: Brayan tiene 22 años, sueldo S/ 1,500, ahorra S/ 200/mes, entrena calistenia en casa y trabaja en integración AV.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "titulo": "Título SMART conciso y motivador (máximo 60 caracteres)",
  "descripcion": "Descripción detallada del por qué, cómo se medirá y el plan de acción (2 o 3 oraciones).",
  "categoria": "FINANZAS" | "FITNESS" | "POSTURA" | "SKINCARE" | "CARRERA",
  "horizonte": "CORTO_1_3M" | "MEDIANO_3_6M" | "LARGO_1_3A",
  "montoObjetivo": number | null,
  "diasPlazoEstimado": number
}
`;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      await prisma.insightIA.create({
        data: {
          usuarioId,
          modulo: ModuloIA.METAS,
          diagnostico: `Meta SMART generada: ${parsed.titulo}`,
          recomendacionesJson: parsed,
        },
      });

      return parsed;
    } catch (error) {
      console.error('Error en generateSmartGoal:', error);
      return {
        titulo: ideaUsuario.slice(0, 50),
        descripcion: 'Objetivo adaptado a tu plan de desarrollo personal.',
        categoria,
        horizonte: 'CORTO_1_3M',
        montoObjetivo: null,
        diasPlazoEstimado: 30,
      };
    }
  }

  /**
   * Obtiene el historial de todos los insights generados por Gemini en MySQL
   */
  static async getInsightsHistory(usuarioId: number = 1) {
    return prisma.insightIA.findMany({
      where: { usuarioId },
      orderBy: { fechaGeneracion: 'desc' },
      take: 20,
    });
  }

  /**
   * Alterna el estado de aplicado de un insight
   */
  static async toggleInsightApplied(id: number, aplicado: boolean) {
    return prisma.insightIA.update({
      where: { id },
      data: { aplicado },
    });
  }
}
