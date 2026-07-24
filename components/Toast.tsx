'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  push: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const push = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const colors: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-brand-500',
  };

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`animate-fade-in-up rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-card ${colors[t.type]}`}
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}
