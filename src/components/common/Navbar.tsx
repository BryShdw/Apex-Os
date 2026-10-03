'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Wallet,
  Dumbbell,
  Sparkles,
  Shield,
  Moon,
  Bot,
  Palette,
  HelpCircle,
  X,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [showManualModal, setShowManualModal] = useState(false);

  const navItems = [
    { href: '/', label: 'Nexo Central', icon: Compass },
    { href: '/finanzas', label: 'Finanzas & Metas', icon: Wallet },
    { href: '/fitness', label: 'Calistenia', icon: Dumbbell },
    { href: '/cuidado', label: 'Skin Care', icon: Sparkles },
    { href: '/dibujo', label: 'Taller Dibujo', icon: Palette },
    { href: '/oraculo', label: 'Oráculo IA', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#15181e]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Runic Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl ss-card flex items-center justify-center border border-ss-cyan/30 group-hover:border-ss-cyan transition-all group-hover:ss-glow-cyan">
            <Shield className="w-5 h-5 text-ss-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-runic font-bold text-lg tracking-wider text-ss-silver group-hover:text-white">
                APEX <span className="text-ss-cyan">OS</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full ss-inset font-spell text-ss-cyan border border-ss-cyan/20">
                v1.2
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-spell tracking-tight">Centro de Mando de Brayan</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-spell font-medium transition-all',
                  isActive
                    ? 'ss-btn-active font-bold text-ss-cyan'
                    : 'ss-btn text-gray-300 hover:text-white hover:border-white/10'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-ss-cyan' : 'text-gray-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pills & Guía de Uso */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl ss-btn border border-white/5 text-xs font-spell text-gray-300 hover:text-ss-cyan hover:border-ss-cyan/30 transition-all"
            title="Abrir Manual de Uso"
          >
            <HelpCircle className="w-3.5 h-3.5 text-ss-cyan" />
            <span className="hidden sm:inline">Guía de Uso</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ss-inset border border-white/5 text-xs font-spell text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MySQL 8.0</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl ss-card border border-ss-purple/30 text-xs font-spell text-ss-purple">
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ancla:</span> 22:50
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121419]/95 backdrop-blur-lg border-t border-white/5 py-2 px-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[9px] font-medium transition-all',
                isActive ? 'text-ss-cyan font-bold' : 'text-gray-400 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Modal Guía Rápida de Uso */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full flex flex-col max-h-[88vh] bg-[#12161f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Fijo */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161c27]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-runic font-bold text-base sm:text-lg text-slate-100">
                    Manual de Operaciones · Apex OS
                  </h3>
                  <span className="text-xs text-slate-400">Guía práctica y reglas de cada módulo del sistema</span>
                </div>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Contenido con Scroll Suave */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-ui text-slate-300">
              {/* Sección 1: Nexo Central */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-cyan-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">01</span>
                  <span className="font-spell font-bold text-cyan-300 text-sm">Nexo Central (Dashboard)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Visión general en tiempo real: nivel de energía, hábito de sueño sagrado (22:50 PM), racha semanal y accesos directos a todos los módulos.
                </p>
              </div>

              {/* Sección 2: Finanzas */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">02</span>
                  <span className="font-spell font-bold text-emerald-300 text-sm">Finanzas · Bóveda & Control de Caja Real</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p className="leading-relaxed">
                    <strong className="text-white">Triada de Liquidez:</strong> Monitorea tu <strong className="text-emerald-300">Dinero Total Líquido</strong>, tu <strong className="text-amber-300">🛡️ Ahorro Blindado Intocable (sin techo)</strong>, y el <strong className="text-cyan-300">⚡ Dinero Operativo Disponible</strong> para gasto real.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Control Diario & Caja (Pestaña 1):</strong> Es el centro operativo de registro. Usa los botones rápidos (1 clic) para registrar almuerzos, empanadas, café o agua; o anota ingresos, gastos personalizados y pago de obligaciones fijas (Apoyo Casa S/ 500, Plan S/ 28, etc.).
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Módulos de Gasto (Pestaña 2):</strong> Tablero 100% visual de monitoreo. Solo refleja el presupuesto asignado, cuánto has gastado en el mes y cuánto margen te queda antes de tocar el tope.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">Daily Safe Spend:</strong> Te indica exactamente cuánto puedes gastar por día sin arriesgar tus reservas intocables.
                  </p>
                </div>
              </div>

              {/* Sección 3: Skin Care */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">03</span>
                  <span className="font-spell font-bold text-amber-300 text-sm">Skin Care · Inventario Cutáneo</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Rutinas AM y PM generadas automáticamente a partir de tus productos marcados como &quot;En Uso&quot;. Puedes agregar nuevos productos (marca, categoría, paso y orden) o pausar los que ya no uses. Sin fotografías innecesarias.
                </p>
              </div>

              {/* Sección 4: Taller de Dibujo */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-purple-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">04</span>
                  <span className="font-spell font-bold text-purple-300 text-sm">Taller de Dibujo · Práctica & Fundamentos</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Cronómetro interactivo con presets (15m, 30m, 45m, 60m) para práctica deliberada, registro con calificación por estrellas, banco de ideas categorizadas (anatomía, manos, estilo manhwa) y biblioteca de fundamentos visuales.
                </p>
              </div>

              {/* Sección 5: Calistenia */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-rose-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">05</span>
                  <span className="font-spell font-bold text-rose-300 text-sm">Calistenia & Postura</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Entrenamiento semanal estructurado (Rutina A: Tirón/Espalda/Bíceps; Rutina B: Empuje/Pecho/Tríceps; Rutina C: Core y Piernas) con registro de repeticiones y verificación de progresión.
                </p>
              </div>

              {/* Sección 6: Oráculo IA */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">06</span>
                  <span className="font-spell font-bold text-blue-300 text-sm">Oráculo IA (Gemini Studio)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Auditoría financiera inteligente que analiza tus gastos hormiga y fugas de capital, y asistente para recomendar ajustes en tus entrenamientos según tu nivel de fatiga.
                </p>
              </div>

              {/* Sección 7: Encendido y Apagado */}
              <div className="p-4 rounded-xl bg-[#161b24] border border-slate-700/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/40 text-slate-300 border border-slate-600/30">07</span>
                  <span className="font-spell font-bold text-slate-200 text-sm">Operación del Sistema (.bat)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Usa los accesos directos en tu Escritorio: <code className="text-cyan-400 font-mono bg-cyan-950/40 px-1 py-0.5 rounded">Iniciar_ApexOS.bat</code> para encender el servidor y abrir el navegador, <code className="text-cyan-400 font-mono bg-cyan-950/40 px-1 py-0.5 rounded">Apagar_ApexOS.bat</code> para cerrarlo limpiamente, y <code className="text-cyan-400 font-mono bg-cyan-950/40 px-1 py-0.5 rounded">Backup_ApexOS.bat</code> para generar un volcado SQL íntegro con fecha y hora.
                </p>
              </div>
            </div>

            {/* Footer Fijo */}
            <div className="px-6 py-3 border-t border-white/10 bg-[#161c27] flex items-center justify-end">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
