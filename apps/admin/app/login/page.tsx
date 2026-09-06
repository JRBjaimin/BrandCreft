'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type Mode } from '../../lib/auth';
import { useData } from '../../lib/mock/store';
import { Button, Field, Input } from '../../components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const { data } = useData();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('business');
  const [email, setEmail] = useState('meera@smrjewellers.in');
  const [password, setPassword] = useState('demo-password');
  const [businessId, setBusinessId] = useState(data.businesses[0]?.id ?? '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, mode, businessId: mode === 'business' ? businessId : null });
    router.push(mode === 'super' ? '/admin' : '/dashboard');
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="brand">
          <span className="sidebar-brand" style={{ padding: 0 }}>
            <span className="dot" style={{ width: 26, height: 26 }} />
          </span>
          BrandCraft
        </div>
        <p className="muted" style={{ marginTop: 0 }}>
          Admin console — sign in to continue
        </p>

        <div className="seg" style={{ margin: '18px 0' }}>
          <button type="button" className={mode === 'business' ? 'active' : ''} onClick={() => setMode('business')}>
            Business Admin
          </button>
          <button type="button" className={mode === 'super' ? 'active' : ''} onClick={() => setMode('super')}>
            Super Admin
          </button>
        </div>

        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" hint="Any value works — this is a mock login.">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>

        {mode === 'business' && (
          <Field label="Business">
            <select className="select" value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
              {data.businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Button variant="primary" type="submit" style={{ width: '100%', marginTop: 6 }}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
