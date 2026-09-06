'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useData } from '../lib/mock/store';
import { initials } from '../lib/format';
import { Modal } from './overlay';
import { Button } from './ui';

interface NavLink {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const { data } = useData();
  if (!session) return null;

  const bizId = session.activeBusinessId;
  const business = data.businesses.find((b) => b.id === bizId);
  const pendingCreatives = data.creatives.filter(
    (c) => c.businessId === bizId && c.status === 'PENDING_APPROVAL',
  ).length;
  const rateEnabled = business
    ? data.categories.find((c) => c.key === business.categoryKey)?.rateModuleEnabled
    : false;

  const businessNav: NavLink[] = [
    { href: '/dashboard', label: 'Dashboard', icon: '◉' },
    { href: '/products', label: 'Products', icon: '▦' },
    { href: '/campaigns', label: 'Campaigns', icon: '✦' },
    { href: '/creatives', label: 'Creatives', icon: '✎', badge: pendingCreatives || undefined },
    ...(rateEnabled ? [{ href: '/rates', label: 'Rates', icon: '₹' } as NavLink] : []),
    { href: '/integrations', label: 'Integrations', icon: '⇄' },
    { href: '/profile', label: 'Business profile', icon: '⚑' },
  ];

  const superNav: NavLink[] = [
    { href: '/admin', label: 'Overview', icon: '◉' },
    { href: '/admin/businesses', label: 'Businesses', icon: '▤' },
    { href: '/admin/users', label: 'Users', icon: '☺' },
    { href: '/admin/platform', label: 'Platform config', icon: '⚙' },
    { href: '/admin/operations', label: 'Operations', icon: '❖' },
  ];

  const nav = session.mode === 'super' ? superNav : businessNav;
  const sectionLabel = session.mode === 'super' ? 'Super Admin' : business?.name ?? 'Business';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="dot" />
        BrandCraft
      </div>
      <div className="sidebar-section">{sectionLabel}</div>
      {nav.map((n) => {
        const active = pathname === n.href || (n.href !== '/dashboard' && n.href !== '/admin' && pathname.startsWith(n.href));
        return (
          <Link key={n.href} href={n.href} className={`nav-item ${active ? 'active' : ''}`}>
            <span className="ico">{n.icon}</span>
            {n.label}
            {n.badge ? <span className="count">{n.badge}</span> : null}
          </Link>
        );
      })}
      <div style={{ marginTop: 'auto' }} className="sidebar-section">
        Signed in
      </div>
      <div className="nav-item" style={{ cursor: 'default' }}>
        <span className="avatar">{initials(session.name)}</span>
        <span className="stack" style={{ overflow: 'hidden' }}>
          <span style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {session.name}
          </span>
          <span className="cell-sub">{session.email}</span>
        </span>
      </div>
    </aside>
  );
}

export function Topbar() {
  const { session, setMode, setActiveBusiness, logout } = useAuth();
  const { data, markNotificationsRead } = useData();
  const router = useRouter();
  const [switcher, setSwitcher] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notif, setNotif] = useState(false);

  if (!session) return null;

  const business = data.businesses.find((b) => b.id === session.activeBusinessId);
  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      <button className="context-switch" onClick={() => setSwitcher(true)}>
        <small>{session.mode === 'super' ? 'Console' : 'Business'}</small>
        <strong>{session.mode === 'super' ? 'Super Admin' : business?.name ?? 'Select business'}</strong>
        <span className="faint">▾</span>
      </button>

      <div className="spacer" />

      <div style={{ position: 'relative' }}>
        <button className="icon-btn" onClick={() => setNotif((v) => !v)} aria-label="Notifications">
          🔔{unread ? <span className="count" style={{ position: 'absolute', top: -2, right: -2 }}>{unread}</span> : null}
        </button>
        {notif && (
          <div
            className="card"
            style={{ position: 'absolute', right: 0, top: 38, width: 320, zIndex: 40, boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="card-head">
              <h3>Notifications</h3>
              <div className="actions">
                <button className="btn ghost sm" onClick={markNotificationsRead}>
                  Mark all read
                </button>
              </div>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {data.notifications.map((n) => (
                <div key={n.id} className="card-pad" style={{ borderBottom: '1px solid var(--border)', opacity: n.read ? 0.6 : 1 }}>
                  <div style={{ fontWeight: 600 }}>{n.title}</div>
                  <div className="cell-sub">{n.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <button className="context-switch" onClick={() => setMenu((v) => !v)}>
          <span className="avatar">{initials(session.name)}</span>
          <span className="faint">▾</span>
        </button>
        {menu && (
          <div
            className="card"
            style={{ position: 'absolute', right: 0, top: 44, width: 200, zIndex: 40, boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="card-pad stack">
              <strong>{session.name}</strong>
              <span className="cell-sub">{session.email}</span>
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <button
              className="nav-item"
              style={{ width: '100%' }}
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              <span className="ico">⎋</span> Sign out
            </button>
          </div>
        )}
      </div>

      {switcher && (
        <Modal title="Switch console" onClose={() => setSwitcher(false)}>
          <div className="stack" style={{ gap: 10 }}>
            <button
              className={`chip ${session.mode === 'super' ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '12px 14px' }}
              onClick={() => {
                setMode('super');
                setSwitcher(false);
                router.push('/admin');
              }}
            >
              <strong>Super Admin</strong>
              <div className="cell-sub">Platform operations across all businesses</div>
            </button>
            <div className="sidebar-section" style={{ padding: '8px 2px 2px' }}>
              Business Admin
            </div>
            {data.businesses.map((b) => (
              <button
                key={b.id}
                className={`chip ${session.mode === 'business' && session.activeBusinessId === b.id ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '12px 14px' }}
                onClick={() => {
                  setActiveBusiness(b.id);
                  setSwitcher(false);
                  router.push('/dashboard');
                }}
              >
                <strong>{b.name}</strong>
                <div className="cell-sub">
                  {data.categories.find((c) => c.key === b.categoryKey)?.label} · {b.status}
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </header>
  );
}

export function ResetDataButton() {
  const { reset } = useData();
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        reset();
        window.location.reload();
      }}
    >
      Reset demo data
    </Button>
  );
}
