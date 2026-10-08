import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : toast.type === 'info'
              ? 'bg-zinc-900 text-white border-zinc-800'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-orange-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:bg-black/10 transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
};
