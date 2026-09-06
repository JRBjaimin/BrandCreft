'use client';

/**
 * Mock authentication. No backend — any email/password is accepted, and the
 * chosen "mode" decides which console the user lands in. Real JWT auth arrives
 * in Phase 3; this keeps the same surface (`useAuth`).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Mode = 'super' | 'business';

export interface Session {
  name: string;
  email: string;
  mode: Mode;
  activeBusinessId: string | null;
}

const KEY = 'brandcraft.admin.session';

interface AuthApi {
  session: Session | null;
  ready: boolean;
  login: (input: { email: string; name?: string; mode: Mode; businessId?: string | null }) => void;
  logout: () => void;
  setMode: (mode: Mode) => void;
  setActiveBusiness: (id: string) => void;
}

const Ctx = createContext<AuthApi | null>(null);

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'User';
  return local
    .split(/[._-]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((s: Session | null) => {
    setSession(s);
    try {
      if (s) window.localStorage.setItem(KEY, JSON.stringify(s));
      else window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback<AuthApi['login']>(
    ({ email, name, mode, businessId }) => {
      persist({
        email,
        name: name ?? nameFromEmail(email),
        mode,
        activeBusinessId: mode === 'business' ? (businessId ?? null) : null,
      });
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const setMode = useCallback<AuthApi['setMode']>(
    (mode) => setSession((s) => {
      if (!s) return s;
      const next = { ...s, mode };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    }),
    [],
  );

  const setActiveBusiness = useCallback<AuthApi['setActiveBusiness']>((idv) => {
    setSession((s) => {
      if (!s) return s;
      const next = { ...s, activeBusinessId: idv, mode: 'business' as Mode };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const api = useMemo<AuthApi>(
    () => ({ session, ready, login, logout, setMode, setActiveBusiness }),
    [session, ready, login, logout, setMode, setActiveBusiness],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
