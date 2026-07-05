import React from 'react';
import { useAppStore } from '../store/appStore';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAppStore();
  const { dir } = useLanguage();

  return (
    <div 
      className={`fixed z-50 bottom-24 max-w-sm w-full px-4 flex flex-col gap-2 pointer-events-none ${
        dir === 'rtl' ? 'left-0 md:left-4' : 'right-0 md:right-4'
      }`}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 border-slate-800 text-slate-100';
          let Icon = Info;
          let iconColor = 'text-cyan-400';

          if (toast.type === 'success') {
            bgClass = 'bg-slate-950/95 border-emerald-500/40 text-emerald-50';
            Icon = CheckCircle;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-slate-950/95 border-rose-500/40 text-rose-50';
            Icon = AlertTriangle;
            iconColor = 'text-rose-400';
          } else if (toast.type === 'info') {
            bgClass = 'bg-slate-950/95 border-cyan-500/40 text-cyan-50';
            Icon = Info;
            iconColor = 'text-cyan-400';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 border shadow-2xl backdrop-blur-md flex items-start gap-3 rounded-none ${bgClass}`}
              style={{ direction: dir }}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-xs sm:text-sm font-medium tracking-tight leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white transition-colors p-0.5 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
