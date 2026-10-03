'use client';

import React, { useState } from 'react';
import {
  Settings2,
  Edit3,
  Check,
  Plus,
  HeartHandshake,
  Utensils,
  Cookie,
  PartyPopper,
  PiggyBank,
  Bus,
  Smartphone,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { formatPEN } from '@/lib/utils';
import { toast } from '@/components/common/Toast';

export interface CategoriaConMetricas {
  id: number;
  nombre: string;
  tipo: 'FIJO' | 'VARIABLE' | 'AHORRO_INVERSION' | 'INGRESO';
  esGastoHormiga: boolean;
  esComidaDiaria: boolean;
  esSalidaOcio: boolean;
  esAporteHogar: boolean;
  esModuloAhorro: boolean;
  colorHex: string;
  icono: string;
  presupuestoEstimado: number | null;
  totalGastado?: number;
  totalIngresado?: number;
  restante?: number | null;
  porcentaje?: number;
  conteoTransacciones?: number;
  estaPagado?: boolean;
}

interface Props {
  categorias: CategoriaConMetricas[];
  onDataUpdated: () => void;
}

export const BudgetModulesManager: React.FC<Props> = ({
  categorias,
  onDataUpdated,
}) => {
  // Edición de Módulo
  const [editingCat, setEditingCat] = useState<CategoriaConMetricas | null>(null);
  const [catNombre, setCatNombre] = useState('');
  const [catPresupuesto, setCatPresupuesto] = useState('');
  const [catTipo, setCatTipo] = useState<'FIJO' | 'VARIABLE' | 'AHORRO_INVERSION'>('VARIABLE');
  const [catEsComida, setCatEsComida] = useState(false);
  const [catEsAntojo, setCatEsAntojo] = useState(false);
  const [catEsSalida, setCatEsSalida] = useState(false);
  const [catEsAhorro, setCatEsAhorro] = useState(false);
  const [catEsAporte, setCatEsAporte] = useState(false);
  const [loadingCat, setLoadingCat] = useState(false);

  // Crear Nueva Categoría
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatNombre, setNewCatNombre] = useState('');
  const [newCatTipo, setNewCatTipo] = useState<'FIJO' | 'VARIABLE' | 'AHORRO_INVERSION'>('VARIABLE');
  const [newCatPresupuesto, setNewCatPresupuesto] = useState('');
  const [newCatEsComida, setNewCatEsComida] = useState(false);
  const [newCatEsAntojo, setNewCatEsAntojo] = useState(false);
  const [newCatEsSalida, setNewCatEsSalida] = useState(false);
  const [newCatEsAhorro, setNewCatEsAhorro] = useState(false);
  const [newCatEsAporte, setNewCatEsAporte] = useState(false);

  const openEditCatModal = (cat: CategoriaConMetricas) => {
    setEditingCat(cat);
    setCatNombre(cat.nombre);
    setCatPresupuesto(cat.presupuestoEstimado !== null ? cat.presupuestoEstimado.toString() : '');
    setCatTipo(cat.tipo === 'INGRESO' ? 'VARIABLE' : cat.tipo);
    setCatEsComida(cat.esComidaDiaria);
    setCatEsAntojo(cat.esGastoHormiga);
    setCatEsSalida(cat.esSalidaOcio);
    setCatEsAhorro(cat.esModuloAhorro);
    setCatEsAporte(cat.esAporteHogar);
  };

  const handleSaveCatDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !catNombre.trim()) return;
    setLoadingCat(true);
    try {
      const res = await fetch(`/api/finanzas/categorias/${editingCat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: catNombre.trim(),
          tipo: catTipo,
          presupuestoEstimado: catPresupuesto ? parseFloat(catPresupuesto) : null,
          esComidaDiaria: catEsComida,
          esGastoHormiga: catEsAntojo,
          esSalidaOcio: catEsSalida,
          esModuloAhorro: catEsAhorro,
          esAporteHogar: catEsAporte,
        }),
      });
      if (res.ok) {
        toast.success(`Módulo "${catNombre}" actualizado correctamente.`);
        setEditingCat(null);
        onDataUpdated();
      } else {
        toast.error('Error al actualizar el módulo.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión al actualizar el módulo.');
    } finally {
      setLoadingCat(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNombre.trim()) return;
    setLoadingCat(true);
    try {
      const res = await fetch('/api/finanzas/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newCatNombre.trim(),
          tipo: newCatTipo,
          presupuestoEstimado: newCatPresupuesto ? parseFloat(newCatPresupuesto) : null,
          esComidaDiaria: newCatEsComida,
          esGastoHormiga: newCatEsAntojo,
          esSalidaOcio: newCatEsSalida,
          esModuloAhorro: newCatEsAhorro,
          esAporteHogar: newCatEsAporte,
        }),
      });
      if (res.ok) {
        toast.success(`Módulo "${newCatNombre}" creado exitosamente.`);
        setShowNewCatModal(false);
        setNewCatNombre('');
        setNewCatPresupuesto('');
        setNewCatEsComida(false);
        setNewCatEsAntojo(false);
        setNewCatEsSalida(false);
        setNewCatEsAhorro(false);
        setNewCatEsAporte(false);
        onDataUpdated();
      } else {
        toast.error('Error al crear el módulo.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión al crear módulo.');
    } finally {
      setLoadingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: CategoriaConMetricas) => {
    if (
      !confirm(
        `¿Eliminar el módulo "${cat.nombre}"?\nSus transacciones históricas se preservarán de forma segura en Gastos Varios.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/finanzas/categorias/${cat.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`Módulo "${cat.nombre}" eliminado.`);
        onDataUpdated();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(`No se pudo eliminar: ${data.error || 'Error del servidor'}`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión al eliminar.');
    }
  };

  const getCategoryIcon = (cat: CategoriaConMetricas) => {
    if (cat.esAporteHogar) return <HeartHandshake className="w-4 h-4 text-rose-400" />;
    if (cat.esComidaDiaria) return <Utensils className="w-4 h-4 text-emerald-400" />;
    if (cat.esGastoHormiga) return <Cookie className="w-4 h-4 text-amber-400" />;
    if (cat.esSalidaOcio) return <PartyPopper className="w-4 h-4 text-purple-400" />;
    if (cat.esModuloAhorro || cat.tipo === 'AHORRO_INVERSION')
      return <PiggyBank className="w-4 h-4 text-cyan-400" />;
    if (cat.nombre.toLowerCase().includes('transporte'))
      return <Bus className="w-4 h-4 text-blue-400" />;
    if (cat.nombre.toLowerCase().includes('móvil') || cat.nombre.toLowerCase().includes('celular'))
      return <Smartphone className="w-4 h-4 text-yellow-400" />;
    return <Wallet className="w-4 h-4 text-slate-400" />;
  };

  // Cálculos globales informativos
  const totalPresupuestado = categorias.reduce(
    (acc, c) => acc + (c.presupuestoEstimado ? Number(c.presupuestoEstimado) : 0),
    0
  );
  const totalGastadoModulos = categorias.reduce(
    (acc, c) => acc + (c.totalGastado ? Number(c.totalGastado) : 0),
    0
  );
  const margenGlobal = totalPresupuestado - totalGastadoModulos;

  return (
    <div className="space-y-6">
      {/* 1. Header Informativo & Resumen Visual de Módulos */}
      <div className="ss-card p-6 border border-white/10 rounded-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl ss-inset flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-spell uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Tablero 100% Visual & Informativo
              </span>
              <h3 className="font-runic font-bold text-xl text-slate-100 mt-1">
                Monitoreo de Módulos & Topes de Gasto
              </h3>
              <p className="text-xs text-slate-400 font-spell">
                Supervisa el balance mensual, consumo de límites y margen disponible. Los registros se realizan en &quot;Control Diario & Caja&quot;.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewCatModal(true)}
            className="ss-btn px-4 py-2.5 rounded-xl text-xs font-spell font-bold text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Módulo</span>
          </button>
        </div>

        {/* Cifras Globales de Monitoreo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5">
          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[10px] uppercase font-spell text-slate-400 block font-semibold">
              Total Presupuestado (Topes)
            </span>
            <span className="text-lg font-spell font-bold text-slate-200 block mt-0.5">
              {formatPEN(totalPresupuestado)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[10px] uppercase font-spell text-slate-400 block font-semibold">
              Gastado en el Mes
            </span>
            <span className="text-lg font-spell font-bold text-amber-400 block mt-0.5">
              {formatPEN(totalGastadoModulos)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[10px] uppercase font-spell text-slate-400 block font-semibold">
              Margen Global Restante
            </span>
            <span
              className={`text-lg font-spell font-bold block mt-0.5 ${
                margenGlobal >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatPEN(margenGlobal)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid de Módulos (100% Visual e Informativo) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-runic font-bold text-lg text-slate-200 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-cyan-400" />
            Módulos Asignados ({categorias.length})
          </h4>
          <span className="text-xs text-slate-400 font-spell">
            Usa el lápiz para ajustar topes o el tacho para eliminar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => {
            const tope = cat.presupuestoEstimado !== null ? Number(cat.presupuestoEstimado) : null;
            const gastado = cat.totalGastado || 0;
            const restante =
              cat.restante !== undefined && cat.restante !== null
                ? cat.restante
                : tope !== null
                ? tope - gastado
                : null;
            const porcentaje =
              cat.porcentaje ||
              (tope && tope > 0 ? Math.min(100, Math.round((gastado / tope) * 100)) : 0);
            const esExcedido = restante !== null && restante < 0;

            // Determinar color de barra
            let barColor = 'from-cyan-500 to-emerald-400';
            if (porcentaje >= 100) {
              barColor = 'from-rose-500 to-red-600';
            } else if (porcentaje >= 75) {
              barColor = 'from-amber-400 to-orange-500';
            }

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-xl ss-card border transition-all flex flex-col justify-between space-y-3 ${
                  esExcedido
                    ? 'border-rose-500/40 bg-rose-500/[0.02]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header de la Tarjeta */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg ss-inset flex items-center justify-center border border-white/5">
                      {getCategoryIcon(cat)}
                    </div>
                    <div>
                      <h4
                        className="font-spell font-bold text-sm text-white truncate max-w-[160px]"
                        title={cat.nombre}
                      >
                        {cat.nombre}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                          {cat.tipo}
                        </span>
                        {cat.esComidaDiaria && (
                          <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Comida
                          </span>
                        )}
                        {cat.esGastoHormiga && (
                          <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Antojo
                          </span>
                        )}
                        {cat.esAporteHogar && (
                          <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Casa
                          </span>
                        )}
                        {cat.esSalidaOcio && (
                          <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Salidas
                          </span>
                        )}
                        {cat.esModuloAhorro && (
                          <span className="text-[9px] font-spell px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Ahorro
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Configuración (Editar y Eliminar) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCatModal(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                      title="Editar nombre y tope del módulo"
                      aria-label="Editar módulo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Eliminar módulo"
                      aria-label="Eliminar módulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Métricas Informativas: Gastado vs Tope Asignado */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-baseline justify-between text-xs font-spell">
                    <span className="text-slate-400">Gastado este mes:</span>
                    <span className="font-bold text-white">
                      {formatPEN(gastado)}
                      {tope !== null && (
                        <span className="text-slate-500 text-[10px] ml-1">
                          / {formatPEN(tope)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Barra de Progreso del Tope */}
                  {tope !== null && tope > 0 ? (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full ss-inset overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-300`}
                          style={{ width: `${Math.min(100, porcentaje)}%` }}
                        ></div>
                      </div>

                      {/* Margen restante para llegar al tope */}
                      <div className="flex items-center justify-between text-[11px] font-spell">
                        <span className="text-slate-400">{porcentaje}% consumido</span>
                        {restante !== null && (
                          <span
                            className={`font-bold ${
                              esExcedido ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {esExcedido
                              ? `¡Excedido por ${formatPEN(Math.abs(restante))}!`
                              : `Quedan ${formatPEN(restante)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] font-spell text-slate-500 italic">
                      Sin límite fijo establecido
                    </div>
                  )}

                  {/* Estado Visual Informativo */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-spell">
                    <span className="text-slate-500">
                      {cat.conteoTransacciones || 0} movimientos
                    </span>

                    {cat.tipo === 'FIJO' ? (
                      cat.estaPagado ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cubierto
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">⏳ Pendiente</span>
                      )
                    ) : esExcedido ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Excedido
                      </span>
                    ) : porcentaje >= 80 ? (
                      <span className="text-amber-400 font-medium">⚠️ Cerca al tope</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">✓ En margen</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Editar Módulo Completo */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Editar Módulo de Presupuesto
              </h4>
              <button
                onClick={() => setEditingCat(null)}
                className="text-slate-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveCatDetails} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-slate-300 block mb-1">
                  Nombre del Módulo
                </label>
                <input
                  type="text"
                  required
                  value={catNombre}
                  onChange={(e) => setCatNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-slate-300 block mb-1">Tipo General</label>
                  <select
                    value={catTipo}
                    onChange={(e) => setCatTipo(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400"
                  >
                    <option value="VARIABLE" className="bg-[#15181e]">
                      Variable (Salidas/Extras)
                    </option>
                    <option value="FIJO" className="bg-[#15181e]">
                      Fijo (Compromiso)
                    </option>
                    <option value="AHORRO_INVERSION" className="bg-[#15181e]">
                      Ahorro / Inversión
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-slate-300 block mb-1">
                    Tope Mensual (S/)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Sin límite"
                    value={catPresupuesto}
                    onChange={(e) => setCatPresupuesto(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-spell text-slate-300 block">Etiquetas de Control:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-spell">
                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catEsComida}
                      onChange={(e) => setCatEsComida(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    <span className="text-slate-300">Comida Diaria</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catEsAntojo}
                      onChange={(e) => setCatEsAntojo(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span className="text-slate-300">Antojo / Dulce</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catEsSalida}
                      onChange={(e) => setCatEsSalida(e.target.checked)}
                      className="accent-purple-400"
                    />
                    <span className="text-slate-300">Salidas / Ocio</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catEsAhorro}
                      onChange={(e) => setCatEsAhorro(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    <span className="text-slate-300">Módulo Ahorro</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catEsAporte}
                      onChange={(e) => setCatEsAporte(e.target.checked)}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Aporte Hogar</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingCat}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {loadingCat ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Crear Nuevo Módulo */}
      {showNewCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Nuevo Módulo de Presupuesto
              </h4>
              <button
                onClick={() => setShowNewCatModal(false)}
                className="text-slate-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-slate-300 block mb-1">
                  Nombre del Módulo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Salidas fines de semana, Ropa, Extras..."
                  value={newCatNombre}
                  onChange={(e) => setNewCatNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-slate-300 block mb-1">Tipo General</label>
                  <select
                    value={newCatTipo}
                    onChange={(e) => setNewCatTipo(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400"
                  >
                    <option value="VARIABLE" className="bg-[#15181e]">
                      Variable (Salidas/Extras)
                    </option>
                    <option value="FIJO" className="bg-[#15181e]">
                      Fijo (Compromiso)
                    </option>
                    <option value="AHORRO_INVERSION" className="bg-[#15181e]">
                      Ahorro / Inversión
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-slate-300 block mb-1">
                    Tope Mensual (S/)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Ej: 150.00"
                    value={newCatPresupuesto}
                    onChange={(e) => setNewCatPresupuesto(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              </div>

              {/* Flags de Control */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-spell text-slate-300 block">Etiquetas de Control:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-spell">
                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatEsComida}
                      onChange={(e) => setNewCatEsComida(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    <span className="text-slate-300">Comida Diaria</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatEsAntojo}
                      onChange={(e) => setNewCatEsAntojo(e.target.checked)}
                      className="accent-amber-400"
                    />
                    <span className="text-slate-300">Antojo / Dulce</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatEsSalida}
                      onChange={(e) => setNewCatEsSalida(e.target.checked)}
                      className="accent-purple-400"
                    />
                    <span className="text-slate-300">Salidas / Ocio</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatEsAhorro}
                      onChange={(e) => setNewCatEsAhorro(e.target.checked)}
                      className="accent-cyan-400"
                    />
                    <span className="text-slate-300">Módulo Ahorro</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg ss-inset border border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCatEsAporte}
                      onChange={(e) => setNewCatEsAporte(e.target.checked)}
                      className="accent-rose-500"
                    />
                    <span className="text-slate-300">Aporte Hogar</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingCat}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {loadingCat ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar Módulo de Presupuesto</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
