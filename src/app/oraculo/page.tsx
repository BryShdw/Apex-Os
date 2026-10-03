'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Target,
  Dumbbell,
  Wallet,
  Moon,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function OraculoPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'metas' | 'historial'>('chat');

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Saludos, Brayan. Soy el Oráculo de Apex OS. Tengo acceso a tu perfil biológico, tu presupuesto de S/ 1,500, tus series de calistenia y tu ancla sagrada de sueño. ¿Qué aspecto de tu vida optimizamos hoy?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SMART Goal Generator State
  const [goalIdea, setGoalIdea] = useState('');
  const [goalCategory, setGoalCategory] = useState('FINANZAS');
  const [generatedGoal, setGeneratedGoal] = useState<any>(null);
  const [loadingGoal, setLoadingGoal] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  // Insights History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Quick Audit Trigger States
  const [quickAuditLoading, setQuickAuditLoading] = useState<string | null>(null);
  const [quickAuditResult, setQuickAuditResult] = useState<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activeTab === 'historial') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/ia/historial');
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoadingChat(true);

    try {
      // Formatear historial para el SDK
      const historyPayload = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply || 'Sin respuesta del Oráculo.' }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Error al conectar con Google AI Studio. Intenta de nuevo.' },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleGenerateSmartGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalIdea.trim()) return;

    setLoadingGoal(true);
    setGoalSaved(false);
    try {
      const res = await fetch('/api/ia/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: goalIdea, categoria: goalCategory }),
      });
      const data = await res.json();
      setGeneratedGoal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGoal(false);
    }
  };

  const handleSaveSmartGoal = async () => {
    if (!generatedGoal) return;
    try {
      const res = await fetch('/api/finanzas/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: generatedGoal.titulo,
          descripcion: generatedGoal.descripcion,
          categoria: generatedGoal.categoria,
          horizonte: generatedGoal.horizonte,
          montoObjetivo: generatedGoal.montoObjetivo,
          fechaLimite: generatedGoal.diasPlazoEstimado
            ? new Date(Date.now() + generatedGoal.diasPlazoEstimado * 24 * 60 * 60 * 1000)
            : undefined,
        }),
      });
      if (res.ok) {
        setGoalSaved(true);
        setGoalIdea('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerQuickAudit = async (type: 'finanzas' | 'fitness' | 'habitos') => {
    setQuickAuditLoading(type);
    setQuickAuditResult(null);
    try {
      let endpoint = '';
      if (type === 'finanzas') endpoint = '/api/ia/auditar-finanzas';
      else if (type === 'fitness') endpoint = '/api/ia/progresion-fitness';
      else if (type === 'habitos') endpoint = '/api/ia/habitos';

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      setQuickAuditResult({ type, data });
    } catch (e) {
      console.error(e);
    } finally {
      setQuickAuditLoading(null);
    }
  };

  const toggleApplied = async (id: number, current: boolean) => {
    try {
      await fetch('/api/ia/historial', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, aplicado: !current }),
      });
      setHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, aplicado: !current } : item))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const quickPrompts = [
    '¿Cómo recortar gastos hormiga esta semana sin pasar hambre?',
    '¿Qué variación de dominadas debo meter para construir la V si ya hago 8 reps?',
    'Tengo tensión en trapecios y cuello por estar en la laptop, ¿qué hago ahora mismo?',
    'Revisa mi ancla de sueño y recomiéndame una rutina para apagar el móvil a las 22:20.',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-spell px-2.5 py-0.5 rounded-full ss-inset text-ss-cyan border border-ss-cyan/30 ss-glow-cyan">
              Google AI Studio • Gemini 2.5 Flash Free Tier
            </span>
          </div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver tracking-wide">
            Oráculo de <span className="text-ss-cyan">Apex OS</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Mentor cognitivo, auditor financiero y entrenador de calistenia adaptativa para Brayan.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl ss-inset">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-spell transition-all ${
              activeTab === 'chat'
                ? 'ss-btn-active text-ss-cyan font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Terminal del Oráculo
          </button>
          <button
            onClick={() => setActiveTab('metas')}
            className={`px-4 py-2 rounded-lg text-xs font-spell transition-all ${
              activeTab === 'metas'
                ? 'ss-btn-active text-ss-gold font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Forja SMART
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`px-4 py-2 rounded-lg text-xs font-spell transition-all ${
              activeTab === 'historial'
                ? 'ss-btn-active text-ss-purple font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Historial de Insights
          </button>
        </div>
      </div>

      {/* Acciones Rápidas de Auditoría */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleTriggerQuickAudit('finanzas')}
          disabled={quickAuditLoading !== null}
          className="ss-card p-4 text-left border border-white/5 hover:border-ss-gold/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-spell text-ss-gold flex items-center gap-1.5 font-bold">
              <Wallet className="w-4 h-4 text-ss-gold" /> Auditoría de Bóveda
            </span>
            <Zap className={`w-3.5 h-3.5 text-ss-gold ${quickAuditLoading === 'finanzas' ? 'animate-spin' : ''}`} />
          </div>
          <p className="text-xs text-gray-400 font-ui">
            Analiza fugas de gastos hormiga y proyecta cumplimiento del ahorro de S/ 200.
          </p>
        </button>

        <button
          onClick={() => handleTriggerQuickAudit('fitness')}
          disabled={quickAuditLoading !== null}
          className="ss-card p-4 text-left border border-white/5 hover:border-ss-cyan/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-spell text-ss-cyan flex items-center gap-1.5 font-bold">
              <Dumbbell className="w-4 h-4 text-ss-cyan" /> Sobrecarga & Postura
            </span>
            <Zap className={`w-3.5 h-3.5 text-ss-cyan ${quickAuditLoading === 'fitness' ? 'animate-spin' : ''}`} />
          </div>
          <p className="text-xs text-gray-400 font-ui">
            Calcula progresión en dominadas/fondos y corrige tensión en trapecio/cuello.
          </p>
        </button>

        <button
          onClick={() => handleTriggerQuickAudit('habitos')}
          disabled={quickAuditLoading !== null}
          className="ss-card p-4 text-left border border-white/5 hover:border-ss-purple/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-spell text-ss-purple flex items-center gap-1.5 font-bold">
              <Moon className="w-4 h-4 text-ss-purple" /> Ancla de Sueño 7h
            </span>
            <Zap className={`w-3.5 h-3.5 text-ss-purple ${quickAuditLoading === 'habitos' ? 'animate-spin' : ''}`} />
          </div>
          <p className="text-xs text-gray-400 font-ui">
            Diagnóstico de sueño reparador y protocolo de desconexión nocturna a las 22:20.
          </p>
        </button>
      </div>

      {/* Modal / Resultado de Auditoría Rápida */}
      {quickAuditResult && (
        <div className="ss-card p-6 border border-ss-cyan/40 ss-glow-cyan animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-runic font-bold text-lg text-ss-silver flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ss-cyan" />
              Resultado de Auditoría • {quickAuditResult.type.toUpperCase()}
            </h4>
            <button
              onClick={() => setQuickAuditResult(null)}
              className="text-xs font-spell text-gray-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>

          <p className="text-sm text-gray-300 bg-black/20 p-3.5 rounded-xl border border-white/5 font-ui">
            {quickAuditResult.data.diagnostico}
          </p>

          <pre className="text-xs font-spell text-gray-400 bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto">
            {JSON.stringify(quickAuditResult.data, null, 2)}
          </pre>
        </div>
      )}

      {/* TAB 1: TERMINAL DEL ORÁCULO (CHAT) */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Contenedor de Mensajes */}
          <div className="ss-card p-6 border border-white/5 min-h-[480px] max-h-[580px] overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-8 h-8 rounded-lg ss-inset flex-shrink-0 flex items-center justify-center text-ss-cyan border border-ss-cyan/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs md:text-sm font-ui leading-relaxed ${
                    m.role === 'user'
                      ? 'ss-btn-active text-ss-silver border border-ss-cyan/30 rounded-tr-none'
                      : 'ss-card border border-white/5 text-gray-200 rounded-tl-none bg-[#181c24]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {loadingChat && (
              <div className="flex gap-3 items-center text-xs font-spell text-gray-400">
                <div className="w-8 h-8 rounded-lg ss-inset flex items-center justify-center text-ss-cyan animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span>El Oráculo está consultando el grimorio de Gemini 2.5...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(q)}
                className="ss-btn px-3 py-1.5 rounded-lg text-[11px] font-spell text-gray-400 hover:text-ss-cyan border border-white/5"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              placeholder="Consulta al Oráculo sobre finanzas, postura, calistenia o hábitos..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none focus:border-ss-cyan/50"
            />
            <button
              type="submit"
              disabled={loadingChat || !inputMessage.trim()}
              className="ss-btn px-6 py-3 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/30 hover:border-ss-cyan flex items-center gap-2 ss-glow-cyan"
            >
              <Send className="w-4 h-4" />
              <span>Consultar</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: FORJA DE METAS SMART */}
      {activeTab === 'metas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario de Entrada */}
          <div className="ss-card p-6 border border-white/5 space-y-4">
            <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
              <Target className="w-5 h-5 text-ss-gold" />
              Forja Asistida de Metas SMART
            </h3>
            <p className="text-xs text-gray-400 font-ui">
              Escribe una idea en tus propias palabras; Gemini la estructurará con métricas medibles, plazos y valor monetario.
            </p>

            <form onSubmit={handleGenerateSmartGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
                  Idea u Objetivo
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej. Quiero comprarme un teclado ergonómico y un soporte para no doblar el cuello en la laptop..."
                  value={goalIdea}
                  onChange={(e) => setGoalIdea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-spell text-gray-400 mb-1.5 uppercase">
                  Categoría
                </label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl ss-inset font-ui text-sm text-ss-silver focus:outline-none"
                >
                  <option value="FINANZAS" className="bg-[#15181e]">Finanzas & Ahorro</option>
                  <option value="POSTURA" className="bg-[#15181e]">Postura & Ergonomía</option>
                  <option value="FITNESS" className="bg-[#15181e]">Calistenia & Fuerza</option>
                  <option value="SKINCARE" className="bg-[#15181e]">Skincare & Cuidado</option>
                  <option value="CARRERA" className="bg-[#15181e]">Carrera & Sistemas</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingGoal}
                className="ss-btn w-full py-3 rounded-xl text-xs font-spell font-bold text-ss-gold border border-ss-gold/30 hover:border-ss-gold flex items-center justify-center gap-2 ss-glow-gold"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingGoal ? 'Forjando con Gemini...' : 'Estructurar Meta SMART con IA'}</span>
              </button>
            </form>
          </div>

          {/* Resultado de la Meta Estructurada */}
          <div className="ss-card p-6 border border-white/5 space-y-4">
            <h3 className="font-runic font-bold text-xl text-ss-silver">
              Meta SMART Forjada
            </h3>

            {!generatedGoal ? (
              <div className="p-8 rounded-xl ss-inset text-center space-y-2">
                <Target className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-500 font-spell">
                  Escribe una idea a la izquierda para ver el desglose SMART aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl ss-inset border border-ss-gold/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-spell px-2 py-0.5 rounded bg-ss-gold/10 text-ss-gold border border-ss-gold/20">
                      {generatedGoal.categoria} • {generatedGoal.horizonte}
                    </span>
                    <span className="text-xs font-spell text-gray-400">
                      Plazo: ~{generatedGoal.diasPlazoEstimado} días
                    </span>
                  </div>

                  <h4 className="font-runic font-bold text-lg text-ss-silver">
                    {generatedGoal.titulo}
                  </h4>

                  <p className="text-xs text-gray-300 font-ui leading-relaxed">
                    {generatedGoal.descripcion}
                  </p>

                  {generatedGoal.montoObjetivo && (
                    <div className="pt-2 text-xs font-spell text-ss-gold">
                      Monto Objetivo Sugerido: S/ {generatedGoal.montoObjetivo}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveSmartGoal}
                  disabled={goalSaved}
                  className={`ss-btn w-full py-3 rounded-xl text-xs font-spell font-bold flex items-center justify-center gap-2 ${
                    goalSaved
                      ? 'text-emerald-400 border border-emerald-500/40'
                      : 'text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{goalSaved ? '¡Meta Guardada en MySQL!' : 'Guardar Meta en Bóveda'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIAL DE INSIGHTS GUARDADOS EN MYSQL */}
      {activeTab === 'historial' && (
        <div className="ss-card p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-ss-purple" />
                Archivo de Diagnósticos e Insights Guardados
              </h3>
              <p className="text-xs text-gray-400 font-spell">
                Persistencia en MySQL (tabla insights_ia) para verificar cumplimiento
              </p>
            </div>

            <button
              onClick={fetchHistory}
              className="p-2 rounded-lg ss-btn text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loadingHistory ? (
            <div className="p-8 text-center text-xs font-spell text-gray-400">
              Cargando historial desde MySQL...
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-xs font-spell text-gray-500">
              No hay diagnósticos previos registrados aún. Ejecuta una auditoría rápida arriba.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl ss-inset border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-ss-purple/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-spell px-2 py-0.5 rounded bg-ss-purple/10 text-ss-purple border border-ss-purple/30">
                        {item.modulo}
                      </span>
                      <span className="text-xs text-gray-400 font-spell">
                        {formatDate(item.fechaGeneracion)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 font-ui max-w-3xl">
                      {item.diagnostico}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleApplied(item.id, item.aplicado)}
                      className={`ss-btn px-3 py-1.5 rounded-lg text-xs font-spell flex items-center gap-1.5 transition-all ${
                        item.aplicado
                          ? 'text-emerald-400 border border-emerald-500/30'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{item.aplicado ? 'Aplicado' : 'Marcar Aplicado'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
