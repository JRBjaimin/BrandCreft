'use client';

import { useEffect, useState } from 'react';
import type { HealthResponse } from '@brandcraft/types';
import { api } from '../lib/api';

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; data: HealthResponse }
  | { kind: 'error'; message: string };

export function ApiStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    api
      .health()
      .then((data) => !cancelled && setState({ kind: 'ok', data }))
      .catch((err: unknown) =>
        setState({ kind: 'error', message: err instanceof Error ? err.message : 'unknown error' }),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === 'loading') return <p>Checking API…</p>;
  if (state.kind === 'error')
    return <p style={{ color: 'crimson' }}>API unreachable: {state.message}</p>;

  return <p>API status: {state.data.status}</p>;
}
