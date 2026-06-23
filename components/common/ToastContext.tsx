import React, { createContext, useState, useCallback, useContext, useRef, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-teal-500 shrink-0" strokeWidth={1.8} />,
  error: <AlertCircle size={18} className="text-red-500 shrink-0" strokeWidth={1.8} />,
  info: <Info size={18} className="text-teal-500 shrink-0" strokeWidth={1.8} />,
};

const BG_MAP: Record<ToastType, string> = {
  success: 'bg-teal-50 border-teal-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-teal-50 border-teal-200',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    info: (msg: string) => addToast('info', msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] ${BG_MAP[t.type]}`}
            style={{ animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 3.2s forwards' }}
          >
            {ICON_MAP[t.type]}
            <p className="text-sm font-medium text-stone-800 flex-grow">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-stone-400 hover:text-stone-600 shrink-0 transition-colors duration-200"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType['toast'] => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context.toast;
};
