'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Shield,
  Zap,
  Edit3,
  Plus,
  Check,
  Loader2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { formatPEN } from '@/lib/utils';
import { toast } from '@/components/common/Toast';

interface Props {
  dineroTotal: number;
  ahorroBlindado: number;
  dineroDisponibleGasto: number;
  onDataUpdated: () => void;
}

export const LiquidityVaultHeader: React.FC<Props> = ({
  dineroTotal,
  ahorroBlindado,
  dineroDisponibleGasto,
  onDataUpdated,
}) => {
  // Modal Saldo Total
  const [modalSaldoOpen, setModalSaldoOpen] = useState(false);
  const [nuevoSaldoTotal, setNuevoSaldoTotal] = useState(dineroTotal.toString());
  const [loadingSaldo, setLoadingSaldo] = useState(false);

  // Modal Apartar a Ahorro
  const [modalApartarOpen, setModalApartarOpen] = useState(false);
  const [montoApartar, setMontoApartar] = useState('100');
  const [loadingApartar, setLoadingApartar] = useState(false);

  // Modal Ajustar Ahorro Total
  const [modalAjustarAhorroOpen, setModalAjustarAhorroOpen] = useState(false);
  const [nuevoAhorroTotal, setNuevoAhorroTotal] = useState(ahorroBlindado.toString());
  const [loadingAjustarAhorro, setLoadingAjustarAhorro] = useState(false);

  const handleUpdateSaldoTotal = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoSaldoTotal);
    if (isNaN(val) || val < 0) {
      toast.error('Monto de dinero total inválido.');
      return;
    }

    setLoadingSaldo(true);
    try {
      const res = await fetch('/api/finanzas/saldo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto: val }),
      });

      if (res.ok) {
        toast.success(`Dinero total actualizado a ${formatPEN(val)}.`);
        setModalSaldoOpen(false);
        onDataUpdated();
      } else {
        toast.error('Error al actualizar el saldo total.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setLoadingSaldo(false);
    }
  };

  const handleApartarAhorro = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(montoApartar);
    if (isNaN(val) || val <= 0) {
      toast.error('Ingresa un monto válido para apartar.');
      return;
    }

    setLoadingApartar(true);
    try {
      const res = await fetch('/api/finanzas/ahorro', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apartar', monto: val }),
      });

      if (res.ok) {
        toast.success(`🛡️ Se apartaron ${formatPEN(val)} al Ahorro Blindado Intocable.`);
        setModalApartarOpen(false);
        setMontoApartar('100');
        onDataUpdated();
      } else {
        toast.error('Error al apartar al ahorro.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión.');
    } finally {
      setLoadingApartar(false);
    }
  };

  const handleAjustarAhorroTotal = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(nuevoAhorroTotal);
    if (isNaN(val) || val < 0) {
      toast.error('Monto de ahorro inválido.');
      return;
    }

    setLoadingAjustarAhorro(true);
    try {
      const res = await fetch('/api/finanzas/ahorro', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ajustar', monto: val }),
      });

      if (res.ok) {
        toast.success(`🛡️ Ahorro Blindado reajustado a ${formatPEN(val)}.`);
        setModalAjustarAhorroOpen(false);
        onDataUpdated();
      } else {
        toast.error('Error al ajustar el ahorro.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión.');
    } finally {
      setLoadingAjustarAhorro(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Triada de Liquidez: 3 Tarjetas Maestras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NIVEL 1: Dinero Total Líquido */}
        <div className="ss-card p-5 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl ss-inset flex items-center justify-center text-slate-300 border border-white/5">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-spell tracking-wider uppercase text-slate-400 block font-semibold">
                  Nivel 1 · Patrimonio Líquido
                </span>
                <h4 className="font-runic font-bold text-base text-slate-200">
                  Dinero Total en Caja / Banco
                </h4>
              </div>
            </div>

            <button
              onClick={() => {
                setNuevoSaldoTotal(dineroTotal.toString());
                setModalSaldoOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
              title="Ajustar dinero total"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-spell font-extrabold text-white">
              {formatPEN(dineroTotal)}
            </div>
            <p className="text-xs text-slate-400 font-spell mt-1">
              Efectivo físico en billetera + saldo en cuentas digitales (BCP, Interbank, etc.).
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-spell">
            <span>Incluye fondo blindado</span>
            <button
              onClick={() => {
                setNuevoSaldoTotal(dineroTotal.toString());
                setModalSaldoOpen(true);
              }}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Editar Monto</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* NIVEL 2: Ahorro Blindado Intocable (Sin Techo) */}
        <div className="ss-card p-5 border border-amber-500/30 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4 bg-gradient-to-b from-amber-950/10 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-spell tracking-wider uppercase text-amber-400 block font-semibold">
                  Nivel 2 · Bóveda Intocable
                </span>
                <h4 className="font-runic font-bold text-base text-amber-200 flex items-center gap-1.5">
                  Ahorro Blindado
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    SIN TECHO
                  </span>
                </h4>
              </div>
            </div>

            <button
              onClick={() => {
                setNuevoAhorroTotal(ahorroBlindado.toString());
                setModalAjustarAhorroOpen(true);
              }}
              className="p-1.5 rounded-lg text-amber-400/70 hover:text-amber-300 hover:bg-white/5 transition-colors"
              title="Ajustar total de ahorro blindado"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-spell font-extrabold text-amber-400">
              {formatPEN(ahorroBlindado)}
            </div>
            <p className="text-xs text-amber-200/70 font-spell mt-1">
              Dinero sagrado acumulado. <strong>No se toca</strong> ni se computa para gasto diario.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMontoApartar('100');
                setModalApartarOpen(true);
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-spell font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apartar a Ahorro</span>
            </button>
          </div>
        </div>

        {/* NIVEL 3: Dinero Operativo Disponible para Gasto */}
        <div className="ss-card p-5 border border-cyan-500/40 rounded-2xl relative overflow-hidden flex flex-col justify-between space-y-4 ss-glow-cyan bg-gradient-to-b from-cyan-950/20 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-spell tracking-wider uppercase text-cyan-400 block font-semibold">
                  Nivel 3 · Fondo Operativo
                </span>
                <h4 className="font-runic font-bold text-base text-cyan-200">
                  Disponible para Gasto
                </h4>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Caja Libre
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-spell font-extrabold text-cyan-400">
              {formatPEN(dineroDisponibleGasto)}
            </div>
            <p className="text-xs text-cyan-200/70 font-spell mt-1">
              Total ({formatPEN(dineroTotal)}) − Ahorro ({formatPEN(ahorroBlindado)}). Monto real utilizable para pagar fijos, comidas y salidas.
            </p>
          </div>

          <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-300/80 font-spell">
            <span>Base para Daily Safe Spend</span>
            <span className="font-bold text-cyan-300">Margen Blindado</span>
          </div>
        </div>
      </div>

      {/* Modal 1: Ajustar Dinero Total */}
      {modalSaldoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-sm w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-slate-100 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Ajustar Dinero Total en Caja
              </h4>
              <button
                onClick={() => setModalSaldoOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-spell"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSaldoTotal} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-slate-300 block mb-1">
                  Monto total real que posees hoy (S/)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-spell text-slate-400 font-bold">
                    S/
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={nuevoSaldoTotal}
                    onChange={(e) => setNuevoSaldoTotal(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white font-spell font-bold text-base focus:outline-none focus:border-emerald-400"
                    placeholder="3826.86"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-spell">
                  Suma todo tu efectivo físico y tus cuentas bancarias actuales.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalSaldoOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl ss-btn text-xs font-spell text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingSaldo}
                  className="w-2/3 py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-center gap-1.5"
                >
                  {loadingSaldo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar Saldo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Apartar a Ahorro Blindado Intocable */}
      {modalApartarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-sm w-full p-6 ss-card border border-amber-500/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-amber-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Apartar a Ahorro Blindado
              </h4>
              <button
                onClick={() => setModalApartarOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-spell"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApartarAhorro} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-slate-300 block mb-1">
                  ¿Cuánto dinero deseas apartar al ahorro intocable?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-spell text-amber-400 font-bold">
                    S/
                  </span>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    required
                    value={montoApartar}
                    onChange={(e) => setMontoApartar(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl ss-inset border border-amber-500/30 text-white font-spell font-bold text-base focus:outline-none focus:border-amber-400"
                    placeholder="100.00"
                    autoFocus
                  />
                </div>

                {/* Chips de montos rápidos */}
                <div className="flex gap-2 mt-2">
                  {['50', '100', '200', '500'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setMontoApartar(chip)}
                      className="px-2.5 py-1 rounded-lg ss-inset text-xs font-spell text-amber-300 hover:border-amber-400 border border-white/5 transition-colors"
                    >
                      +S/ {chip}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-amber-200/70 mt-2 font-spell">
                  Este monto se sumará a tu bóveda intocable y se restará automáticamente del dinero disponible para gastar.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalApartarOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl ss-btn text-xs font-spell text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingApartar}
                  className="w-2/3 py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-amber-300 border border-amber-500/40 hover:border-amber-400 flex items-center justify-center gap-1.5"
                >
                  {loadingApartar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Apartar Ahora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Ajustar Bóveda de Ahorro Directamente */}
      {modalAjustarAhorroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-sm w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Ajustar Total en Bóveda
              </h4>
              <button
                onClick={() => setModalAjustarAhorroOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-spell"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAjustarAhorroTotal} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-slate-300 block mb-1">
                  Monto acumulado exacto del Ahorro Blindado (S/)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-spell text-slate-400 font-bold">
                    S/
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={nuevoAhorroTotal}
                    onChange={(e) => setNuevoAhorroTotal(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white font-spell font-bold text-base focus:outline-none focus:border-amber-400"
                    placeholder="1500.00"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-spell">
                  Usa esto si necesitas sincronizar el balance total acumulado en tu bóveda de ahorro.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAjustarAhorroOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl ss-btn text-xs font-spell text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingAjustarAhorro}
                  className="w-2/3 py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-amber-300 border border-amber-500/40 hover:border-amber-400 flex items-center justify-center gap-1.5"
                >
                  {loadingAjustarAhorro ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Actualizar Bóveda</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
