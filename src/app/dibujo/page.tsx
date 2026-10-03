'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Palette,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  Star,
  Flame,
  Check,
  Trash2,
  Layers,
  Award,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Idea {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string | null;
  referenciaUrl: string | null;
  dificultad: 'FACIL' | 'MEDIO' | 'AVANZADO';
  completada: boolean;
  fechaCreacion: string;
}

interface Practica {
  id: number;
  fecha: string;
  minutos: number;
  enfoque: string;
  calificacion: number;
  notas: string | null;
}

export default function DibujoPage() {
  const [activeTab, setActiveTab] = useState<'practica' | 'ideas' | 'fundamentos'>('practica');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [practicas, setPracticas] = useState<Practica[]>([]);
  const [stats, setStats] = useState({ totalMinutos: 0, totalSesiones: 0, promedioCalificacion: '0' });
  const [loading, setLoading] = useState(true);

  // Cronómetro
  const [timerSeconds, setTimerSeconds] = useState(30 * 60); // 30 min default
  const [timerActive, setTimerActive] = useState(false);
  const [initialDuration, setInitialDuration] = useState(30 * 60);
  const [timerEnfoque, setTimerEnfoque] = useState('Anatomía del Torso (V-Taper)');

  // Formulario Registro Práctica
  const [rating, setRating] = useState(8);
  const [notasPractica, setNotasPractica] = useState('');
  const [savingPractica, setSavingPractica] = useState(false);
  const [practicaSuccess, setPracticaSuccess] = useState(false);

  // Modal Nueva Idea
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [newIdeaTitulo, setNewIdeaTitulo] = useState('');
  const [newIdeaCat, setNewIdeaCat] = useState('ANATOMIA');
  const [newIdeaDif, setNewIdeaDif] = useState<'FACIL' | 'MEDIO' | 'AVANZADO'>('MEDIO');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaRef, setNewIdeaRef] = useState('');
  const [savingIdea, setSavingIdea] = useState(false);

  // Filtro Ideas
  const [filtroCat, setFiltroCat] = useState('TODAS');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const [resIdeas, resPracticas] = await Promise.all([
        fetch('/api/dibujo/ideas'),
        fetch('/api/dibujo/practicas'),
      ]);
      const dataIdeas = await resIdeas.json();
      const dataPracticas = await resPracticas.json();

      if (Array.isArray(dataIdeas)) setIdeas(dataIdeas);
      if (dataPracticas.practicas) setPracticas(dataPracticas.practicas);
      if (dataPracticas.stats) setStats(dataPracticas.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer Effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const setTimerPreset = (minutes: number) => {
    setTimerActive(false);
    const secs = minutes * 60;
    setInitialDuration(secs);
    setTimerSeconds(secs);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(initialDuration);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSavePractica = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPractica(true);
    try {
      const minutosRealizados = Math.max(
        1,
        Math.round((initialDuration - timerSeconds) / 60) || Math.round(initialDuration / 60)
      );

      const res = await fetch('/api/dibujo/practicas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minutos: minutosRealizados,
          enfoque: timerEnfoque,
          calificacion: rating,
          notas: notasPractica,
        }),
      });

      if (res.ok) {
        setPracticaSuccess(true);
        setTimeout(() => setPracticaSuccess(false), 3000);
        setNotasPractica('');
        resetTimer();
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPractica(false);
    }
  };

  const handleToggleIdea = async (idea: Idea) => {
    try {
      const res = await fetch('/api/dibujo/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idea.id, completada: !idea.completada }),
      });
      if (res.ok) {
        setIdeas((prev) =>
          prev.map((i) => (i.id === idea.id ? { ...i, completada: !i.completada } : i))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteIdea = async (id: number) => {
    try {
      const res = await fetch(`/api/dibujo/ideas?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIdeas((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitulo.trim()) return;
    setSavingIdea(true);
    try {
      const res = await fetch('/api/dibujo/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: newIdeaTitulo.trim(),
          categoria: newIdeaCat,
          dificultad: newIdeaDif,
          descripcion: newIdeaDesc,
          referenciaUrl: newIdeaRef,
        }),
      });
      if (res.ok) {
        setShowIdeaModal(false);
        setNewIdeaTitulo('');
        setNewIdeaDesc('');
        setNewIdeaRef('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingIdea(false);
    }
  };

  const getDificultadBadge = (dif: string) => {
    switch (dif) {
      case 'FACIL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MEDIO':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'AVANZADO':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const ideasFiltradas =
    filtroCat === 'TODAS' ? ideas : ideas.filter((i) => i.categoria === filtroCat);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-ss-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-spell text-gray-400">Cargando Taller de Dibujo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver tracking-wide">
            Taller de Dibujo <span className="text-ss-cyan">& Fundamentos Artísticos</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Estudio estructurado, práctica deliberada, anatomía humana y estilo Manhwa dinámico.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 px-4 rounded-xl ss-inset border border-ss-cyan/20 text-center">
            <span className="text-[10px] uppercase font-spell text-gray-400 block">
              Tiempo Acumulado
            </span>
            <span className="font-spell font-bold text-sm text-ss-cyan">
              {stats.totalMinutos} min
            </span>
          </div>

          <div className="p-2.5 px-4 rounded-xl ss-inset border border-ss-gold/20 text-center">
            <span className="text-[10px] uppercase font-spell text-gray-400 block">Sesiones</span>
            <span className="font-spell font-bold text-sm text-ss-gold">
              {stats.totalSesiones}
            </span>
          </div>

          <div className="p-2.5 px-4 rounded-xl ss-inset border border-emerald-500/20 text-center">
            <span className="text-[10px] uppercase font-spell text-gray-400 block">Promedio</span>
            <span className="font-spell font-bold text-sm text-emerald-400">
              ★ {stats.promedioCalificacion}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('practica')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'practica'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⏱️ Práctica Diaria & Cronómetro
        </button>

        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'ideas'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          💡 Banco de Ideas & Retos ({ideas.length})
        </button>

        <button
          onClick={() => setActiveTab('fundamentos')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'fundamentos'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📚 Biblioteca de Fundamentos (Manhwa & Anatomía)
        </button>
      </div>

      {/* PESTAÑA 1: Práctica Diaria & Cronómetro */}
      {activeTab === 'practica' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cronómetro de Estudio */}
          <div className="lg:col-span-2 ss-card p-6 md:p-8 border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ss-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-spell uppercase tracking-wider text-ss-cyan px-2.5 py-1 rounded bg-ss-cyan/10 border border-ss-cyan/20">
                  Sesión Activa
                </span>
                <h3 className="font-runic font-bold text-2xl text-ss-silver mt-2">
                  Temporizador de Práctica Deliberada
                </h3>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setTimerPreset(mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-spell transition-all ${
                      initialDuration === mins * 60
                        ? 'bg-ss-cyan/20 text-ss-cyan border border-ss-cyan/40 font-bold'
                        : 'ss-inset text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Enfoque */}
            <div>
              <label className="text-xs font-spell text-gray-400 block mb-2">
                Área de Enfoque de la Sesión:
              </label>
              <select
                value={timerEnfoque}
                onChange={(e) => setTimerEnfoque(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
              >
                <option value="Anatomía del Torso (V-Taper)" className="bg-[#15181e]">
                  Anatomía del Torso & Espalda (V-Taper)
                </option>
                <option value="Rostros & Método Loomis" className="bg-[#15181e]">
                  Rostros, Ángulos 3D & Método Loomis
                </option>
                <option value="Estructura 3D de Manos & Dedos" className="bg-[#15181e]">
                  Estructura en Bloques de Manos y Dedos
                </option>
                <option value="Gestual Dinámico & Líneas de Acción" className="bg-[#15181e]">
                  Gestual Dinámico (Poses de acción en 30-60 seg)
                </option>
                <option value="Estilo Manhwa & Ropa/Pliegues" className="bg-[#15181e]">
                  Estilo Webtoon/Manhwa (Cabello, ojos afilados y ropa)
                </option>
                <option value="Perspectiva & Escorzo" className="bg-[#15181e]">
                  Perspectiva de 2/3 Puntos & Escorzo
                </option>
              </select>
            </div>

            {/* Reloj Gigante */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl ss-inset border border-ss-cyan/30 ss-glow-cyan my-4">
              <div className="font-spell font-extrabold text-5xl md:text-7xl text-white tracking-widest">
                {formatTimer(timerSeconds)}
              </div>
              <span className="text-xs font-spell text-ss-cyan mt-2">{timerEnfoque}</span>
            </div>

            {/* Controles del Cronómetro */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-8 py-3 rounded-xl font-spell font-bold text-sm flex items-center gap-2 transition-all ${
                  timerActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'ss-btn text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan'
                }`}
              >
                {timerActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>{timerSeconds < initialDuration ? 'Reanudar' : 'Iniciar Práctica'}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-xl ss-btn text-gray-400 hover:text-white"
                title="Reiniciar reloj"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario para Registrar la Sesión Realizada */}
            <form onSubmit={handleSavePractica} className="pt-6 border-t border-white/5 space-y-4">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Registrar Sesión Concluida
              </h4>

              {practicaSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-spell flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Sesión guardada con éxito en tu bitácora de artista!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Calificación de tu Desempeño (1 - 10)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full accent-ss-cyan"
                    />
                    <span className="font-spell font-bold text-sm text-ss-cyan w-8 text-center">
                      {rating}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Notas y Aprendizajes Clave
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Buena soltura en clavículas, mejorar proporción de la palma..."
                    value={notasPractica}
                    onChange={(e) => setNotasPractica(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPractica}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-center gap-2"
              >
                {savingPractica ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar Registro en Bitácora</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bitácora de Sesiones Recientes */}
          <div className="ss-card p-6 border border-white/5 space-y-4">
            <h3 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
              <Clock className="w-4 h-4 text-ss-cyan" />
              Historial de Prácticas
            </h3>

            {practicas.length === 0 ? (
              <div className="p-6 text-center text-xs font-spell text-gray-500 ss-inset rounded-xl">
                Aún no has registrado sesiones de dibujo. ¡Inicia el cronómetro y registra tu primer
                calentamiento!
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {practicas.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-spell font-bold text-xs text-white truncate max-w-[150px]">
                        {p.enfoque}
                      </span>
                      <span className="text-[10px] font-spell px-2 py-0.5 rounded bg-ss-gold/10 text-ss-gold border border-ss-gold/20">
                        ★ {p.calificacion}/10
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-spell text-gray-400">
                      <span>{p.minutos} minutos</span>
                      <span>{new Date(p.fecha).toLocaleDateString()}</span>
                    </div>
                    {p.notas && (
                      <p className="text-[11px] font-ui text-gray-300 italic pt-1 border-t border-white/5">
                        "{p.notas}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Banco de Ideas & Retos */}
      {activeTab === 'ideas' && (
        <div className="ss-card p-6 border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ss-cyan" />
                Grimorio de Ideas, Retos y Prompts
              </h3>
              <p className="text-xs text-gray-400 font-spell">
                Desafíos deliberados para superar bloqueos creativos y ejercitar áreas anatómicas específicas
              </p>
            </div>

            <button
              onClick={() => setShowIdeaModal(true)}
              className="ss-btn px-4 py-2 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/30 hover:border-ss-cyan flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Nueva Idea</span>
            </button>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex flex-wrap gap-2">
            {[
              'TODAS',
              'ANATOMIA',
              'MANOS',
              'GESTO',
              'PERSONAJES_MANHWA',
              'SOMBREADO_ILUMINACION',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-spell transition-all ${
                  filtroCat === cat
                    ? 'bg-ss-cyan/20 text-ss-cyan border border-ss-cyan/40 font-bold'
                    : 'ss-inset text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Grid de Ideas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideasFiltradas.map((idea) => (
              <div
                key={idea.id}
                className={`p-4 rounded-xl ss-inset border transition-all flex flex-col justify-between space-y-3 ${
                  idea.completada ? 'border-emerald-500/20 opacity-70' : 'border-white/5'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-spell font-bold text-sm ${
                        idea.completada ? 'line-through text-gray-400' : 'text-white'
                      }`}
                    >
                      {idea.titulo}
                    </h4>

                    <span
                      className={`text-[9px] font-spell px-2 py-0.5 rounded border ${getDificultadBadge(
                        idea.dificultad
                      )}`}
                    >
                      {idea.dificultad}
                    </span>
                  </div>

                  <span className="text-[10px] font-spell px-2 py-0.5 rounded bg-white/5 text-gray-400 inline-block">
                    {idea.categoria.replace('_', ' ')}
                  </span>

                  {idea.descripcion && (
                    <p className="text-xs font-ui text-gray-300 leading-relaxed">
                      {idea.descripcion}
                    </p>
                  )}

                  {idea.referenciaUrl && (
                    <a
                      href={idea.referenciaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-spell text-ss-cyan hover:underline flex items-center gap-1"
                    >
                      <span>Ver referencia</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleIdea(idea)}
                    className={`px-3 py-1 rounded-lg text-xs font-spell font-bold transition-all flex items-center gap-1.5 ${
                      idea.completada
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-gray-400 hover:text-white ss-card border border-white/5'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{idea.completada ? 'Completado' : 'Marcar Hecho'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Biblioteca de Fundamentos (Manhwa & Anatomía) */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6">
          <div className="ss-card p-6 border border-white/5 space-y-4">
            <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ss-cyan" />
              Grimorio de Fundamentos: Anatomía & Estilo Manhwa
            </h3>
            <p className="text-xs text-gray-400 font-spell">
              Principios anatómicos indispensables para construir figuras sólidas y con presencia heroica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Torso en V y Proporciones Manhwa */}
            <div className="ss-card p-6 border border-ss-cyan/20 space-y-4">
              <span className="text-xs font-spell text-ss-cyan uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-ss-cyan/10 border border-ss-cyan/20">
                Pilar 1: Silueta Heroica
              </span>
              <h4 className="font-runic font-bold text-lg text-ss-silver">
                El Torso en V-Taper y la Caja Torácica
              </h4>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                En el estilo Manhwa (ej. Solo Leveling), los personajes masculinos tienen una proporción de 8 a 8.5 cabezas de altura. El tórax se simplifica como una caja tridimensional que puede rotar e inclinarse independientemente del balde pélvico.
              </p>
              <div className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-2 text-xs font-ui">
                <span className="font-spell font-bold text-white block">Reglas de Oro:</span>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li><strong className="text-ss-silver">Clavículas:</strong> Funcionan como manubrio de bicicleta, nunca son rectas horizontales sino que forman una 'V' abierta.</li>
                  <li><strong className="text-ss-silver">Dorsal Ancho:</strong> Se expande desde la axila hacia la cintura creando el contorno triangular que hace ver fuerte la espalda.</li>
                  <li><strong className="text-ss-silver">Contrapposto:</strong> Si la línea de los hombros baja hacia la izquierda, la pelvis sube hacia ese mismo lado para balancear la gravedad.</li>
                </ul>
              </div>
            </div>

            {/* 2. Método Loomis Simplificado */}
            <div className="ss-card p-6 border border-ss-gold/20 space-y-4">
              <span className="text-xs font-spell text-ss-gold uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-ss-gold/10 border border-ss-gold/20">
                Pilar 2: Estructura Facial
              </span>
              <h4 className="font-runic font-bold text-lg text-ss-silver">
                Método Loomis para Rostros Angulares
              </h4>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                El cráneo no es un círculo plano, es una bola esférica aplanada a los lados. Dividir la cara en tres tercios iguales asegura que las proporciones nunca se desfiguren sin importar el ángulo de la cámara.
              </p>
              <div className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-2 text-xs font-ui">
                <span className="font-spell font-bold text-white block">Los 3 Tercios Faciales:</span>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li><strong className="text-ss-silver">Tercio 1:</strong> Desde la línea del nacimiento del cabello hasta la línea de las cejas.</li>
                  <li><strong className="text-ss-silver">Tercio 2:</strong> De las cejas a la base inferior de la nariz (aquí también encajan las orejas).</li>
                  <li><strong className="text-ss-silver">Tercio 3:</strong> De la base de la nariz a la punta del mentón (los labios se sitúan en el tercio superior de esta zona).</li>
                </ul>
              </div>
            </div>

            {/* 3. Manos en Cajas 3D */}
            <div className="ss-card p-6 border border-ss-purple/20 space-y-4">
              <span className="text-xs font-spell text-ss-purple uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-ss-purple/10 border border-ss-purple/20">
                Pilar 3: Extremidades Complejas
              </span>
              <h4 className="font-runic font-bold text-lg text-ss-silver">
                Manos: La Cuña de la Palma y Arcos de Nudillos
              </h4>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                El error común es dibujar dedos individuales como salchichas. La palma debe tratarse como una cuña curva sólida parecida a una pala.
              </p>
              <div className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-2 text-xs font-ui">
                <span className="font-spell font-bold text-white block">Secretos de Construcción:</span>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li><strong className="text-ss-silver">Arco de nudillos:</strong> El dedo medio siempre es el más largo; los nudillos siguen una curva parabólica.</li>
                  <li><strong className="text-ss-silver">El Pulgar Independiente:</strong> Se origina en un triángulo lateral y rota en un plano de 90° respecto a los otros cuatro dedos.</li>
                  <li><strong className="text-ss-silver">Silueta primero:</strong> Agrupa el dedo índice y medio, o anular y meñique antes de detallar articulaciones.</li>
                </ul>
              </div>
            </div>

            {/* 4. Dinamismo y Curva de Acción */}
            <div className="ss-card p-6 border border-rose-500/20 space-y-4">
              <span className="text-xs font-spell text-rose-400 uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Pilar 4: Impacto Visual
              </span>
              <h4 className="font-runic font-bold text-lg text-ss-silver">
                Línea de Acción: Eliminar Poses Rígidas
              </h4>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                Una ilustración de acción necesita una curva rítmica dominante que guíe la mirada del espectador a través de todo el cuerpo en una sola línea continua.
              </p>
              <div className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-2 text-xs font-ui">
                <span className="font-spell font-bold text-white block">Curvas 'C' y 'S':</span>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Evita las líneas rectas verticales tipo "palo". El cuerpo humano descansa sobre tensiones opuestas.</li>
                  <li>En combate o poses de poder, empuja la cabeza hacia adelante y quiebra la rodilla de soporte para crear anticipación de impacto.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Nueva Idea / Reto */}
      {showIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ss-cyan" />
                Nueva Idea o Reto de Dibujo
              </h4>
              <button
                onClick={() => setShowIdeaModal(false)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Título de la Idea
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mano sosteniendo una espada, Rostro 3/4 picado..."
                  value={newIdeaTitulo}
                  onChange={(e) => setNewIdeaTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Categoría</label>
                  <select
                    value={newIdeaCat}
                    onChange={(e) => setNewIdeaCat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="ANATOMIA" className="bg-[#15181e]">
                      Anatomía General
                    </option>
                    <option value="MANOS" className="bg-[#15181e]">
                      Manos y Dedos
                    </option>
                    <option value="GESTO" className="bg-[#15181e]">
                      Gesto Dinámico
                    </option>
                    <option value="PERSONAJES_MANHWA" className="bg-[#15181e]">
                      Personajes Manhwa
                    </option>
                    <option value="SOMBREADO_ILUMINACION" className="bg-[#15181e]">
                      Sombreado & Luz
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Dificultad</label>
                  <select
                    value={newIdeaDif}
                    onChange={(e) => setNewIdeaDif(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="FACIL" className="bg-[#15181e]">
                      Fácil
                    </option>
                    <option value="MEDIO" className="bg-[#15181e]">
                      Medio
                    </option>
                    <option value="AVANZADO" className="bg-[#15181e]">
                      Avanzado
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Descripción o Instrucciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre la pose, ángulo o técnica a cuidar..."
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  URL de Referencia (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://pinterest.com/pin/..."
                  value={newIdeaRef}
                  onChange={(e) => setNewIdeaRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <button
                type="submit"
                disabled={savingIdea}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {savingIdea ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar Reto / Idea</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
