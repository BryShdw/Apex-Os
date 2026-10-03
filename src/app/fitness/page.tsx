'use client';

import React, { useEffect, useState } from 'react';
import { WorkoutTracker } from '@/components/fitness/WorkoutTracker';
import { Dumbbell, ShieldCheck, Flame, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function FitnessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/fitness');
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
          <span className="text-xs font-spell text-gray-400">Cargando Módulo de Calistenia & Postura...</span>
        </div>
      </div>
    );
  }

  const { today, ejercicios, rutinas, entrenamientosRecientes } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-spell px-2 py-0.5 rounded ss-inset text-ss-gold border border-ss-gold/30">
              {today.tipo === 'B' ? 'Día Tipo B: Entrenamiento Activo' : today.desc}
            </span>
          </div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver tracking-wide">
            Calistenia & Salud <span className="text-ss-cyan">Postural</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Construcción de físico atlético en V con barra fija y corrección del síndrome cruzado superior.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl ss-btn text-gray-400 hover:text-white"
          title="Recargar datos"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Componente Principal de Registro de Sesión */}
      <WorkoutTracker
        ejercicios={ejercicios}
        rutinas={rutinas}
        todayRutina={today.rutina}
        onWorkoutSaved={fetchData}
      />

      {/* 2. Guía Visual Postural (Text Neck & Hombros) */}
      <div className="ss-card p-6 border border-white/5 space-y-4">
        <div>
          <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-ss-cyan" />
            Protocolo Diario Anti-Text Neck & Cifosis
          </h3>
          <p className="text-xs text-gray-400 font-spell">
            Ejercicios posturales para compensar las horas en la laptop y el trabajo técnico AV
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl ss-inset">
            <span className="text-xs font-spell text-ss-cyan block mb-1 font-bold">1. Chin Tucks (Doble Mentón)</span>
            <p className="text-xs text-gray-300 font-ui">
              De pie contra la pared, retrae la barbilla recto hacia atrás creando un doble mentón. Mantén 5 segundos. 2 series de 10 reps.
            </p>
          </div>

          <div className="p-4 rounded-xl ss-inset">
            <span className="text-xs font-spell text-ss-cyan block mb-1 font-bold">2. Retracción Escapular</span>
            <p className="text-xs text-gray-300 font-ui">
              Junta los omóplatos como intentando sostener un lápiz entre ellos. Abre el pecho y desciende los hombros.
            </p>
          </div>

          <div className="p-4 rounded-xl ss-inset">
            <span className="text-xs font-spell text-ss-cyan block mb-1 font-bold">3. Dead Hang (Colgado Pasivo)</span>
            <p className="text-xs text-gray-300 font-ui">
              Cuelga de la barra durante 30 a 60 segundos permitiendo que la gravedad descomprima la columna vertebral torácica y lumbar.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Historial de Sesiones Anteriores */}
      <div className="ss-card p-6 border border-white/5">
        <h3 className="font-runic font-bold text-xl text-ss-silver mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-ss-cyan" />
          Historial de Sesiones en MySQL
        </h3>

        {entrenamientosRecientes.length === 0 ? (
          <p className="text-xs font-spell text-gray-500">No hay sesiones previas registradas aún.</p>
        ) : (
          <div className="space-y-3">
            {entrenamientosRecientes.map((ent: any) => (
              <div key={ent.id} className="p-4 rounded-xl ss-inset space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <span className="font-runic font-bold text-sm text-ss-silver">
                    {ent.rutina.nombre}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-spell text-gray-400">
                    <span>{formatDate(ent.fecha)}</span>
                    <span>• {ent.duracionMinutos} min</span>
                    <span className="text-ss-cyan font-bold">RPE {ent.rpeEsfuerzoGeneral}/10</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {ent.series.map((s: any) => (
                    <span
                      key={s.id}
                      className="text-[11px] font-spell px-2 py-0.5 rounded bg-white/[0.03] text-gray-300 border border-white/5"
                    >
                      {s.ejercicio.nombre.split(' ')[0]}: {s.repeticiones} reps {s.pesoLastreKg > 0 ? `(+${s.pesoLastreKg}kg)` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
