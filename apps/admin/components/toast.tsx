'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SPRING_BOUNCY } from '@brandcraft/motion';

interface ToastApi {
  toast: (message: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string }[]>([]);
  const reduceMotion = useReducedMotion();

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
        <AnimatePresence>
          {items.map((i) => (
            <motion.div
              key={i.id}
              className="toast"
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.9 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.15 } }
              }
              transition={SPRING_BOUNCY}
            >
              {i.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
