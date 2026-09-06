'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface ToastApi {
  toast: (message: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string }[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, message }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 2600);
  }, []);

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="toast-wrap">
        {items.map((i) => (
          <div key={i.id} className="toast">
            {i.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
