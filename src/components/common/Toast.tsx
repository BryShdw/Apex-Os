'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

const TOAST_EVENT = 'apex_toast_event';

export const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(TOAST_EVENT, {
          detail: { id: Math.random().toString(36).substring(2, 9), message, type: 'success' },
        })
      );
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(TOAST_EVENT, {
          detail: { id: Math.random().toString(36).substring(2, 9), message, type: 'error' },
        })
      );
    }
  },
  info: (message: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(TOAST_EVENT, {
          detail: { id: Math.random().toString(36).substring(2, 9), message, type: 'info' },
        })
      );
    }
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (customEvent.detail) {
        const item = customEvent.detail;
        setToasts((prev) => [...prev, item]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== item.id));
        }, 4000);
      }
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        let borderClass = 'border-emerald-500/40 bg-[#16201a]/95 text-emerald-300';
        let Icon = CheckCircle2;

        if (t.type === 'error') {
          borderClass = 'border-rose-500/40 bg-[#25161a]/95 text-rose-300';
          Icon = AlertCircle;
        } else if (t.type === 'info') {
          borderClass = 'border-cyan-500/40 bg-[#141e28]/95 text-cyan-300';
          Icon = Info;
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium leading-snug">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
