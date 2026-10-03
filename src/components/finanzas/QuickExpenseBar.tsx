'use client';

import React, { useState } from 'react';
import { Zap, Coffee, Utensils, Droplets, Cookie, Bus, Check, Plus, Loader2 } from 'lucide-react';
import { formatPEN } from '@/lib/utils';
import { toast } from '@/components/common/Toast';

interface Props {
  onExpenseAdded: () => void;
}

interface QuickOption {
  id: string;
  label: string;
  monto: number;
  categoriaNombre: string;
  esAntojo: boolean;
  esComidaDiaria: boolean;
  icon: any;
  color: string;
}

export const QuickExpenseBar: React.FC<Props> = ({ onExpenseAdded }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [metodoPago, setMetodoPago] = useState<'EFECTIVO' | 'YAPE_PLIN'>('EFECTIVO');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDesc, setCustomDesc] = useState('');
  const [customMonto, setCustomMonto] = useState('');
  const [customTipo, setCustomTipo] = useState<'ANTOJO' | 'COMIDA'>('ANTOJO');

  const quickOptions: QuickOption[] = [
    {
      id: 'empanada',
      label: 'Empanada',
      monto: 3.5,
      categoriaNombre: 'Antojos & Dulces Diarios',
      esAntojo: true,
      esComidaDiaria: false,
      icon: Cookie,
      color: 'text-amber-400 border-amber-500/30 hover:border-amber-400',
    },
    {
      id: 'sandwich',
      label: 'Sándwich',
      monto: 4.0,
      categoriaNombre: 'Antojos & Dulces Diarios',
      esAntojo: true,
      esComidaDiaria: false,
      icon: Utensils,
      color: 'text-orange-400 border-orange-500/30 hover:border-orange-400',
    },
    {
      id: 'agua',
      label: 'Agua Mineral',
      monto: 1.5,
      categoriaNombre: 'Antojos & Dulces Diarios',
      esAntojo: true,
      esComidaDiaria: false,
      icon: Droplets,
      color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
    },
    {
      id: 'almuerzo',
      label: 'Almuerzo Trabajo',
      monto: 12.0,
      categoriaNombre: 'Almuerzos & Comida Diaria',
      esAntojo: false,
      esComidaDiaria: true,
      icon: Utensils,
      color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
    },
    {
      id: 'pasaje',
      label: 'Pasaje Extra',
      monto: 3.0,
      categoriaNombre: 'Transporte Público',
      esAntojo: false,
      esComidaDiaria: false,
      icon: Bus,
      color: 'text-blue-400 border-blue-500/30 hover:border-blue-400',
    },
    {
      id: 'dulce',
      label: 'Dulce / Snack',
      monto: 2.5,
      categoriaNombre: 'Antojos & Dulces Diarios',
      esAntojo: true,
      esComidaDiaria: false,
      icon: Cookie,
      color: 'text-pink-400 border-pink-500/30 hover:border-pink-400',
    },
    {
      id: 'cafe',
      label: 'Café / Bebida',
      monto: 3.0,
      categoriaNombre: 'Antojos & Dulces Diarios',
      esAntojo: true,
      esComidaDiaria: false,
      icon: Coffee,
      color: 'text-yellow-400 border-yellow-500/30 hover:border-yellow-400',
    },
  ];

  const handleQuickSpend = async (option: QuickOption) => {
    setLoadingId(option.id);
    try {
      const res = await fetch('/api/finanzas/rapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: `${option.label} (${metodoPago === 'EFECTIVO' ? 'Efectivo' : 'Yape'})`,
          monto: option.monto,
          categoriaNombre: option.categoriaNombre,
          esAntojo: option.esAntojo,
          esComidaDiaria: option.esComidaDiaria,
          metodoPago,
        }),
      });

      if (res.ok) {
        toast.success(`✓ Registrado: ${option.label} (${formatPEN(option.monto)})`);
        setSuccessMsg(`¡Registrado: ${option.label} (${formatPEN(option.monto)})!`);
        setTimeout(() => setSuccessMsg(null), 3000);
        onExpenseAdded();
      } else {
        toast.error('Error al registrar gasto rápido.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCustomSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(customMonto);
    if (!customDesc || isNaN(monto) || monto <= 0) return;

    setLoadingId('custom');
    try {
      const res = await fetch('/api/finanzas/rapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: `${customDesc.trim()} (${metodoPago === 'EFECTIVO' ? 'Efectivo' : 'Yape'})`,
          monto,
          categoriaNombre:
            customTipo === 'COMIDA' ? 'Almuerzos & Comida Diaria' : 'Antojos & Dulces Diarios',
          esAntojo: customTipo === 'ANTOJO',
          esComidaDiaria: customTipo === 'COMIDA',
          metodoPago,
        }),
      });

      if (res.ok) {
        toast.success(`✓ Registrado: ${customDesc} (${formatPEN(monto)})`);
        setSuccessMsg(`¡Registrado: ${customDesc} (${formatPEN(monto)})!`);
        setTimeout(() => setSuccessMsg(null), 3000);
        setShowCustomModal(false);
        setCustomDesc('');
        setCustomMonto('');
        onExpenseAdded();
      } else {
        toast.error('Error al registrar gasto.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="ss-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl ss-inset flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
              Registro Rápido de Antojos & Comidas
              <span className="text-[10px] font-spell px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1 Clic
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-spell">
              Registra de inmediato lo que consumes en el trabajo o la calle y deduce de tu caja física
            </p>
          </div>
        </div>

        {/* Selector de Método de Pago Rápido */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-spell text-gray-400">Pagar con:</span>
          <div className="flex rounded-xl p-1 ss-inset border border-white/5 text-xs font-spell">
            <button
              type="button"
              onClick={() => setMetodoPago('EFECTIVO')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                metodoPago === 'EFECTIVO'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💵 Efectivo
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago('YAPE_PLIN')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                metodoPago === 'YAPE_PLIN'
                  ? 'bg-ss-purple/20 text-ss-purple font-bold border border-ss-purple/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📱 Yape/Plin
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-spell flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 pt-1">
        {quickOptions.map((opt) => {
          const Icon = opt.icon;
          const isLoading = loadingId === opt.id;
          return (
            <button
              key={opt.id}
              disabled={isLoading || loadingId !== null}
              onClick={() => handleQuickSpend(opt)}
              className={`p-3 rounded-xl ss-card border text-left transition-all group flex flex-col justify-between min-h-[82px] ${
                opt.color
              } ${isLoading ? 'opacity-50' : 'hover:scale-102 active:scale-98'}`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="text-[10px] font-spell px-1.5 py-0.2 rounded bg-white/5 opacity-60">
                    +1
                  </span>
                )}
              </div>
              <div>
                <span className="font-spell font-bold text-xs text-white block truncate">
                  {opt.label}
                </span>
                <span className="text-[11px] font-spell text-gray-400 group-hover:text-white font-medium">
                  {formatPEN(opt.monto)}
                </span>
              </div>
            </button>
          );
        })}

        {/* Botón Personalizado Rápido */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="p-3 rounded-xl ss-inset border border-dashed border-white/20 text-left transition-all hover:border-ss-cyan hover:text-ss-cyan flex flex-col justify-between min-h-[82px] group"
        >
          <div className="flex items-center justify-between w-full text-gray-400 group-hover:text-ss-cyan">
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-spell">Otro</span>
          </div>
          <div>
            <span className="font-spell font-bold text-xs text-gray-300 group-hover:text-ss-cyan block">
              Personalizado
            </span>
            <span className="text-[10px] font-spell text-gray-500">Monto libre</span>
          </div>
        </button>
      </div>

      {/* Mini Modal para Gasto Rápido Personalizado */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-sm w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <Plus className="w-4 h-4 text-ss-cyan" />
                Gasto Rápido Personalizado
              </h4>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleCustomSpend} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1.5">
                  ¿Qué compraste?
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marciano de fruta, galleta, gaseosa..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1.5">Monto (S/)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0.10"
                    required
                    placeholder="2.00"
                    value={customMonto}
                    onChange={(e) => setCustomMonto(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1.5">Tipo</label>
                  <select
                    value={customTipo}
                    onChange={(e) => setCustomTipo(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="ANTOJO" className="bg-[#15181e]">
                      🍬 Antojo/Dulce
                    </option>
                    <option value="COMIDA" className="bg-[#15181e]">
                      🍲 Almuerzo/Comida
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingId === 'custom'}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan flex items-center justify-center gap-2"
              >
                {loadingId === 'custom' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Registrar e Imputar a Caja</span>
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
