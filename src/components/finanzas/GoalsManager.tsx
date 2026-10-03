'use client';

import React, { useState } from 'react';
import { formatPEN, formatDate } from '@/lib/utils';
import { toast } from '@/components/common/Toast';
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  Edit3,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Meta {
  id: number;
  titulo: string;
  descripcion?: string | null;
  categoria: string;
  horizonte: string;
  montoObjetivo?: any;
  montoAcumulado: any;
  fechaLimite?: any;
  estado: string;
  prioridad: number;
  aportes?: Array<{ id: number; monto: any; fecha: string; nota?: string | null }>;
}

interface Props {
  metas: Meta[];
  onMetasUpdated: () => void;
}

export const GoalsManager: React.FC<Props> = ({ metas, onMetasUpdated }) => {
  const [modalNewOpen, setModalNewOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [aporteMetaId, setAporteMetaId] = useState<number | null>(null);
  const [montoAporte, setMontoAporte] = useState('20');
  const [loading, setLoading] = useState(false);

  // Form nueva meta
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('FINANZAS');
  const [horizonte, setHorizonte] = useState('CORTO_1_3M');
  const [montoObjetivo, setMontoObjetivo] = useState('');

  // Form editar meta
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editCategoria, setEditCategoria] = useState('FINANZAS');
  const [editHorizonte, setEditHorizonte] = useState('CORTO_1_3M');
  const [editMontoObjetivo, setEditMontoObjetivo] = useState('');
  const [editMontoAcumulado, setEditMontoAcumulado] = useState('');
  const [editEstado, setEditEstado] = useState('EN_PROGRESO');
  const [editPrioridad, setEditPrioridad] = useState(1);

  // Filtrar metas de fondo de emergencia o ahorro redundantes
  const visibleMetas = metas.filter(
    (m) =>
      !m.titulo.toUpperCase().includes('FONDO DE EMERGENCIA') &&
      !m.titulo.toUpperCase().includes('FONDO DE AHORRO INICIAL')
  );

  const handleCrearMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/finanzas/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          categoria,
          horizonte,
          montoObjetivo: montoObjetivo ? parseFloat(montoObjetivo) : undefined,
        }),
      });

      if (res.ok) {
        toast.success(`Meta "${titulo}" creada con éxito.`);
        onMetasUpdated();
        setModalNewOpen(false);
        setTitulo('');
        setDescripcion('');
        setMontoObjetivo('');
      } else {
        toast.error('Error al crear la meta.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (meta: Meta) => {
    setEditingMeta(meta);
    setEditTitulo(meta.titulo);
    setEditDescripcion(meta.descripcion || '');
    setEditCategoria(meta.categoria);
    setEditHorizonte(meta.horizonte);
    setEditMontoObjetivo(meta.montoObjetivo ? meta.montoObjetivo.toString() : '');
    setEditMontoAcumulado(meta.montoAcumulado ? meta.montoAcumulado.toString() : '0');
    setEditEstado(meta.estado);
    setEditPrioridad(meta.prioridad || 1);
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeta || !editTitulo.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/finanzas/metas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMeta.id,
          titulo: editTitulo.trim(),
          descripcion: editDescripcion.trim(),
          categoria: editCategoria,
          horizonte: editHorizonte,
          montoObjetivo: editMontoObjetivo ? parseFloat(editMontoObjetivo) : null,
          montoAcumulado: editMontoAcumulado ? parseFloat(editMontoAcumulado) : 0,
          estado: editEstado,
          prioridad: editPrioridad,
        }),
      });

      if (res.ok) {
        toast.success(`Meta "${editTitulo}" actualizada correctamente.`);
        setEditingMeta(null);
        onMetasUpdated();
      } else {
        toast.error('Error al actualizar la meta.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión al actualizar la meta.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMeta = async (id: number, titulo: string) => {
    if (!confirm(`¿Eliminar la meta "${titulo}"? Se borrará su historial de aportes.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/finanzas/metas?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success(`Meta "${titulo}" eliminada.`);
        onMetasUpdated();
      } else {
        toast.error('Error al eliminar la meta.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión al eliminar.');
    } finally {
      setLoading(false);
    }
  };

  const handleAporteDirecto = async (metaId: number, monto: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/finanzas/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'aporte',
          metaId,
          monto,
          nota: 'Aporte rápido desde panel de metas',
        }),
      });

      if (res.ok) {
        toast.success(`Aporte de ${formatPEN(monto)} registrado.`);
        onMetasUpdated();
        setAporteMetaId(null);
      } else {
        toast.error('Error al registrar aporte.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
            <Target className="w-5 h-5 text-ss-cyan" />
            Grimorio de Metas SMART ({visibleMetas.length})
          </h3>
          <p className="text-xs text-gray-400 font-spell">
            Objetivos clasificados por horizonte temporal, impacto y progreso acumulado
          </p>
        </div>

        <button
          onClick={() => setModalNewOpen(true)}
          className="ss-btn px-4 py-2 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/30 hover:border-ss-cyan flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Grid de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleMetas.map((meta) => {
          const objetivo = Number(meta.montoObjetivo || 0);
          const acumulado = Number(meta.montoAcumulado || 0);
          const porcentaje =
            objetivo > 0
              ? Math.min(100, Math.round((acumulado / objetivo) * 100))
              : meta.estado === 'COMPLETADA'
              ? 100
              : 40;

          return (
            <div
              key={meta.id}
              className="ss-card p-5 border border-white/5 relative flex flex-col justify-between group hover:border-ss-cyan/30 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase font-spell px-2 py-0.5 rounded ss-inset text-ss-cyan border border-ss-cyan/20">
                    {meta.categoria} • {meta.horizonte.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {meta.estado === 'COMPLETADA' ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-spell font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Lograda
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 flex items-center gap-1 font-spell">
                        <Clock className="w-3.5 h-3.5" /> En marcha
                      </span>
                    )}

                    {/* Botón Editar Meta */}
                    <button
                      onClick={() => openEditModal(meta)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/10 transition-colors"
                      title="Editar esta meta"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Botón Eliminar Meta */}
                    <button
                      onClick={() => handleEliminarMeta(meta.id, meta.titulo)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                      title="Eliminar meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-runic font-bold text-base text-ss-silver mb-1.5 line-clamp-1 group-hover:text-white">
                  {meta.titulo}
                </h4>

                {meta.descripcion && (
                  <p className="text-xs text-gray-400 font-ui line-clamp-2">{meta.descripcion}</p>
                )}
              </div>

              <div>
                {/* Barra de progreso */}
                {objetivo > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs font-spell text-gray-300 mb-1.5">
                      <span className="font-bold text-emerald-400">{formatPEN(acumulado)}</span>
                      <span className="text-ss-cyan font-bold">{porcentaje}%</span>
                      <span className="text-gray-400">{formatPEN(objetivo)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full ss-inset overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ss-cyan to-ss-gold transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Acciones de aporte rápido */}
                {objetivo > 0 && meta.estado !== 'COMPLETADA' && (
                  <div className="pt-3 border-t border-white/5 flex items-center gap-1.5">
                    <span className="text-[10px] font-spell text-gray-500">Aporte:</span>
                    <button
                      disabled={loading}
                      onClick={() => handleAporteDirecto(meta.id, 20)}
                      className="ss-btn px-2.5 py-1 rounded-lg text-[10px] font-spell text-gray-300 hover:text-ss-cyan border border-white/5"
                    >
                      +S/ 20
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => handleAporteDirecto(meta.id, 50)}
                      className="ss-btn px-2.5 py-1 rounded-lg text-[10px] font-spell text-gray-300 hover:text-ss-gold border border-white/5"
                    >
                      +S/ 50
                    </button>
                    <button
                      onClick={() => setAporteMetaId(meta.id)}
                      className="ss-btn px-2.5 py-1 rounded-lg text-[10px] font-spell text-ss-cyan border border-ss-cyan/20 ml-auto"
                    >
                      Otro
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Editar Meta */}
      {editingMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-ss-cyan" />
                Editar Meta SMART
              </h4>
              <button
                onClick={() => setEditingMeta(null)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Título de la Meta
                </label>
                <input
                  type="text"
                  required
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Categoría</label>
                  <select
                    value={editCategoria}
                    onChange={(e) => setEditCategoria(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="FINANZAS" className="bg-[#15181e]">
                      Finanzas
                    </option>
                    <option value="FITNESS" className="bg-[#15181e]">
                      Fitness & Calistenia
                    </option>
                    <option value="POSTURA" className="bg-[#15181e]">
                      Postura & Salud
                    </option>
                    <option value="SKINCARE" className="bg-[#15181e]">
                      Skin Care
                    </option>
                    <option value="DIBUJO" className="bg-[#15181e]">
                      Dibujo & Arte
                    </option>
                    <option value="CARRERA" className="bg-[#15181e]">
                      Carrera AV
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Horizonte</label>
                  <select
                    value={editHorizonte}
                    onChange={(e) => setEditHorizonte(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="CORTO_1_3M" className="bg-[#15181e]">
                      Corto Plazo (1-3 meses)
                    </option>
                    <option value="MEDIANO_3_6M" className="bg-[#15181e]">
                      Mediano Plazo (3-6 meses)
                    </option>
                    <option value="LARGO_1_3A" className="bg-[#15181e]">
                      Largo Plazo (1-3 años)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Monto Objetivo (S/)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Ej: 1500.00"
                    value={editMontoObjetivo}
                    onChange={(e) => setEditMontoObjetivo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Monto Acumulado Hoy (S/)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editMontoAcumulado}
                    onChange={(e) => setEditMontoAcumulado(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-emerald-400 text-xs font-spell focus:outline-none focus:border-ss-cyan font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Estado</label>
                  <select
                    value={editEstado}
                    onChange={(e) => setEditEstado(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="EN_PROGRESO" className="bg-[#15181e]">
                      En Marcha
                    </option>
                    <option value="COMPLETADA" className="bg-[#15181e]">
                      Lograda / Completada
                    </option>
                    <option value="PENDIENTE" className="bg-[#15181e]">
                      Pendiente
                    </option>
                    <option value="PAUSADA" className="bg-[#15181e]">
                      Pausada
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Prioridad</label>
                  <select
                    value={editPrioridad}
                    onChange={(e) => setEditPrioridad(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value={1} className="bg-[#15181e]">
                      1 - Máxima Prioridad
                    </option>
                    <option value={2} className="bg-[#15181e]">
                      2 - Alta
                    </option>
                    <option value={3} className="bg-[#15181e]">
                      3 - Media
                    </option>
                    <option value={4} className="bg-[#15181e]">
                      4 - Deseable
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios de la Meta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nueva Meta */}
      {modalNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <Plus className="w-4 h-4 text-ss-cyan" />
                Crear Nueva Meta SMART
              </h4>
              <button
                onClick={() => setModalNewOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleCrearMeta} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Título de la Meta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fondo de emergencia, 15 dominadas, curso Crestron..."
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre por qué es importante para tu plan de vida..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="FINANZAS" className="bg-[#15181e]">
                      Finanzas
                    </option>
                    <option value="FITNESS" className="bg-[#15181e]">
                      Fitness & Calistenia
                    </option>
                    <option value="POSTURA" className="bg-[#15181e]">
                      Postura & Salud
                    </option>
                    <option value="SKINCARE" className="bg-[#15181e]">
                      Skin Care
                    </option>
                    <option value="DIBUJO" className="bg-[#15181e]">
                      Dibujo & Arte
                    </option>
                    <option value="CARRERA" className="bg-[#15181e]">
                      Carrera AV
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Horizonte</label>
                  <select
                    value={horizonte}
                    onChange={(e) => setHorizonte(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="CORTO_1_3M" className="bg-[#15181e]">
                      Corto Plazo (1-3 meses)
                    </option>
                    <option value="MEDIANO_3_6M" className="bg-[#15181e]">
                      Mediano Plazo (3-6 meses)
                    </option>
                    <option value="LARGO_1_3A" className="bg-[#15181e]">
                      Largo Plazo (1-3 años)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Monto Monetario Objetivo (S/) (Opcional)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Ej: 1500.00"
                  value={montoObjetivo}
                  onChange={(e) => setMontoObjetivo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Crear Meta SMART</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Aporte Personalizado */}
      {aporteMetaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-sm w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver">Aporte Personalizado</h4>
              <button
                onClick={() => setAporteMetaId(null)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="text-xs font-spell text-gray-400 block mb-1">Monto en Soles</label>
              <input
                type="number"
                step="1"
                min="1"
                value={montoAporte}
                onChange={(e) => setMontoAporte(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan font-bold"
              />
            </div>
            <button
              disabled={loading}
              onClick={() => handleAporteDirecto(aporteMetaId, parseFloat(montoAporte) || 0)}
              className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-center gap-2"
            >
              Confirmar Aporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
