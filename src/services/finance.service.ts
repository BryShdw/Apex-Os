import prisma from '@/lib/prisma';
import { getDaysRemainingInMonth } from '@/lib/utils';
import { MetodoPago, TipoCategoria, TipoTransaccion } from '@prisma/client';

export class FinanceService {
  /**
   * Obtiene la vista global y métricas financieras del mes activo
   */
  static async getFinancialOverview(usuarioId: number = 1) {
    const now = new Date();
    const anio = now.getFullYear();
    const mes = now.getMonth() + 1;

    // 0. Obtener usuario para conocer saldo total y ahorro blindado
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        sueldoBase: true,
        dineroActualCaja: true,
        ahorroBlindado: true,
      },
    });

    const dineroTotal = usuario ? Number(usuario.dineroActualCaja) : 0;
    const ahorroBlindado = usuario ? Number(usuario.ahorroBlindado) : 0;
    const dineroDisponibleGasto = Math.max(0, Number((dineroTotal - ahorroBlindado).toFixed(2)));

    // 1. Obtener o crear presupuesto del mes
    let presupuesto = await prisma.presupuestoMensual.findUnique({
      where: { uk_anio_mes: { anio, mes } },
    });

    if (!presupuesto) {
      presupuesto = await prisma.presupuestoMensual.create({
        data: {
          usuarioId,
          anio,
          mes,
          ingresoTotal: usuario ? Number(usuario.sueldoBase) : 1500.0,
          fijoApoyoCasa: 500.0,
          fijoMovil: 28.0,
          fijoTransporte: 120.0,
          metaAhorroMes: 200.0,
          presupuestoVariableMax: 652.0,
        },
      });
    }

    // 2. Transacciones del mes
    const transacciones = await prisma.transaccion.findMany({
      where: { presupuestoId: presupuesto.id },
      include: { categoria: true, aporteMeta: { include: { meta: true } } },
      orderBy: { fecha: 'desc' },
    });

    // 3. Categorías disponibles
    const categorias = await prisma.categoriaFinanzas.findMany({
      orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
    });

    // 4. Metas activas (filtrando metas de ahorro genéricas redundantes)
    const metas = await prisma.meta.findMany({
      where: {
        usuarioId,
        NOT: {
          titulo: { contains: 'FONDO DE EMERGENCIA INICIAL' },
        },
      },
      include: { aportes: { orderBy: { fecha: 'desc' } } },
      orderBy: [{ prioridad: 'asc' }, { fechaLimite: 'asc' }],
    });

    // 5. Cálculos analíticos
    let totalIngresos = 0;
    let totalGastos = 0;
    let gastosFijosTotal = 0;
    let gastosVariablesTotal = 0;
    let totalGastosHormiga = 0;
    let conteoGastosHormiga = 0;

    // Métricas por grupo de control diario
    let gastoComidaDiariaTotal = 0;
    let gastoAntojosTotal = 0;
    let gastoSalidasTotal = 0;
    let gastoAporteHogarTotal = 0;
    let ahorroInversionTotal = 0;

    for (const t of transacciones) {
      const monto = Number(t.monto);
      if (t.tipo === TipoTransaccion.INGRESO) {
        totalIngresos += monto;
      } else {
        totalGastos += monto;
        if (t.categoria.tipo === TipoCategoria.FIJO) {
          gastosFijosTotal += monto;
        } else if (t.categoria.tipo === TipoCategoria.AHORRO_INVERSION) {
          ahorroInversionTotal += monto;
        } else {
          gastosVariablesTotal += monto;
        }

        if (t.esGastoHormiga || t.categoria.esGastoHormiga) {
          totalGastosHormiga += monto;
          conteoGastosHormiga++;
        }

        if (t.categoria.esComidaDiaria) gastoComidaDiariaTotal += monto;
        if (t.categoria.esGastoHormiga) gastoAntojosTotal += monto;
        if (t.categoria.esSalidaOcio) gastoSalidasTotal += monto;
        if (t.categoria.esAporteHogar) gastoAporteHogarTotal += monto;
      }
    }

    const presupuestoVariableMax = Number(presupuesto.presupuestoVariableMax);
    const margenVariableRestante = Math.max(0, presupuestoVariableMax - gastosVariablesTotal);
    const diasRestantes = getDaysRemainingInMonth();
    const gastoDiarioSeguro = Number((margenVariableRestante / diasRestantes).toFixed(2));

    // Aportes totales a metas este mes
    const totalAportadoMetas = metas.reduce((acc, m) => acc + Number(m.montoAcumulado), 0);

    // 6. Enriquecer cada categoría con sus métricas del mes en curso
    const categoriasConMetricas = categorias.map((cat) => {
      const txsCat = transacciones.filter((t) => t.categoriaId === cat.id);
      const totalGastado = txsCat
        .filter((t) => t.tipo === TipoTransaccion.GASTO)
        .reduce((acc, t) => acc + Number(t.monto), 0);
      const totalIngresado = txsCat
        .filter((t) => t.tipo === TipoTransaccion.INGRESO)
        .reduce((acc, t) => acc + Number(t.monto), 0);
      const tope = cat.presupuestoEstimado ? Number(cat.presupuestoEstimado) : null;
      const restante = tope !== null ? Number((tope - totalGastado).toFixed(2)) : null;
      const porcentaje = tope && tope > 0 ? Math.min(100, Math.round((totalGastado / tope) * 100)) : 0;
      const estaPagado =
        (tope !== null && totalGastado >= tope && totalGastado > 0) ||
        (cat.tipo === TipoCategoria.FIJO && totalGastado > 0);

      return {
        id: cat.id,
        nombre: cat.nombre,
        tipo: cat.tipo,
        esGastoHormiga: cat.esGastoHormiga,
        esComidaDiaria: cat.esComidaDiaria,
        esSalidaOcio: cat.esSalidaOcio,
        esAporteHogar: cat.esAporteHogar,
        esModuloAhorro: cat.esModuloAhorro,
        colorHex: cat.colorHex,
        icono: cat.icono,
        presupuestoEstimado: tope,
        totalGastado,
        totalIngresado,
        restante,
        porcentaje,
        conteoTransacciones: txsCat.length,
        estaPagado,
      };
    });

    return {
      usuario: {
        id: usuario?.id || 1,
        nombre: usuario?.nombre || 'Brayan',
        dineroTotal,
        ahorroBlindado,
        dineroDisponibleGasto,
        sueldoBase: usuario ? Number(usuario.sueldoBase) : 1500,
      },
      presupuesto,
      resumen: {
        dineroTotal,
        ahorroBlindado,
        dineroDisponibleGasto,
        totalIngresos,
        totalGastos,
        balanceActual: totalIngresos - totalGastos,
        gastosFijosTotal,
        gastosVariablesTotal,
        ahorroInversionTotal,
        presupuestoVariableMax,
        margenVariableRestante,
        diasRestantes,
        gastoDiarioSeguro,
        totalGastosHormiga,
        conteoGastosHormiga,
        totalAportadoMetas,
        desgloseEspecial: {
          gastoComidaDiariaTotal,
          gastoAntojosTotal,
          gastoSalidasTotal,
          gastoAporteHogarTotal,
        },
      },
      transacciones,
      categorias: categoriasConMetricas,
      metas,
    };
  }

  /**
   * Actualiza el monto de dinero físico/banco total en posesión
   */
  static async updateSaldoCaja(monto: number, usuarioId: number = 1) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: { dineroActualCaja: monto },
    });
  }

  /**
   * Aparta dinero hacia el Ahorro Blindado Intocable (sin techo)
   */
  static async apartarAhorroBlindado(monto: number, usuarioId: number = 1) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        ahorroBlindado: {
          increment: monto,
        },
      },
    });
  }

  /**
   * Ajusta directamente el monto del Ahorro Blindado
   */
  static async updateAhorroBlindado(monto: number, usuarioId: number = 1) {
    return prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        ahorroBlindado: monto,
      },
    });
  }

  /**
   * Registra una transacción, actualiza metas si corresponde y descuenta del dinero total
   */
  static async createTransaction(data: {
    presupuestoId: number;
    categoriaId: number;
    tipo: 'INGRESO' | 'GASTO';
    monto: number;
    descripcion: string;
    metodoPago?: 'YAPE_PLIN' | 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA_DEBITO';
    esGastoHormiga?: boolean;
    metaId?: number;
    fecha?: Date;
    ajustarCaja?: boolean;
    usuarioId?: number;
  }) {
    const usuarioId = data.usuarioId || 1;
    const categoria = await prisma.categoriaFinanzas.findUnique({
      where: { id: data.categoriaId },
    });

    const isHormiga = data.esGastoHormiga ?? (categoria?.esGastoHormiga || false);

    const transaccion = await prisma.transaccion.create({
      data: {
        presupuestoId: data.presupuestoId,
        categoriaId: data.categoriaId,
        tipo: data.tipo as TipoTransaccion,
        monto: data.monto,
        descripcion: data.descripcion,
        metodoPago: (data.metodoPago as MetodoPago) || MetodoPago.YAPE_PLIN,
        esGastoHormiga: isHormiga,
        fecha: data.fecha || new Date(),
      },
      include: {
        categoria: true,
      },
    });

    // Ajustar saldo real en caja del usuario si se solicita (por defecto true)
    if (data.ajustarCaja !== false) {
      const delta = data.tipo === 'INGRESO' ? data.monto : -data.monto;
      await prisma.usuario.update({
        where: { id: usuarioId },
        data: {
          dineroActualCaja: {
            increment: delta,
          },
        },
      });
    }

    // Si está vinculada a una meta, registrar aporte
    if (data.metaId && data.tipo === 'GASTO') {
      await prisma.aporteMeta.create({
        data: {
          metaId: data.metaId,
          transaccionId: transaccion.id,
          monto: data.monto,
          nota: data.descripcion,
        },
      });

      await prisma.meta.update({
        where: { id: data.metaId },
        data: {
          montoAcumulado: {
            increment: data.monto,
          },
        },
      });
    }

    return transaccion;
  }

  /**
   * Registro rápido de antojo/comida con 1 solo clic
   */
  static async createQuickExpense(data: {
    descripcion: string;
    monto: number;
    categoriaNombre?: string;
    esAntojo?: boolean;
    esComidaDiaria?: boolean;
    metodoPago?: 'YAPE_PLIN' | 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA_DEBITO';
    usuarioId?: number;
  }) {
    const usuarioId = data.usuarioId || 1;
    const now = new Date();
    const anio = now.getFullYear();
    const mes = now.getMonth() + 1;

    // Presupuesto del mes actual
    let presupuesto = await prisma.presupuestoMensual.findUnique({
      where: { uk_anio_mes: { anio, mes } },
    });

    if (!presupuesto) {
      presupuesto = await prisma.presupuestoMensual.create({
        data: {
          usuarioId,
          anio,
          mes,
        },
      });
    }

    // Buscar categoría idónea
    let categoria = null;
    if (data.categoriaNombre) {
      categoria = await prisma.categoriaFinanzas.findFirst({
        where: { nombre: { contains: data.categoriaNombre } },
      });
    }

    if (!categoria && data.esAntojo) {
      categoria = await prisma.categoriaFinanzas.findFirst({
        where: { esGastoHormiga: true },
      });
    }

    if (!categoria && data.esComidaDiaria) {
      categoria = await prisma.categoriaFinanzas.findFirst({
        where: { esComidaDiaria: true },
      });
    }

    if (!categoria) {
      categoria = await prisma.categoriaFinanzas.findFirst({
        where: { tipo: TipoCategoria.VARIABLE },
      });
    }

    if (!categoria) {
      categoria = await prisma.categoriaFinanzas.create({
        data: {
          nombre: 'Antojos & Dulces Diarios',
          tipo: TipoCategoria.VARIABLE,
          esGastoHormiga: true,
          colorHex: '#f59e0b',
          icono: 'coffee',
          presupuestoEstimado: 60.0,
        },
      });
    }

    return this.createTransaction({
      presupuestoId: presupuesto.id,
      categoriaId: categoria.id,
      tipo: 'GASTO',
      monto: data.monto,
      descripcion: data.descripcion,
      metodoPago: data.metodoPago || MetodoPago.EFECTIVO,
      esGastoHormiga: data.esAntojo !== undefined ? data.esAntojo : true,
      ajustarCaja: true,
      usuarioId,
    });
  }

  /**
   * Administrador de categorías de presupuesto / módulos de ahorro y gasto
   */
  static async createCategoria(data: {
    nombre: string;
    tipo?: TipoCategoria;
    presupuestoEstimado?: number;
    esComidaDiaria?: boolean;
    esSalidaOcio?: boolean;
    esAporteHogar?: boolean;
    esModuloAhorro?: boolean;
    esGastoHormiga?: boolean;
    colorHex?: string;
    icono?: string;
  }) {
    return prisma.categoriaFinanzas.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo || TipoCategoria.VARIABLE,
        presupuestoEstimado: data.presupuestoEstimado || null,
        esComidaDiaria: Boolean(data.esComidaDiaria),
        esSalidaOcio: Boolean(data.esSalidaOcio),
        esAporteHogar: Boolean(data.esAporteHogar),
        esModuloAhorro: Boolean(data.esModuloAhorro),
        esGastoHormiga: Boolean(data.esGastoHormiga),
        colorHex: data.colorHex || '#06b6d4',
        icono: data.icono || 'wallet',
      },
    });
  }

  static async updateCategoria(
    id: number,
    data: {
      nombre?: string;
      tipo?: TipoCategoria;
      presupuestoEstimado?: number;
      esComidaDiaria?: boolean;
      esSalidaOcio?: boolean;
      esAporteHogar?: boolean;
      esModuloAhorro?: boolean;
      esGastoHormiga?: boolean;
      colorHex?: string;
      icono?: string;
    }
  ) {
    return prisma.categoriaFinanzas.update({
      where: { id },
      data: {
        ...data,
        presupuestoEstimado:
          data.presupuestoEstimado !== undefined ? data.presupuestoEstimado : undefined,
      },
    });
  }

  /**
   * Elimina una categoría de forma segura, reasignando transacciones si existen
   */
  static async deleteCategoria(id: number) {
    const count = await prisma.transaccion.count({ where: { categoriaId: id } });
    if (count > 0) {
      let fallback = await prisma.categoriaFinanzas.findFirst({
        where: { id: { not: id } },
      });
      if (!fallback) {
        fallback = await prisma.categoriaFinanzas.create({
          data: {
            nombre: 'Gastos Varios / Histórico',
            tipo: TipoCategoria.VARIABLE,
            colorHex: '#64748b',
            icono: 'archive',
          },
        });
      }
      await prisma.transaccion.updateMany({
        where: { categoriaId: id },
        data: { categoriaId: fallback.id },
      });
    }

    return prisma.categoriaFinanzas.delete({
      where: { id },
    });
  }

  /**
   * Crea una nueva meta SMART
   */
  static async createGoal(data: {
    titulo: string;
    descripcion?: string;
    categoria: 'FINANZAS' | 'FITNESS' | 'POSTURA' | 'SKINCARE' | 'CARRERA' | 'DIBUJO';
    horizonte: 'CORTO_1_3M' | 'MEDIANO_3_6M' | 'LARGO_1_3A';
    montoObjetivo?: number;
    fechaLimite?: Date;
    prioridad?: number;
  }) {
    return prisma.meta.create({
      data: {
        usuarioId: 1,
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        horizonte: data.horizonte,
        montoObjetivo: data.montoObjetivo,
        montoAcumulado: 0.0,
        fechaLimite: data.fechaLimite,
        prioridad: data.prioridad || 1,
      },
    });
  }

  /**
   * Actualiza una meta existente
   */
  static async updateGoal(
    id: number,
    data: {
      titulo?: string;
      descripcion?: string;
      categoria?: any;
      horizonte?: any;
      montoObjetivo?: number;
      montoAcumulado?: number;
      fechaLimite?: Date | null;
      estado?: any;
      prioridad?: number;
    }
  ) {
    return prisma.meta.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        horizonte: data.horizonte,
        montoObjetivo: data.montoObjetivo !== undefined ? data.montoObjetivo : undefined,
        montoAcumulado: data.montoAcumulado !== undefined ? data.montoAcumulado : undefined,
        fechaLimite: data.fechaLimite !== undefined ? data.fechaLimite : undefined,
        estado: data.estado,
        prioridad: data.prioridad !== undefined ? Number(data.prioridad) : undefined,
      },
    });
  }

  /**
   * Elimina una meta existente y sus aportes asociados
   */
  static async deleteGoal(id: number) {
    await prisma.aporteMeta.deleteMany({
      where: { metaId: id },
    });

    return prisma.meta.delete({
      where: { id },
    });
  }

  /**
   * Realiza un aporte directo a una meta existente
   */
  static async addGoalContribution(metaId: number, monto: number, nota?: string) {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } });
    if (!meta) throw new Error('Meta no encontrada');

    const now = new Date();
    const presupuesto = await prisma.presupuestoMensual.findUnique({
      where: { uk_anio_mes: { anio: now.getFullYear(), mes: now.getMonth() + 1 } },
    });

    const catAhorro = await prisma.categoriaFinanzas.findFirst({
      where: { tipo: TipoCategoria.AHORRO_INVERSION },
    });

    // Registrar transacción de ahorro si existe categoría y presupuesto
    let transaccionId: number | undefined;
    if (presupuesto && catAhorro) {
      const t = await prisma.transaccion.create({
        data: {
          presupuestoId: presupuesto.id,
          categoriaId: catAhorro.id,
          tipo: TipoTransaccion.GASTO,
          monto,
          descripcion: `Aporte a meta: ${meta.titulo}`,
          metodoPago: MetodoPago.TRANSFERENCIA,
          esGastoHormiga: false,
        },
      });
      transaccionId = t.id;
    }

    const aporte = await prisma.aporteMeta.create({
      data: {
        metaId,
        transaccionId,
        monto,
        nota: nota || `Aporte a ${meta.titulo}`,
      },
    });

    const updatedMeta = await prisma.meta.update({
      where: { id: metaId },
      data: {
        montoAcumulado: {
          increment: monto,
        },
      },
    });

    // Ajustar saldo en caja del usuario
    await prisma.usuario.update({
      where: { id: 1 },
      data: {
        dineroActualCaja: {
          decrement: monto,
        },
      },
    });

    // Si alcanzó o superó el objetivo, marcar completada
    if (
      updatedMeta.montoObjetivo &&
      Number(updatedMeta.montoAcumulado) >= Number(updatedMeta.montoObjetivo)
    ) {
      await prisma.meta.update({
        where: { id: metaId },
        data: { estado: 'COMPLETADA' },
      });
    }

    return aporte;
  }
}
