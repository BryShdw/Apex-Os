'use client';

import React from 'react';
import { formatPEN, formatDate } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, AlertCircle, ShoppingBag } from 'lucide-react';

interface Transaccion {
  id: number;
  tipo: string;
  monto: any;
  fecha: any;
  descripcion: string;
  metodoPago: string;
  esGastoHormiga: boolean;
  categoria: {
    nombre: string;
    colorHex: string;
    icono: string;
  };
}

interface Props {
  transacciones: Transaccion[];
}

export const TransactionList: React.FC<Props> = ({ transacciones }) => {
  return (
    <div className="ss-card p-6 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-ss-cyan" />
          Libro de Movimientos Recientes
        </h3>
        <span className="text-xs text-gray-500 font-spell">
          {transacciones.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[11px] font-spell text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Fecha</th>
              <th className="pb-3">Descripción</th>
              <th className="pb-3">Categoría</th>
              <th className="pb-3">Método</th>
              <th className="pb-3 text-right pr-2">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-xs font-ui">
            {transacciones.map((t) => {
              const isIngreso = t.tipo === 'INGRESO';
              const montoNum = Number(t.monto);

              return (
                <tr key={t.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-3 pl-2 font-spell text-gray-400 whitespace-nowrap">
                    {formatDate(t.fecha)}
                  </td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-ss-silver font-medium group-hover:text-white">
                        {t.descripcion}
                      </span>
                      {t.esGastoHormiga && (
                        <span className="text-[10px] font-spell px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                          🐜 Hormiga
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-spell"
                      style={{
                        backgroundColor: `${t.categoria.colorHex}15`,
                        color: t.categoria.colorHex,
                        border: `1px solid ${t.categoria.colorHex}30`,
                      }}
                    >
                      {t.categoria.nombre}
                    </span>
                  </td>
                  <td className="py-3 font-spell text-gray-400 text-[11px] whitespace-nowrap">
                    {t.metodoPago.replace('_', ' ')}
                  </td>
                  <td className="py-3 text-right pr-2 font-spell font-bold whitespace-nowrap">
                    <span className={isIngreso ? 'text-emerald-400' : 'text-gray-300'}>
                      {isIngreso ? '+' : '-'} {formatPEN(montoNum)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
