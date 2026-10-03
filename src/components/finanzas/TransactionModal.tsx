'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  presupuestoId: number;
  categorias: Array<{ id: number; nombre: string; tipo: string; esGastoHormiga: boolean; colorHex: string }>;
  metas: Array<{ id: number; titulo: string }>;
  onTransactionAdded: () => void;
}

export const TransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  presupuestoId,
  categorias,
  metas,
  onTransactionAdded,
}) => {
  const [tipo, setTipo] = useState<'GASTO' | 'INGRESO'>('GASTO');
  const [monto, setMonto] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id || 1);
  const [descripcion, setDescripcion] = useState('');
  const [metodoPago, setMetodoPago] = useState('YAPE_PLIN');
  const [esGastoHormiga, setEsGastoHormiga] = useState(false);
  const [metaId, setMetaId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Auto detectar si la categoría seleccionada es de gasto hormiga
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setCategoriaId(id);
    const selected = categorias.find((c) => c.id === id);
    if (selected?.esGastoHormiga) {
      setEsGastoHormiga(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0 || !descripcion.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/finanzas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presupuestoId,
          categoriaId,
          tipo,
          monto: parseFloat(monto),
          descripcion,
          metodoPago,
          esGastoHormiga,
          metaId: metaId ? Number(metaId) : undefined,
        }),
      });

      if (res.ok) {
        onTransactionAdded();
        onClose();
        setMonto('');
        setDescripcion('');
        setEsGastoHormiga(false);
        setMetaId('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="ss-card w-full max-w-lg p-6 md:p-8 border border-white/10 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-cyan">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-runic font-bold text-xl text-ss-silver">
              Registrar Movimiento Financiero
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Tipo (Gasto vs Ingreso) */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl ss-inset">
            <button
              type="button"
              onClick={() => setTipo('GASTO')}
              className={`py-2 rounded-lg text-xs font-spell font-bold transition-all ${
                tipo === 'GASTO'
                  ? 'ss-btn-active text-ss-crimson border border-ss-crimson/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Gasto / Salida (-)
            </button>
            <button
              type="button"
              onClick={() => setTipo('INGRESO')}
              className={`py-2 rounded-lg text-xs font-spell font-bold transition-all ${
                tipo === 'INGRESO'
                  ? 'ss-btn-active text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Ingreso (+)
            </button>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
              Monto en Soles (PEN)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-spell text-gray-500 text-sm font-bold">
                S/
              </span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                required
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl ss-inset font-spell text-lg text-ss-silver focus:outline-none focus:border-ss-cyan/50 transition-colors"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
              Categoría
            </label>
            <select
              value={categoriaId}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none focus:border-ss-cyan/50"
            >
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#15181e] text-ss-silver">
                  {cat.nombre} {cat.esGastoHormiga ? '🐜' : ''} ({cat.tipo})
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
              Descripción / Motivo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Recarga Metropolitano, almuerzo, etc."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none focus:border-ss-cyan/50 transition-colors"
            />
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
              Método de Pago
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none"
            >
              <option value="YAPE_PLIN" className="bg-[#15181e]">Yape / Plin</option>
              <option value="EFECTIVO" className="bg-[#15181e]">Efectivo</option>
              <option value="TRANSFERENCIA" className="bg-[#15181e]">Transferencia Bancaria</option>
              <option value="TARJETA_DEBITO" className="bg-[#15181e]">Tarjeta de Débito</option>
            </select>
          </div>

          {/* Opcional: Aportar a Meta de Ahorro */}
          {metas.length > 0 && tipo === 'GASTO' && (
            <div>
              <label className="block text-xs font-spell text-ss-cyan mb-1.5 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ¿Vincular este ahorro a una Meta SMART?
              </label>
              <select
                value={metaId}
                onChange={(e) => setMetaId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-cyan focus:outline-none"
              >
                <option value="" className="bg-[#15181e] text-gray-400">-- Ninguna (Gasto normal) --</option>
                {metas.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#15181e] text-ss-silver">
                    Aportar a: {m.titulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Checkbox Gasto Hormiga */}
          {tipo === 'GASTO' && (
            <div className="flex items-center gap-3 p-3 rounded-xl ss-inset border border-amber-500/20">
              <input
                type="checkbox"
                id="gastoHormiga"
                checked={esGastoHormiga}
                onChange={(e) => setEsGastoHormiga(e.target.checked)}
                className="w-4 h-4 rounded text-ss-gold bg-black/40 border-white/20 focus:ring-0"
              />
              <label htmlFor="gastoHormiga" className="text-xs text-gray-300 font-ui cursor-pointer flex-1">
                <span className="font-bold text-amber-400 font-spell">Gasto Hormiga 🐜:</span> Snack, golosina o compra impulsiva en calle o transporte.
              </label>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-spell text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ss-btn px-6 py-2.5 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan"
            >
              {loading ? 'Guardando en MySQL...' : 'Guardar Transacción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
