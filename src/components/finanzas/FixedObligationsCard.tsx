'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Smartphone,
  Bus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatPEN } from '@/lib/utils';
import { toast } from '@/components/common/Toast';

export interface CategoriaFija {
  id: number;
  nombre: string;
  tipo: string;
  presupuestoEstimado: number | null;
  totalGastado?: number;
  estaPagado?: boolean;
  esAporteHogar?: boolean;
}

interface Props {
  categoriasFijas: CategoriaFija[];
  fijoApoyoCasa?: number;
  fijoMovil?: number;
  fijoTransporte?: number;
  onPaymentSuccess: () => void;
}

export const FixedObligationsCard: React.FC<Props> = ({
  categoriasFijas,
  fijoApoyoCasa = 500,
  fijoMovil = 28,
  fijoTransporte = 120,
  onPaymentSuccess,
}) => {
  const [loadingCatId, setLoadingCatId] = useState<number | null>(null);

  // Helper icons
  const getIcon = (nombre: string, esAporteHogar?: boolean) => {
    if (esAporteHogar || nombre.toLowerCase().includes('casa') || nombre.toLowerCase().includes('familia')) {
      return <HeartHandshake className="w-5 h-5 text-rose-400" />;
    }
    if (nombre.toLowerCase().includes('móvil') || nombre.toLowerCase().includes('celular') || nombre.toLowerCase().includes('plan')) {
      return <Smartphone className="w-5 h-5 text-yellow-400" />;
    }
    if (nombre.toLowerCase().includes('transporte') || nombre.toLowerCase().includes('pasaje')) {
      return <Bus className="w-5 h-5 text-blue-400" />;
    }
    return <ShieldCheck className="w-5 h-5 text-slate-300" />;
  };

  const handlePayFixed = async (cat: CategoriaFija) => {
    const monto = cat.presupuestoEstimado || 0;
    if (monto <= 0) {
      toast.error('Este compromiso no tiene un monto asignado.');
      return;
    }

    if (!confirm(`¿Confirmas el pago de ${formatPEN(monto)} para "${cat.nombre}"?\nSe registrará como gasto y se descontará de tu caja.`)) {
      return;
    }

    setLoadingCatId(cat.id);
    try {
      const res = await fetch('/api/finanzas/rapido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: `Pago mensual: ${cat.nombre}`,
          monto,
          categoriaNombre: cat.nombre,
          esAntojo: false,
          esComidaDiaria: false,
          metodoPago: 'TRANSFERENCIA',
        }),
      });

      if (res.ok) {
        toast.success(`✓ Pago de ${formatPEN(monto)} registrado para "${cat.nombre}".`);
        onPaymentSuccess();
      } else {
        toast.error('No se pudo registrar el pago.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error de conexión al registrar pago.');
    } finally {
      setLoadingCatId(null);
    }
  };

  const totalPresupuestadoFijo = categoriasFijas.reduce(
    (acc, c) => acc + (c.presupuestoEstimado ? Number(c.presupuestoEstimado) : 0),
    0
  );

  const totalPagadoFijo = categoriasFijas.reduce(
    (acc, c) => acc + (c.totalGastado ? Number(c.totalGastado) : 0),
    0
  );

  return (
    <div className="ss-card p-6 border border-white/10 rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ss-inset flex items-center justify-center text-rose-400 border border-white/5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-runic font-bold text-lg text-slate-100 flex items-center gap-2">
              Compromisos Fijos & Obligaciones del Mes
            </h3>
            <p className="text-xs text-slate-400 font-spell">
              Registra el pago de compromisos innegociables para deducirlos de tu caja real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-spell">
          <span className="text-slate-400">Total Fijos:</span>
          <span className="font-bold text-slate-200">{formatPEN(totalPagadoFijo)}</span>
          <span className="text-slate-500">/ {formatPEN(totalPresupuestadoFijo)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {categoriasFijas.map((cat) => {
          const tope = cat.presupuestoEstimado ? Number(cat.presupuestoEstimado) : 0;
          const gastado = cat.totalGastado || 0;
          const estaPagado = cat.estaPagado || (tope > 0 && gastado >= tope);
          const isLoading = loadingCatId === cat.id;

          return (
            <div
              key={cat.id}
              className={`p-4 rounded-xl ss-inset border transition-all flex flex-col justify-between space-y-3 ${
                estaPagado
                  ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg ss-card flex items-center justify-center border border-white/5">
                    {getIcon(cat.nombre, cat.esAporteHogar)}
                  </div>
                  <div>
                    <h4 className="font-spell font-bold text-sm text-white truncate max-w-[160px]">
                      {cat.nombre}
                    </h4>
                    <span className="text-[11px] font-spell text-slate-400 block">
                      Tope: {formatPEN(tope)}
                    </span>
                  </div>
                </div>

                {estaPagado ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-spell font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Pagado</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-spell font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Pendiente</span>
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-spell text-slate-400">
                  Registrado: <strong className="text-slate-200">{formatPEN(gastado)}</strong>
                </span>

                {!estaPagado && tope > 0 && (
                  <button
                    disabled={isLoading}
                    onClick={() => handlePayFixed(cat)}
                    className="px-3 py-1.5 rounded-lg ss-btn text-xs font-spell font-bold text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pagar {formatPEN(tope)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
