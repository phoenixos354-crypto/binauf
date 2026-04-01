import { useEffect, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let addToastGlobal: ((msg: string, type?: ToastType) => void) | null = null;

export function showToast(msg: string, type: ToastType = 'success') {
  addToastGlobal?.(msg, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          style={{ cursor: 'pointer' }}
          onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
        >
          <span>{icons[t.type]}</span>
          <span style={{ lineHeight: 1.4 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
