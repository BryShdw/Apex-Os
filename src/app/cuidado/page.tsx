'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Shield,
  Check,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Package,
  Layers,
  HeartPulse,
  Power,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatPEN } from '@/lib/utils';

interface Producto {
  id: number;
  nombre: string;
  marca: string | null;
  pasoNumero: number;
  momento: 'AM' | 'PM' | 'AM_PM';
  categoria: string;
  enUso: boolean;
  precio: number | string | null;
  instrucciones: string | null;
  notas: string | null;
}

export default function CuidadoPersonalPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [habitos, setHabitos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rutina' | 'productos' | 'diagnostico'>('rutina');

  // Modal para Crear/Editar Producto
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    pasoNumero: 1,
    momento: 'AM_PM' as 'AM' | 'PM' | 'AM_PM',
    categoria: 'HIDRATANTE',
    enUso: true,
    precio: '',
    instrucciones: '',
    notas: '',
  });

  const fetchData = async () => {
    try {
      const [resProd, resHab] = await Promise.all([
        fetch('/api/skincare'),
        fetch('/api/habitos'),
      ]);
      const dataProd = await resProd.json();
      const dataHab = await resHab.json();

      if (Array.isArray(dataProd)) {
        setProductos(dataProd);
      }
      setHabitos(dataHab.habit);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSkincareHabit = async (tipo: 'skincareAm' | 'skincarePm') => {
    if (!habitos) return;
    const nuevoValor = !habitos[tipo];
    setHabitos({ ...habitos, [tipo]: nuevoValor });

    try {
      await fetch('/api/habitos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [tipo]: nuevoValor }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleProductStatus = async (prod: Producto) => {
    try {
      const res = await fetch(`/api/skincare/${prod.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enUso: !prod.enUso }),
      });
      if (res.ok) {
        setProductos((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, enUso: !p.enUso } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar este producto de tu inventario?')) return;
    try {
      const res = await fetch(`/api/skincare/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      marca: '',
      pasoNumero: 1,
      momento: 'AM_PM',
      categoria: 'HIDRATANTE',
      enUso: true,
      precio: '',
      instrucciones: '',
      notas: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (prod: Producto) => {
    setEditingProduct(prod);
    setFormData({
      nombre: prod.nombre,
      marca: prod.marca || '',
      pasoNumero: prod.pasoNumero,
      momento: prod.momento,
      categoria: prod.categoria,
      enUso: prod.enUso,
      precio: prod.precio ? prod.precio.toString() : '',
      instrucciones: prod.instrucciones || '',
      notas: prod.notas || '',
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    setSavingProduct(true);
    try {
      if (editingProduct) {
        // PATCH
        const res = await fetch(`/api/skincare/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            precio: formData.precio ? parseFloat(formData.precio) : null,
          }),
        });
        if (res.ok) {
          fetchData();
          setModalOpen(false);
        }
      } else {
        // POST
        const res = await fetch('/api/skincare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            precio: formData.precio ? parseFloat(formData.precio) : null,
          }),
        });
        if (res.ok) {
          fetchData();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProduct(false);
    }
  };

  // Filtrado de productos en uso activo para rutinas
  const productosAM = productos
    .filter((p) => p.enUso && (p.momento === 'AM' || p.momento === 'AM_PM'))
    .sort((a, b) => a.pasoNumero - b.pasoNumero);

  const productosPM = productos
    .filter((p) => p.enUso && (p.momento === 'PM' || p.momento === 'AM_PM'))
    .sort((a, b) => a.pasoNumero - b.pasoNumero);

  const getCategoriaBadge = (cat: string) => {
    switch (cat) {
      case 'LIMPIADOR':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'HIDRATANTE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'PROTECTOR_SOLAR':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'REPARADOR_BARRERA':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ACTIVO_TRATAMIENTO':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-ss-cyan border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-spell text-gray-400">Cargando Skin Care OS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-runic font-extrabold text-3xl md:text-4xl text-ss-silver tracking-wide">
            Skin Care <span className="text-ss-cyan">& Protocolo Cutáneo</span>
          </h1>
          <p className="text-sm text-gray-400 font-ui mt-1">
            Recuperación de la barrera cutánea, control de sebo y gestión personalizada de productos en uso.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl ss-btn text-gray-400 hover:text-white"
            title="Recargar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openCreateModal}
            className="ss-btn px-4 py-2.5 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan flex items-center gap-2 ss-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('rutina')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'rutina'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🧴 Rutinas Activas (AM / PM)
        </button>

        <button
          onClick={() => setActiveTab('productos')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'productos'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📦 Administrador de Productos ({productos.length})
        </button>

        <button
          onClick={() => setActiveTab('diagnostico')}
          className={`px-4 py-2 rounded-xl text-xs font-spell font-bold transition-all ${
            activeTab === 'diagnostico'
              ? 'ss-btn-active text-ss-cyan border border-ss-cyan/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🩺 Diagnóstico & Piel
        </button>
      </div>

      {/* PESTAÑA 1: Rutinas Activas AM y PM */}
      {activeTab === 'rutina' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rutina Matutina (AM) */}
          <div className="ss-card p-6 border border-ss-gold/20 relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl ss-inset flex items-center justify-center text-ss-gold">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-runic font-bold text-lg text-ss-silver">
                    Rutina AM (Protección & Control)
                  </h3>
                  <span className="text-[10px] font-spell text-gray-400">06:00 - 06:15 AM</span>
                </div>
              </div>

              <button
                onClick={() => toggleSkincareHabit('skincareAm')}
                className={`ss-btn px-3 py-1.5 rounded-xl text-xs font-spell font-bold flex items-center gap-1.5 transition-all ${
                  habitos?.skincareAm
                    ? 'ss-btn-active text-ss-gold border border-ss-gold/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{habitos?.skincareAm ? 'Completada Hoy' : 'Marcar Hecha'}</span>
              </button>
            </div>

            {productosAM.length === 0 ? (
              <div className="p-6 text-center text-xs font-spell text-gray-500 ss-inset rounded-xl">
                No tienes productos asignados a la rutina AM activa. Actívalos en el Administrador de
                Productos.
              </div>
            ) : (
              <div className="space-y-3">
                {productosAM.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-spell font-bold text-xs text-ss-gold flex items-center gap-2">
                        <span>Paso {prod.pasoNumero}:</span>
                        <span>{prod.nombre}</span>
                      </span>
                      <span
                        className={`text-[9px] font-spell px-2 py-0.5 rounded border ${getCategoriaBadge(
                          prod.categoria
                        )}`}
                      >
                        {prod.categoria.replace('_', ' ')}
                      </span>
                    </div>
                    {prod.marca && (
                      <span className="text-[10px] font-spell text-gray-400 block">
                        Marca: {prod.marca}
                      </span>
                    )}
                    {prod.instrucciones && (
                      <p className="text-xs font-ui text-gray-300">{prod.instrucciones}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rutina Nocturna (PM) */}
          <div className="ss-card p-6 border border-ss-purple/20 relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl ss-inset flex items-center justify-center text-ss-purple">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-runic font-bold text-lg text-ss-silver">
                    Rutina PM (Reparación & Regeneración)
                  </h3>
                  <span className="text-[10px] font-spell text-gray-400">22:30 - 22:45 PM</span>
                </div>
              </div>

              <button
                onClick={() => toggleSkincareHabit('skincarePm')}
                className={`ss-btn px-3 py-1.5 rounded-xl text-xs font-spell font-bold flex items-center gap-1.5 transition-all ${
                  habitos?.skincarePm
                    ? 'ss-btn-active text-ss-purple border border-ss-purple/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{habitos?.skincarePm ? 'Completada Hoy' : 'Marcar Hecha'}</span>
              </button>
            </div>

            {productosPM.length === 0 ? (
              <div className="p-6 text-center text-xs font-spell text-gray-500 ss-inset rounded-xl">
                No tienes productos asignados a la rutina PM activa. Actívalos en el Administrador de
                Productos.
              </div>
            ) : (
              <div className="space-y-3">
                {productosPM.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl ss-inset border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-spell font-bold text-xs text-ss-purple flex items-center gap-2">
                        <span>Paso {prod.pasoNumero}:</span>
                        <span>{prod.nombre}</span>
                      </span>
                      <span
                        className={`text-[9px] font-spell px-2 py-0.5 rounded border ${getCategoriaBadge(
                          prod.categoria
                        )}`}
                      >
                        {prod.categoria.replace('_', ' ')}
                      </span>
                    </div>
                    {prod.marca && (
                      <span className="text-[10px] font-spell text-gray-400 block">
                        Marca: {prod.marca}
                      </span>
                    )}
                    {prod.instrucciones && (
                      <p className="text-xs font-ui text-gray-300">{prod.instrucciones}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: Administrador de Productos */}
      {activeTab === 'productos' && (
        <div className="ss-card p-6 border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-runic font-bold text-xl text-ss-silver flex items-center gap-2">
                <Package className="w-5 h-5 text-ss-cyan" />
                Lista Maestra de Productos Cutáneos
              </h3>
              <p className="text-xs text-gray-400 font-spell">
                Gestiona los productos que estás utilizando actualmente, actívalos o páusalos con un clic.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="ss-btn px-4 py-2 rounded-xl text-xs font-spell font-bold text-ss-cyan border border-ss-cyan/30 hover:border-ss-cyan flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir a la Lista</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((prod) => (
              <div
                key={prod.id}
                className={`p-4 rounded-xl ss-inset border transition-all flex flex-col justify-between space-y-3 ${
                  prod.enUso ? 'border-white/10' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-spell font-bold text-sm text-white">{prod.nombre}</h4>
                      <span className="text-xs text-gray-400 font-spell">
                        {prod.marca || 'Sin marca'} • Paso {prod.pasoNumero}
                      </span>
                    </div>

                    {/* Toggle En Uso */}
                    <button
                      onClick={() => handleToggleProductStatus(prod)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-spell font-bold transition-all flex items-center gap-1 ${
                        prod.enUso
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-gray-500 border border-white/10'
                      }`}
                      title={prod.enUso ? 'Pausar producto' : 'Activar producto en rutina'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{prod.enUso ? 'En Uso' : 'Pausado'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`text-[9px] font-spell px-2 py-0.5 rounded border ${getCategoriaBadge(
                        prod.categoria
                      )}`}
                    >
                      {prod.categoria.replace('_', ' ')}
                    </span>

                    <span className="text-[9px] font-spell px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                      {prod.momento === 'AM_PM'
                        ? '☀️ Mañana y 🌙 Noche'
                        : prod.momento === 'AM'
                        ? '☀️ Solo AM'
                        : '🌙 Solo PM'}
                    </span>

                    {prod.precio && (
                      <span className="text-[9px] font-spell px-2 py-0.5 rounded bg-ss-gold/10 text-ss-gold border border-ss-gold/20">
                        {formatPEN(Number(prod.precio))}
                      </span>
                    )}
                  </div>

                  {prod.instrucciones && (
                    <p className="text-xs font-ui text-gray-300 line-clamp-2">
                      {prod.instrucciones}
                    </p>
                  )}
                  {prod.notas && (
                    <p className="text-[11px] font-spell text-gray-500 italic">
                      Nota: {prod.notas}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-ss-cyan hover:bg-white/5 transition-colors"
                    title="Editar producto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Diagnóstico Cutáneo & Pautas Clínicas */}
      {activeTab === 'diagnostico' && (
        <div className="ss-card p-6 border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl ss-inset flex items-center justify-center text-ss-cyan">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-runic font-bold text-xl text-ss-silver">
                Ficha Dermatológica & Diagnóstico Inicial
              </h3>
              <p className="text-xs text-gray-400 font-spell">
                Datos migrados de la evaluación inicial médica y biológica
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl ss-inset border border-white/5 space-y-2">
              <span className="text-xs font-spell text-ss-gold block font-bold">
                1. Tipo Cutáneo & Zona T
              </span>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                Piel mixta a grasa con reactividad moderada. Presenta poros dilatados y secreción
                sebácea en nariz y frente, pero con susceptibilidad a deshidratación si se utilizan
                jabones agresivos.
              </p>
            </div>

            <div className="p-4 rounded-xl ss-inset border border-white/5 space-y-2">
              <span className="text-xs font-spell text-ss-purple block font-bold">
                2. Cuero Cabelludo & Hebras
              </span>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                Cuero cabelludo graso con ondas tipo 2B. Requiere lavado con sulfatos suaves y agua
                tibia. Evitar el agua hirviendo que despoja la barrera de lípidos y detona efecto
                rebote de grasa.
              </p>
            </div>

            <div className="p-4 rounded-xl ss-inset border border-white/5 space-y-2">
              <span className="text-xs font-spell text-ss-cyan block font-bold">
                3. Filosofía de Cuidado
              </span>
              <p className="text-xs text-gray-300 font-ui leading-relaxed">
                Constancia sobre complejidad. 3 pasos en la mañana (Limpieza suave + Hidratación
                matificante + Protector SPF 50+) y 2-3 pasos en la noche (Doble limpieza + Reparador
                con ceramidas).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl ss-inset border border-ss-crimson/20 space-y-2">
            <div className="flex items-center gap-2 text-ss-crimson text-xs font-spell font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>Anti-Metas y Reglas Innegociables:</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1 font-ui list-disc pl-5">
              <li>No reventar granos ni tocarse el rostro durante la jornada laboral audiovisual.</li>
              <li>No usar exfoliantes de microgránulos abrasivos (provocan microfisuras).</li>
              <li>No saltarse el protector solar matutino aunque el día esté nublado en Lima.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal para Crear o Editar Producto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-lg w-full p-6 ss-card border border-white/10 rounded-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h4 className="font-runic font-bold text-base text-ss-silver flex items-center gap-2">
                <Package className="w-4 h-4 text-ss-cyan" />
                {editingProduct ? 'Editar Producto' : 'Añadir Producto al Inventario'}
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-spell"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Gel Limpiador Purificante, Protector Solar..."
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Marca / Laboratorio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Yanbal, CeraVe, Eucerin..."
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Paso en la Rutina (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.pasoNumero}
                    onChange={(e) =>
                      setFormData({ ...formData, pasoNumero: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Momento</label>
                  <select
                    value={formData.momento}
                    onChange={(e) =>
                      setFormData({ ...formData, momento: e.target.value as any })
                    }
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="AM_PM" className="bg-[#15181e]">
                      ☀️ Mañana y 🌙 Noche
                    </option>
                    <option value="AM" className="bg-[#15181e]">
                      ☀️ Solo Mañana (AM)
                    </option>
                    <option value="PM" className="bg-[#15181e]">
                      🌙 Solo Noche (PM)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  >
                    <option value="LIMPIADOR" className="bg-[#15181e]">
                      Limpiador
                    </option>
                    <option value="HIDRATANTE" className="bg-[#15181e]">
                      Hidratante
                    </option>
                    <option value="PROTECTOR_SOLAR" className="bg-[#15181e]">
                      Protector Solar
                    </option>
                    <option value="REPARADOR_BARRERA" className="bg-[#15181e]">
                      Reparador de Barrera
                    </option>
                    <option value="ACTIVO_TRATAMIENTO" className="bg-[#15181e]">
                      Activo / Tratamiento
                    </option>
                    <option value="CORPORAL" className="bg-[#15181e]">
                      Corporal
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-spell text-gray-400 block mb-1">
                    Precio Estimado (S/)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    placeholder="Ej: 45.00"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-spell">
                    <input
                      type="checkbox"
                      checked={formData.enUso}
                      onChange={(e) => setFormData({ ...formData, enUso: e.target.checked })}
                      className="accent-ss-cyan"
                    />
                    <span className="text-gray-300">Activo en uso hoy</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Instrucciones de Aplicación
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Aplicar 2 dedos sobre rostro y cuello 15 min antes de salir..."
                  value={formData.instrucciones}
                  onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-spell text-gray-400 block mb-1">
                  Notas u Observaciones
                </label>
                <input
                  type="text"
                  placeholder="Ej: Fórmula no comedogénica, textura gel matificante"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl ss-inset border border-white/10 text-white text-xs font-spell focus:outline-none focus:border-ss-cyan"
                />
              </div>

              <button
                type="submit"
                disabled={savingProduct}
                className="w-full py-2.5 rounded-xl ss-btn font-spell font-bold text-xs text-ss-cyan border border-ss-cyan/40 hover:border-ss-cyan ss-glow-cyan flex items-center justify-center gap-2 mt-4"
              >
                {savingProduct ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}</span>
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
