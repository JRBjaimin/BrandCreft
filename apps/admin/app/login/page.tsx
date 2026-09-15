'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Reveal, StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { SuccessBurst } from '@brandcraft/motion/success-burst';
import { useAuth } from '../../lib/auth';
import { useData } from '../../lib/mock/store';
import {
  matchBusinessAccount,
  matchSuperAdmin,
  normalizeLoginId,
  type ResolvedAccount,
} from '../../lib/demo-accounts';
import { Button, Field, Input } from '../../components/ui';
import { initials } from '../../lib/format';

const SUPER_ADMIN_LABEL = 'Platform Admin';

const HIGHLIGHTS = [
  { icon: '✦', text: 'Manage every business, product and campaign from one console.' },
  { icon: '✎', text: 'Review AI-generated creatives and approve them before they publish.' },
  { icon: '⇄', text: 'Track WhatsApp, Instagram and rate integrations at a glance.' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { data } = useData();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<ResolvedAccount | null>(null);

  const activeBusinesses = useMemo(
    () => data.businesses.filter((b) => b.status === 'ACTIVE'),
    [data.businesses],
  );

  const fillSuperAdmin = () => {
    setLoginId('admin');
    setPassword('admin');
    setError('');
  };

  const fillBusiness = (businessName: string) => {
    const id = normalizeLoginId(businessName);
    setLoginId(id);
    setPassword(id);
    setError('');
  };

  const finalizeLogin = (account: ResolvedAccount) => {
    login({
      email: account.email,
      name: account.name,
      mode: account.mode,
      businessId: account.businessId,
    });
    router.push(account.mode === 'super' ? '/admin' : '/dashboard');
  };

  // If motion is reduced, SuccessBurst never renders (so its onComplete never
  // fires) — finalize immediately instead of stranding the user mid-login.
  useEffect(() => {
    if (success && reduceMotion) finalizeLogin(success);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, reduceMotion]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // A brief simulated round-trip — this is still a mock login (see
    // lib/demo-accounts.ts), but a real gate: only a matching account proceeds.
    window.setTimeout(() => {
      const account =
        matchSuperAdmin(loginId, password) ??
        matchBusinessAccount(data.businesses, data.users, loginId, password);
      setLoading(false);
      if (!account) {
        setError('Invalid email/username or password.');
        return;
      }
      setSuccess(account);
    }, 450);
  };

  return (
    <div className="login-wrap">
      <div className="login-brand-panel">
        <div className="brand">
          <span className="dot" style={{ width: 26, height: 26 }} />
          BrandCraft
        </div>
        <div>
          <h2>One console for every business you run.</h2>
          <StaggerGroup className="login-highlights" trigger="mount">
            {HIGHLIGHTS.map((h) => (
              <StaggerItem className="login-highlight" key={h.text}>
                <span className="ico">{h.icon}</span>
                <span>{h.text}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
        <span style={{ fontSize: 12, opacity: 0.6 }}>© {new Date().getFullYear()} BrandCraft</span>
      </div>

      <div className="login-form-side">
        <Reveal trigger="mount" style={{ position: 'relative', width: 'min(400px, 100%)' }}>
          <form className="login-card" onSubmit={submit} style={{ width: '100%' }}>
            <div className="brand">
              <span className="sidebar-brand" style={{ padding: 0 }}>
                <span className="dot" style={{ width: 26, height: 26 }} />
              </span>
              BrandCraft
            </div>
            <p className="muted" style={{ marginTop: 0 }}>
              Admin console — sign in to continue
            </p>

            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}

            <Field label="Email or username">
              <Input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                autoFocus
                required
              />
            </Field>
            <Field label="Password">
              <div className="password-field">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: 6 }}
            >
              {loading ? <span className="spinner" aria-hidden /> : 'Sign in'}
            </Button>

            <div className="divider-label">Demo accounts</div>
            <div className="demo-accounts">
              <button type="button" className="demo-account-btn" onClick={fillSuperAdmin}>
                <span className="demo-account-avatar">{initials(SUPER_ADMIN_LABEL)}</span>
                <span className="stack">
                  <strong style={{ fontSize: 13 }}>{SUPER_ADMIN_LABEL}</strong>
                  <span className="cell-sub">Super Admin · admin / admin</span>
                </span>
              </button>
              {activeBusinesses.map((b) => {
                const id = normalizeLoginId(b.name);
                return (
                  <button
                    type="button"
                    key={b.id}
                    className="demo-account-btn"
                    onClick={() => fillBusiness(b.name)}
                  >
                    <span className="demo-account-avatar">{initials(b.name)}</span>
                    <span className="stack">
                      <strong style={{ fontSize: 13 }}>{b.name}</strong>
                      <span className="cell-sub">
                        Business Owner · {id} / {id}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="cell-sub" style={{ marginTop: 10 }}>
              Tip: &quot;superadmin&quot; / &quot;superadmin&quot; also signs in as Super Admin.
            </p>
          </form>

          <AnimatePresence>
            {success && !reduceMotion && (
              <motion.div
                className="login-success-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessBurst size={96} onComplete={() => finalizeLogin(success)} />
                <strong>Welcome, {success.name.split(' ')[0]}</strong>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}
