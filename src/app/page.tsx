'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPEN } from '@/lib/utils';
import {
  Compass,
  Moon,
  Droplets,
  Sparkles,
  Dumbbell,
  Wallet,
  ShieldCheck,
  CheckCircle,
  Plus,
  ArrowRight,
  RefreshCw,
  Clock,
  Target,
  Palette
} from 'lucide-react';

export default function DashboardPage() {
  const [dataFinanzas, setDataFinanzas] = useState<any>(null);
  const [dataFitness, setDataFitness] = useState<any>(null);
  const [dataHabitos, setDataHabitos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdownSleep, setCountdownSleep] = useState('');

  const fetchAll = async () => {
    try {
      const [resFin, resFit, resHab] = await Promise.all([
        fetch('/api/finanzas'),
        fetch('/api/fitness'),
        fetch('/api/habitos'),
      ]);
      const [jsonFin, jsonFit, jsonHab] = await Promise.all([
        resFin.json(),
        resFit.json(),
        resHab.json(),
      ]);
      setDataFinanzas(jsonFin);
      setDataFitness(jsonFit);
      setDataHabitos(jsonHab.habit);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    // Cuenta regresiva a las 22:50 PM
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(22, 50, 0, 0);

      let diff = target.getTime() - now.getTime();
      if (diff < 0) {
        // Si ya pasó las 22:50, calcular para mañana
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdownSleep(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Actualizar un hábito rápido
  const updateHabito = async (patch: any) => {
    if (!dataHabitos) return;
    const nuevo = { ...dataHabitos, ...patch };
    setDataHabitos(nuevo);

    try {
      await fetch('/api/habitos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addWater = () => {
    const actual = Number(dataHabitos?.litrosAgua || 0);
    const nuevo = Math.min(4.0, Number((actual + 0.25).toFixed(2)));
    updateHabito({ litrosAgua: nuevo });
  };

  const addPausaPostura = () => {
    const actual = Number(dataHabitos?.pausasPostura || 0);
    updateHabito({ pausasPostura: actual + 1 });
  };

  if (loading || !dataFinanzas || !dataFitness) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-ss-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-spell text-gray-400">Sincronizando Nexo Central con MySQL...</span>
        </div>
      </div>
    );
  }

  const { resumen, metas } = dataFinanzas;
  const { today } = dataFitness;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header con Bienvenida y Estado del Día */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-spell px-2.5 py-0.5 rounded-full ss-inset text-ss-cyan border border-ss-cyan/20">
              {today.tipo === 'A' ? 'Día Tipo A: Universidad' : today.tipo === 'B' ? 'Día Tipo B: Calistenia & Crestron' : 'Fin de Semana'}
            </span>
            <span className="text-xs text-gray-400 font-spell">Lima, Perú</span>
          </div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver">
            Saludos, <span className="text-ss-cyan">Brayan</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Tu centro de operaciones para físico, postura, finanzas y descanso.
          </p>
        </div>

        <button
          onClick={fetchAll}
          className="p-2.5 rounded-xl ss-btn text-gray-400 hover:text-white"
          title="Recargar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Banner de Ancla Sagrada (Sueño 7h) & Gasto Diario Seguro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ancla Sagrada del Sueño */}
        <div className="ss-card p-6 border border-ss-purple/30 relative overflow-hidden group hover:ss-glow-purple transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl ss-inset flex items-center justify-center text-ss-purple">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-runic font-bold text-lg text-ss-silver">
                  Ancla Sagrada (Sueño 7h)
                </h3>
                <span className="text-[11px] font-spell text-gray-400">Hora límite: 22:50 PM</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-spell text-gray-400 block">Faltan</span>
              <span className="font-spell font-extrabold text-xl text-ss-purple">
                {countdownSleep || 'calculando...'}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-ui mb-4">
            Dormir a tiempo resuelve el 80% de las ojeras, fatiga cognitiva y acelera la hipertrofia magra.
          </p>

          <div className="p-3 rounded-xl ss-inset flex items-center justify-between text-xs font-spell">
            <span className="text-gray-400">Anoche dormiste:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="3"
                max="12"
                value={Number(dataHabitos?.horasSueno || 7)}
                onChange={(e) => updateHabito({ horasSueno: parseFloat(e.target.value) || 7 })}
                className="w-14 bg-[#15181e] text-center font-spell font-bold text-ss-purple rounded px-1 py-0.5 border border-white/5"
              />
              <span className="text-gray-300">horas (Calidad: {dataHabitos?.calidadSueno || 8}/10)</span>
            </div>
          </div>
        </div>

        {/* Gasto Diario Seguro Mini Card */}
        <div className="ss-card p-6 border border-ss-cyan/30 relative overflow-hidden group hover:ss-glow-cyan transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl ss-inset flex items-center justify-center text-ss-cyan">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-runic font-bold text-lg text-ss-silver">
                  Gasto Diario Seguro
                </h3>
                <span className="text-[11px] font-spell text-gray-400">{resumen.diasRestantes} días restantes</span>
              </div>
            </div>

            <Link
              href="/finanzas"
              className="text-xs font-spell text-ss-cyan hover:underline flex items-center gap-1"
            >
              Ver Bóveda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-spell font-extrabold text-3xl text-ss-cyan">
              {formatPEN(resumen.gastoDiarioSeguro)}
            </span>
            <span className="text-xs text-gray-400 font-spell">/ día disponible</span>
          </div>

          <div className="w-full h-2 rounded-full ss-inset overflow-hidden p-0.5 mb-3">
            <div
              className="h-full rounded-full bg-ss-cyan"
              style={{
                width: `${Math.min(100, Math.round((resumen.margenVariableRestante / (resumen.presupuestoVariableMax || 1)) * 100))}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-spell text-gray-400">
            <span>Restante: {formatPEN(resumen.margenVariableRestante)}</span>
            <span>Apoyo Casa S/ 500: <strong className="text-ss-crimson">Protegido</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Módulo Central: Rutina del Día & Checklist de Hábitos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rutina de Hoy (2 columnas en desktop) */}
        <div className="lg:col-span-2 ss-card p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-gold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-runic font-bold text-lg text-ss-silver">
                  Foco Físico de Hoy
                </h3>
                <span className="text-[10px] font-spell text-gray-400">{today.desc}</span>
              </div>
            </div>

            <Link
              href="/fitness"
              className="ss-btn px-4 py-1.5 rounded-xl text-xs font-spell text-ss-cyan border border-ss-cyan/20 flex items-center gap-1.5"
            >
              <span>Abrir Calistenia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {today.rutina ? (
            <div className="p-4 rounded-xl ss-inset border border-ss-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-runic font-bold text-ss-silver text-base">
                  {today.rutina.nombre}
                </span>
                <span className="text-[10px] font-spell px-2 py-0.5 rounded bg-ss-gold/10 text-ss-gold border border-ss-gold/30">
                  Enfoque Calistenia
                </span>
              </div>
              <p className="text-xs text-gray-300 font-ui">
                {today.rutina.descripcion}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-spell text-gray-400">
                <span className="px-2 py-1 rounded bg-white/[0.03] border border-white/5">Dominadas Pronas</span>
                <span className="px-2 py-1 rounded bg-white/[0.03] border border-white/5">Fondos en Paralelas</span>
                <span className="px-2 py-1 rounded bg-white/[0.03] border border-white/5">Flexiones Declinadas</span>
                <span className="px-2 py-1 rounded bg-white/[0.03] border border-ss-cyan/20 text-ss-cyan">Chin Tucks (Cuello)</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl ss-inset text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-runic font-bold text-base text-ss-silver">Día de Clases Universitarias</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Tu prioridad hoy es trabajo AV + Universidad (19:30 - 22:30). Cero culpas por no entrenar en barra. Descansa a las 22:50.
              </p>
            </div>
          )}

          {/* Recordatorio de Fricción Móvil */}
          <div className="p-3.5 rounded-xl ss-inset flex items-center justify-between text-xs font-spell text-gray-300 border border-amber-500/20">
            <span className="flex items-center gap-2">
              <span>🛡️ Regla Anti-Procrastinación:</span>
              <span className="text-gray-400">Teléfono a más de 2 metros durante horas de estudio y descanso</span>
            </span>
          </div>
        </div>

        {/* Checklist Rápido de Hábitos (1 columna) */}
        <div className="ss-card p-6 border border-white/5 space-y-4">
          <h3 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ss-cyan" />
            Checklist Diario
          </h3>

          <div className="space-y-3">
            {/* Hidratación (Meta 2.5L) */}
            <div className="p-3.5 rounded-xl ss-inset space-y-2">
              <div className="flex justify-between items-center text-xs font-spell">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-ss-cyan" />
                  Agua (Meta 2.5L)
                </span>
                <span className="text-ss-cyan font-bold">{dataHabitos?.litrosAgua || 0} L</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={addWater}
                  className="ss-btn w-full py-1.5 rounded-lg text-xs font-spell text-ss-cyan border border-ss-cyan/20 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> +250 ml
                </button>
              </div>
            </div>

            {/* Skincare AM */}
            <div
              onClick={() => updateHabito({ skincareAm: !dataHabitos?.skincareAm })}
              className={`p-3 rounded-xl ss-inset flex items-center justify-between cursor-pointer transition-all ${
                dataHabitos?.skincareAm ? 'border border-ss-gold/40 text-ss-gold' : 'text-gray-400'
              }`}
            >
              <span className="text-xs font-spell flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${dataHabitos?.skincareAm ? 'text-ss-gold' : 'text-gray-600'}`} />
                Skincare AM (Limpiador + Bloqueador)
              </span>
              <span className="text-[10px] font-spell">{dataHabitos?.skincareAm ? 'Listo' : 'Pendiente'}</span>
            </div>

            {/* Skincare PM */}
            <div
              onClick={() => updateHabito({ skincarePm: !dataHabitos?.skincarePm })}
              className={`p-3 rounded-xl ss-inset flex items-center justify-between cursor-pointer transition-all ${
                dataHabitos?.skincarePm ? 'border border-ss-purple/40 text-ss-purple' : 'text-gray-400'
              }`}
            >
              <span className="text-xs font-spell flex items-center gap-2">
                <CheckCircle className={`w-4 h-4 ${dataHabitos?.skincarePm ? 'text-ss-purple' : 'text-gray-600'}`} />
                Skincare PM (Barrera Cutánea)
              </span>
              <span className="text-[10px] font-spell">{dataHabitos?.skincarePm ? 'Listo' : 'Pendiente'}</span>
            </div>

            {/* Pausas Postura */}
            <div className="p-3 rounded-xl ss-inset flex items-center justify-between">
              <div>
                <span className="text-xs font-spell text-gray-300 block">Pausas Posturales</span>
                <span className="text-[10px] text-gray-500 font-spell">{dataHabitos?.pausasPostura || 0} completadas hoy</span>
              </div>
              <button
                onClick={addPausaPostura}
                className="ss-btn px-3 py-1 rounded-lg text-xs font-spell text-ss-silver border border-white/5"
              >
                +1 Pausa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Módulos de Especialización: Skin Care & Taller de Dibujo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Skin Care */}
        <div className="ss-card p-6 border border-white/5 space-y-4 hover:border-ss-gold/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-runic font-bold text-lg text-ss-silver">
                  Skin Care & Barrera Cutánea
                </h3>
                <span className="text-[10px] font-spell text-gray-400">Protocolo AM/PM & Inventario Activo</span>
              </div>
            </div>
            <Link
              href="/cuidado"
              className="text-xs font-spell text-ss-cyan hover:underline flex items-center gap-1"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-gray-300 font-ui">
            Protección solar matutina SPF 50+ y doble limpieza nocturna. Cero exfoliantes abrasivos.
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs font-spell">
            <span className="px-2.5 py-1 rounded-lg ss-inset border border-ss-gold/20 text-ss-gold">
              AM: {dataHabitos?.skincareAm ? '✓ Completado' : '⏳ Pendiente'}
            </span>
            <span className="px-2.5 py-1 rounded-lg ss-inset border border-ss-purple/20 text-ss-purple">
              PM: {dataHabitos?.skincarePm ? '✓ Completado' : '⏳ Pendiente'}
            </span>
          </div>
        </div>

        {/* Card Taller de Dibujo */}
        <div className="ss-card p-6 border border-white/5 space-y-4 hover:border-ss-cyan/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-cyan">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-runic font-bold text-lg text-ss-silver">
                  Taller de Dibujo & Arte
                </h3>
                <span className="text-[10px] font-spell text-gray-400">Práctica Diaria & Anatomía Manhwa</span>
              </div>
            </div>
            <Link
              href="/dibujo"
              className="text-xs font-spell text-ss-cyan hover:underline flex items-center gap-1"
            >
              <span>Abrir Taller</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-gray-300 font-ui">
            Temporizador con presets (15/30/45/60 min), banco de prompts de anatomía y biblioteca de fundamentos.
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs font-spell">
            <span className="px-2.5 py-1 rounded-lg ss-inset border border-white/5 text-gray-300">
              ⏱️ Enfoque hoy: Torso en V & Manos 3D
            </span>
          </div>
        </div>
      </div>

      {/* 5. Avance de Metas SMART Prioritarias */}
      <div className="ss-card p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
            <Target className="w-5 h-5 text-ss-cyan" />
            Metas SMART en Curso
          </h3>
          <Link href="/finanzas" className="text-xs font-spell text-ss-cyan hover:underline">
            Gestionar Metas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metas.slice(0, 3).map((m: any) => {
            const objetivo = Number(m.montoObjetivo || 0);
            const acumulado = Number(m.montoAcumulado || 0);
            const porcentaje = objetivo > 0 ? Math.min(100, Math.round((acumulado / objetivo) * 100)) : 50;

            return (
              <div key={m.id} className="p-4 rounded-xl ss-inset space-y-2">
                <div className="flex justify-between items-center text-xs font-spell">
                  <span className="text-ss-silver font-bold truncate pr-2">{m.titulo}</span>
                  <span className="text-ss-cyan">{porcentaje}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full ss-inset overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ss-cyan to-ss-gold rounded-full"
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-spell text-gray-400">
                  <span>{formatPEN(acumulado)}</span>
                  <span>{objetivo > 0 ? formatPEN(objetivo) : 'Hábito continuo'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
