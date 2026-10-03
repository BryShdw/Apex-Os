'use client';

import React, { useState } from 'react';
import { formatPEN } from '@/lib/utils';
import { Sparkles, AlertTriangle, ShieldCheck, TrendingDown, Clock, Bot } from 'lucide-react';

interface Props {
  resumen: {
    totalIngresos: number;
    totalGastos: number;
    balanceActual: number;
    gastosFijosTotal: number;
    gastosVariablesTotal: number;
    presupuestoVariableMax: number;
    margenVariableRestante: number;
    diasRestantes: number;
    gastoDiarioSeguro: number;
    totalGastosHormiga: number;
    conteoGastosHormiga: number;
  };
  onAuditCompleted?: (data: any) => void;
}

export const DailySafeSpendCard: React.FC<Props> = ({ resumen, onAuditCompleted }) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const handleAudit = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ia/auditar-finanzas', { method: 'POST' });
      const data = await res.json();
      setAiReport(data);
      if (onAuditCompleted) onAuditCompleted(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const getAlertColor = () => {
    if (resumen.gastoDiarioSeguro > 25) return 'text-ss-cyan border-ss-cyan/30 ss-glow-cyan';
    if (resumen.gastoDiarioSeguro > 15) return 'text-ss-gold border-ss-gold/30 ss-glow-gold';
    return 'text-ss-crimson border-ss-crimson/30 ss-glow-crimson';
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Principal de Daily Safe Spend */}
      <div className="ss-card p-6 md:p-8 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-ss-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-spell text-ss-cyan tracking-wider px-2.5 py-1 rounded-md ss-inset border border-ss-cyan/20">
                Métrica Maestra de Control
              </span>
              <span className="text-xs text-gray-400 font-spell">
                {resumen.diasRestantes} días restantes del mes
              </span>
            </div>
            <h2 className="font-runic text-2xl md:text-3xl font-bold text-ss-silver">
              Gasto Diario Seguro
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-lg">
              El límite diario para no comprometer tus S/ 500 de apoyo en casa ni tus metas de ahorro.
            </p>
          </div>

          {/* Cifra Central con Resplandor */}
          <div className={`p-6 rounded-2xl ss-inset border flex flex-col items-center justify-center min-w-[220px] transition-all ${getAlertColor()}`}>
            <span className="text-xs uppercase tracking-widest font-spell text-gray-400 mb-1">
              Disponible por Día
            </span>
            <div className="font-spell font-extrabold text-3xl md:text-4xl">
              {formatPEN(resumen.gastoDiarioSeguro)}
            </div>
            <span className="text-[11px] font-spell text-gray-400 mt-1">
              Restante: {formatPEN(resumen.margenVariableRestante)}
            </span>
          </div>
        </div>

        {/* 4 Mini Métricas Secundarias */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[11px] font-spell text-gray-400 block mb-1">Ingresos Registrados</span>
            <span className="font-spell font-bold text-emerald-400 text-lg">
              {formatPEN(resumen.totalIngresos)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[11px] font-spell text-gray-400 block mb-1">Gastos Fijos Blindados</span>
            <span className="font-spell font-bold text-ss-crimson text-lg">
              {formatPEN(resumen.gastosFijosTotal)}
            </span>
            <span className="text-[10px] text-gray-500 block">S/ 500 casa + transporte</span>
          </div>

          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[11px] font-spell text-gray-400 block mb-1">Fugas Gasto Hormiga</span>
            <span className="font-spell font-bold text-amber-400 text-lg">
              {formatPEN(resumen.totalGastosHormiga)}
            </span>
            <span className="text-[10px] text-gray-500 block">{resumen.conteoGastosHormiga} transacciones</span>
          </div>

          <div className="p-3.5 rounded-xl ss-inset">
            <span className="text-[11px] font-spell text-gray-400 block mb-1">Balance Operativo</span>
            <span className="font-spell font-bold text-ss-cyan text-lg">
              {formatPEN(resumen.balanceActual)}
            </span>
            <span className="text-[10px] text-gray-500 block">Neto en caja</span>
          </div>
        </div>

        {/* Botón de Auditoría IA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAudit}
            disabled={loadingAI}
            className="ss-btn px-5 py-2.5 rounded-xl text-xs font-spell text-ss-gold border border-ss-gold/30 hover:border-ss-gold flex items-center gap-2 group transition-all"
          >
            <Bot className={`w-4 h-4 ${loadingAI ? 'animate-spin text-ss-gold' : 'text-ss-gold group-hover:scale-110'}`} />
            <span>{loadingAI ? 'Consultando a Gemini 2.5...' : 'Ejecutar Auditoría Financiera con IA'}</span>
          </button>
        </div>
      </div>

      {/* Modal / Reporte Desplegable de IA */}
      {aiReport && (
        <div className="ss-card p-6 border border-ss-gold/40 ss-glow-gold relative animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-runic font-bold text-lg text-ss-silver">
                Auditoría Estratégica Gemini
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-spell font-bold ${
              aiReport.nivelAlerta === 'ROJO' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              aiReport.nivelAlerta === 'AMBAR' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              Alerta: {aiReport.nivelAlerta}
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-4 bg-black/20 p-3 rounded-xl border border-white/5 font-ui">
            {aiReport.diagnostico}
          </p>

          <div className="space-y-2 mb-4">
            <h4 className="text-xs uppercase font-spell text-ss-gold tracking-wider">Recomendaciones Clave:</h4>
            {aiReport.recomendaciones?.map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                <span className="text-ss-gold font-bold font-spell">#{i + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-spell">
            <span className="italic">"{aiReport.mensajeMotivacional}"</span>
            <button
              onClick={() => setAiReport(null)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
