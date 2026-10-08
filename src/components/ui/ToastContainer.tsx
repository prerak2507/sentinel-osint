'use client';

import React from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useIntelligence();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/30 bg-emerald-950/20';
            case 'warning':
              return 'border-amber-500/30 bg-amber-950/20';
            case 'error':
              return 'border-rose-500/30 bg-rose-950/20';
            default:
              return 'border-blue-500/30 bg-blue-950/20';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${getBorderColor()}`}
            style={{ backgroundColor: 'rgba(13, 18, 29, 0.95)' }}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-200 tracking-wide">{toast.title}</div>
              <div className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-1 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
