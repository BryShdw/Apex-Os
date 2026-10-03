'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Clock, Sparkles, AlertTriangle, CheckCircle, Bot } from 'lucide-react';

interface Ejercicio {
  id: number;
  nombre: string;
  grupoMuscular: string;
  esPostural: boolean;
}

interface Rutina {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
}

interface Props {
  ejercicios: Ejercicio[];
  rutinas: Rutina[];
  todayRutina?: Rutina | null;
  onWorkoutSaved: () => void;
}

export const WorkoutTracker: React.FC<Props> = ({
  ejercicios,
  rutinas,
  todayRutina,
  onWorkoutSaved,
}) => {
  const [rutinaId, setRutinaId] = useState<number>(todayRutina?.id || rutinas[0]?.id || 1);
  const [duracionMinutos, setDuracionMinutos] = useState(45);
  const [rpeGeneral, setRpeGeneral] = useState(7);
  const [molestiaCuello, setMolestiaCuello] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [loading, setLoading] = useState(false);

  // Series
  const [series, setSeries] = useState<
    Array<{
      ejercicioId: number;
      numeroSerie: number;
      repeticiones: number;
      pesoLastreKg: number;
      rpeSerie: number;
      falloMuscular: boolean;
    }>
  >([
    { ejercicioId: ejercicios[0]?.id || 1, numeroSerie: 1, repeticiones: 8, pesoLastreKg: 0, rpeSerie: 7, falloMuscular: false },
    { ejercicioId: ejercicios[0]?.id || 1, numeroSerie: 2, repeticiones: 7, pesoLastreKg: 0, rpeSerie: 8, falloMuscular: false },
    { ejercicioId: ejercicios[1]?.id || 2, numeroSerie: 1, repeticiones: 10, pesoLastreKg: 0, rpeSerie: 7, falloMuscular: false },
  ]);

  // Temporizador de descanso
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInitial, setTimerInitial] = useState(90);

  // AI Progression report
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
  };

  const addSerie = () => {
    const lastSerie = series[series.length - 1];
    setSeries([
      ...series,
      {
        ejercicioId: lastSerie?.ejercicioId || ejercicios[0]?.id || 1,
        numeroSerie: series.length + 1,
        repeticiones: lastSerie?.repeticiones || 8,
        pesoLastreKg: 0,
        rpeSerie: 7,
        falloMuscular: false,
      },
    ]);
  };

  const removeSerie = (index: number) => {
    if (series.length <= 1) return;
    setSeries(series.filter((_, i) => i !== index));
  };

  const updateSerie = (index: number, field: string, value: any) => {
    const updated = [...series];
    updated[index] = { ...updated[index], [field]: value };
    setSeries(updated);
  };

  const handleSaveWorkout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rutinaId,
          duracionMinutos,
          rpeEsfuerzoGeneral: rpeGeneral,
          molestiaCuello,
          comentarios,
          series,
        }),
      });

      if (res.ok) {
        onWorkoutSaved();
        alert('¡Sesión guardada exitosamente en MySQL!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAIProgression = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ia/progresion-fitness', { method: 'POST' });
      const data = await res.json();
      setAiReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta de Registro de Sesión */}
      <div className="ss-card p-6 md:p-8 border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl ss-inset flex items-center justify-center text-ss-cyan">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-runic font-bold text-xl text-ss-silver">
                Registro de Entrenamiento en Barra
              </h3>
              <p className="text-xs text-gray-400 font-spell">
                Sobrecarga progresiva para físico atlético en V
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={rutinaId}
              onChange={(e) => setRutinaId(Number(e.target.value))}
              className="px-3.5 py-2 rounded-xl ss-inset text-xs font-spell text-ss-silver focus:outline-none w-full sm:w-auto"
            >
              {rutinas.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#15181e]">
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Temporizador de Descanso Rápido */}
        <div className="p-4 rounded-xl ss-inset flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${timerActive ? 'text-ss-cyan animate-pulse' : 'text-gray-400'}`} />
            <div>
              <span className="text-xs font-spell text-gray-300 block">Temporizador de Descanso</span>
              <span className="text-2xl font-spell font-extrabold text-ss-cyan">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startTimer(60)}
              className="ss-btn px-3 py-1.5 rounded-lg text-xs font-spell text-gray-300 hover:text-white"
            >
              60s
            </button>
            <button
              onClick={() => startTimer(90)}
              className="ss-btn px-3 py-1.5 rounded-lg text-xs font-spell text-ss-cyan border border-ss-cyan/30"
            >
              90s
            </button>
            <button
              onClick={() => startTimer(120)}
              className="ss-btn px-3 py-1.5 rounded-lg text-xs font-spell text-gray-300 hover:text-white"
            >
              120s
            </button>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`ss-btn px-4 py-1.5 rounded-lg text-xs font-spell font-bold ${
                timerActive ? 'text-ss-crimson border border-ss-crimson/30' : 'text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {timerActive ? 'Pausar' : 'Iniciar'}
            </button>
          </div>
        </div>

        {/* Tabla de Series */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-spell text-xs uppercase tracking-wider text-gray-400">
              Series de la Sesión
            </h4>
            <button
              onClick={addSerie}
              className="ss-btn px-3 py-1.5 rounded-xl text-xs font-spell text-ss-cyan border border-ss-cyan/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Serie
            </button>
          </div>

          <div className="space-y-2">
            {series.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 p-3 rounded-xl ss-inset items-center text-xs font-ui"
              >
                <div className="col-span-1 text-center font-spell font-bold text-gray-400">
                  #{s.numeroSerie}
                </div>

                <div className="col-span-4">
                  <select
                    value={s.ejercicioId}
                    onChange={(e) => updateSerie(idx, 'ejercicioId', Number(e.target.value))}
                    className="w-full bg-[#15181e] text-ss-silver px-2 py-1.5 rounded-lg border border-white/5 focus:outline-none"
                  >
                    {ejercicios.map((ej) => (
                      <option key={ej.id} value={ej.id}>
                        {ej.nombre} {ej.esPostural ? '🧘' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={s.repeticiones}
                      onChange={(e) => updateSerie(idx, 'repeticiones', Number(e.target.value))}
                      className="w-full bg-[#15181e] text-center font-spell text-ss-silver px-2 py-1.5 rounded-lg border border-white/5 focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-500 font-spell">reps</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={s.pesoLastreKg}
                      onChange={(e) => updateSerie(idx, 'pesoLastreKg', parseFloat(e.target.value) || 0)}
                      placeholder="+kg"
                      className="w-full bg-[#15181e] text-center font-spell text-ss-silver px-2 py-1.5 rounded-lg border border-white/5 focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-500 font-spell">kg</span>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-2 justify-center">
                  <label className="flex items-center gap-1 text-[11px] font-spell text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.falloMuscular}
                      onChange={(e) => updateSerie(idx, 'falloMuscular', e.target.checked)}
                      className="rounded text-ss-crimson bg-black/40 border-white/20"
                    />
                    Fallo
                  </label>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    onClick={() => removeSerie(idx)}
                    className="text-gray-500 hover:text-ss-crimson p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders de Fatiga y Molestia en Cuello */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="p-4 rounded-xl ss-inset">
            <div className="flex justify-between items-center text-xs font-spell mb-2">
              <span className="text-gray-300">Esfuerzo Percibido (RPE 1-10)</span>
              <span className="text-ss-cyan font-bold">{rpeGeneral} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rpeGeneral}
              onChange={(e) => setRpeGeneral(Number(e.target.value))}
              className="w-full accent-ss-cyan cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl ss-inset">
            <div className="flex justify-between items-center text-xs font-spell mb-2">
              <span className="text-gray-300 flex items-center gap-1">
                <AlertTriangle className={`w-3.5 h-3.5 ${molestiaCuello > 3 ? 'text-ss-crimson' : 'text-gray-400'}`} />
                Molestia en Cuello / Text Neck (0-10)
              </span>
              <span className={molestiaCuello > 3 ? 'text-ss-crimson font-bold' : 'text-emerald-400'}>
                {molestiaCuello} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={molestiaCuello}
              onChange={(e) => setMolestiaCuello(Number(e.target.value))}
              className="w-full accent-ss-crimson cursor-pointer"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleAIProgression}
            disabled={loadingAI}
            className="ss-btn px-4 py-2.5 rounded-xl text-xs font-spell text-ss-gold border border-ss-gold/30 hover:border-ss-gold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Bot className={`w-4 h-4 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? 'Consultando a Gemini...' : 'Analizar Progresión y Postura con IA'}</span>
          </button>

          <button
            onClick={handleSaveWorkout}
            disabled={loading}
            className="ss-btn px-6 py-2.5 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan w-full sm:w-auto text-center"
          >
            {loading ? 'Guardando...' : 'Guardar Sesión en Base de Datos'}
          </button>
        </div>
      </div>

      {/* Modal / Reporte de IA para Fitness */}
      {aiReport && (
        <div className="ss-card p-6 border border-ss-gold/40 ss-glow-gold animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ss-gold" />
              Progresión Adaptativa Gemini
            </h4>
            <span className="text-xs font-spell text-gray-400">Modelo Calistenia & Postura</span>
          </div>

          <p className="text-xs text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5 font-ui">
            {aiReport.diagnostico}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg ss-inset">
              <span className="text-[10px] font-spell uppercase text-ss-cyan block mb-1">
                Progresión Sugerida (Sobrecarga)
              </span>
              <p className="text-gray-300 font-ui">{aiReport.progresionSugerida}</p>
            </div>

            <div className="p-3 rounded-lg ss-inset border border-ss-crimson/20">
              <span className="text-[10px] font-spell uppercase text-ss-crimson block mb-1">
                Alerta Postural (Text Neck)
              </span>
              <p className="text-gray-300 font-ui">{aiReport.alertaPostural}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg ss-inset flex items-center justify-between text-xs font-spell">
            <span className="text-ss-gold font-bold">Meta Semanal: {aiReport.metaSemanal}</span>
            <button
              onClick={() => setAiReport(null)}
              className="text-gray-500 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
