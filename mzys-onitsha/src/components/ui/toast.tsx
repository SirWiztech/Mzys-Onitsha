'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const icons: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, { border: string; bg: string; icon: string; title: string }> = {
  success: { border: 'border-emerald-200', bg: 'bg-emerald-50', icon: 'text-emerald-500', title: 'text-emerald-800' },
  error: { border: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-500', title: 'text-red-800' },
  info: { border: 'border-blue-200', bg: 'bg-blue-50', icon: 'text-blue-500', title: 'text-blue-800' },
  warning: { border: 'border-amber-200', bg: 'bg-amber-50', icon: 'text-amber-500', title: 'text-amber-800' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const s = styles[toast.type];
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto animate-slide-in-right ${s.bg} border ${s.border} rounded-xl shadow-lg p-4 flex items-start gap-3`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${s.icon}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${s.title}`}>{toast.title}</p>
                {toast.message && <p className="text-sm text-gray-600 mt-0.5">{toast.message}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
