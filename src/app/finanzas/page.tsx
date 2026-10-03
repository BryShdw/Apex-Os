'use client';

import React, { useEffect, useState } from 'react';
import { LiquidityVaultHeader } from '@/components/finanzas/LiquidityVaultHeader';
import { DailySafeSpendCard } from '@/components/finanzas/DailySafeSpendCard';
import { QuickExpenseBar } from '@/components/finanzas/QuickExpenseBar';
import { FixedObligationsCard } from '@/components/finanzas/FixedObligationsCard';
import { BudgetModulesManager } from '@/components/finanzas/BudgetModulesManager';
import { TransactionModal } from '@/components/finanzas/TransactionModal';
import { TransactionList } from '@/components/finanzas/TransactionList';
import { GoalsManager } from '@/components/finanzas/GoalsManager';
import { formatPEN } from '@/lib/utils';
import {
  Plus,
  Wallet,
  ShieldCheck,
  HeartHandshake,
  Bus,
  Smartphone,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export default function FinanzasPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'control' | 'modulos' | 'metas' | 'historial'>('control');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/finanzas');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-ss-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-spell text-gray-400">Cargando Bóveda Financiera...</span>
        </div>
      </div>
    );
  }

  const { usuario, presupuesto, resumen, transacciones, categorias, metas } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver tracking-wide">
            Bóveda & Control <span className="text-ss-cyan">Financiero Total</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Control de caja real, ahorro blindado intocable (sin techo), monitoreo visual y registro rápido de 1 clic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl ss-btn text-gray-400 hover:text-white"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setModalTxOpen(true)}
            className="ss-btn px-5 py-2.5 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan flex items-center gap-2 ss-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Movimiento</span>
          </button>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('control')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'control'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⚡ Control Diario & Caja
        </button>
        <button
          onClick={() => setActiveTab('modulos')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'modulos'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⚙️ Módulos de Gasto (Visual)
        </button>
        <button
          onClick={() => setActiveTab('metas')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'metas'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎯 Grimorio de Metas ({metas.length})
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'historial'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📜 Historial de Transacciones ({transacciones.length})
        </button>
      </div>

      {/* PESTAÑA 1: Control Diario & Caja (Centro Operativo Total) */}
      {activeTab === 'control' && (
        <div className="space-y-6">
          {/* 1. Triada de Liquidez: Dinero Total, Ahorro Blindado Intocable, Dinero Operativo */}
          <LiquidityVaultHeader
            dineroTotal={usuario.dineroTotal}
            ahorroBlindado={usuario.ahorroBlindado}
            dineroDisponibleGasto={usuario.dineroDisponibleGasto}
            onDataUpdated={fetchData}
          />

          {/* 2. Métrica Maestra de Daily Safe Spend */}
          <DailySafeSpendCard resumen={resumen} />

          {/* 3. Barra de Registro Rápido (1 Clic) para Antojos, Dulces y Comidas */}
          <QuickExpenseBar onExpenseAdded={fetchData} />

          {/* 4. Compromisos Fijos & Obligaciones del Mes (Checklist de Pagos) */}
          <FixedObligationsCard
            categoriasFijas={categorias.filter((c: any) => c.tipo === 'FIJO')}
            fijoApoyoCasa={presupuesto.fijoApoyoCasa}
            fijoMovil={presupuesto.fijoMovil}
            fijoTransporte={presupuesto.fijoTransporte}
            onPaymentSuccess={fetchData}
          />

          {/* 5. Lista Breve de Transacciones Recientes del Día */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-runic font-bold text-lg text-ss-silver">
                Últimos Movimientos del Día
              </h3>
              <button
                onClick={() => setActiveTab('historial')}
                className="text-xs font-spell text-ss-cyan hover:underline"
              >
                Ver todos ({transacciones.length}) →
              </button>
            </div>
            <TransactionList transacciones={transacciones.slice(0, 6)} />
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Módulos de Presupuesto (100% Visual e Informativo) */}
      {activeTab === 'modulos' && (
        <BudgetModulesManager
          categorias={categorias}
          onDataUpdated={fetchData}
        />
      )}

      {/* PESTAÑA 3: Metas SMART */}
      {activeTab === 'metas' && (
        <GoalsManager metas={metas} onMetasUpdated={fetchData} />
      )}

      {/* PESTAÑA 4: Historial Completo de Transacciones */}
      {activeTab === 'historial' && (
        <TransactionList transacciones={transacciones} />
      )}

      {/* Modal de Transacción General */}
      <TransactionModal
        isOpen={modalTxOpen}
        onClose={() => setModalTxOpen(false)}
        presupuestoId={presupuesto.id}
        categorias={categorias}
        metas={metas}
        onTransactionAdded={fetchData}
      />
    </div>
  );
}
