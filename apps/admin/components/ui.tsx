'use client';

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CountUp, SPRING_SNAPPY } from '@brandcraft/motion';

/* ---------------- Button ---------------- */

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> & {
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'md' | 'sm';
};

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const cls = ['btn', variant !== 'default' ? variant : '', size === 'sm' ? 'sm' : '', className]
    .filter(Boolean)
    .join(' ');
  const interactive = !disabled && !reduceMotion;
  return (
    <motion.button
      className={cls}
      disabled={disabled}
      whileHover={interactive ? { scale: 1.035 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      transition={SPRING_SNAPPY}
      {...rest}
    />
  );
}

/* ---------------- Badge ---------------- */

export type BadgeTone = 'grey' | 'green' | 'amber' | 'red' | 'blue' | 'violet';

export function Badge({
  tone = 'grey',
  dot = false,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`badge ${tone === 'grey' ? '' : tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/* ---------------- Card ---------------- */

export function Card({
  children,
  className = '',
  pad = false,
  style,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const interactive = Boolean(onClick) && !reduceMotion;
  return (
    <motion.div
      className={`card ${pad ? 'card-pad' : ''} ${className}`}
      style={style}
      onClick={onClick}
      whileHover={interactive ? { y: -6 } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      transition={SPRING_SNAPPY}
    >
      {children}
    </motion.div>
  );
}

export function CardHead({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="card-head">
      <h3>{title}</h3>
      {children && <div className="actions">{children}</div>}
    </div>
  );
}

/* ---------------- StatCard ---------------- */

export function StatCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
}) {
  return (
    <div className="card stat">
      <div className="label">{label}</div>
      {typeof value === 'number' ? (
        <CountUp
          value={value}
          className="value"
          format={(n) => Math.round(n).toLocaleString('en-IN')}
        />
      ) : (
        <div className="value">{value}</div>
      )}
      {delta && <div className={`delta ${trend === 'flat' ? '' : (trend ?? '')}`}>{delta}</div>}
    </div>
  );
}

/* ---------------- PageHeader ---------------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

/* ---------------- Fields ---------------- */

export function Field({
  label,
  hint,
  error,
  children,
  full,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      {label && <label>{label}</label>}
      {children}
      {error ? (
        <span className="err">{error}</span>
      ) : hint ? (
        <span className="hint">{hint}</span>
      ) : null}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea" {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="select" {...props} />;
}

/* ---------------- Misc ---------------- */

export function EmptyState({
  icon = '∅',
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="big">{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{title}</div>
      {hint && <div style={{ marginTop: 4 }}>{hint}</div>}
      {action && <div className="mt-16">{action}</div>}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Swatch({ color }: { color: string }) {
  return <span className="swatch" style={{ background: color }} title={color} />;
}

export function Thumb({ src, alt, size = 'sm' }: { src: string; alt: string; size?: 'sm' | 'lg' }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`thumb ${size === 'lg' ? 'lg' : ''}`} src={src} alt={alt} />;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>;
}

export function Chips({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="chips">
      {options.map((o) => (
        <motion.button
          key={o.value}
          className={`chip ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange(o.value)}
          type="button"
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          transition={SPRING_SNAPPY}
        >
          {o.label}
        </motion.button>
      ))}
    </div>
  );
}
