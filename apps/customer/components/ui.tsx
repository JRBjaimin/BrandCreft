import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SPRING_SNAPPY } from '@brandcraft/motion';

type ButtonVariant = 'default' | 'primary' | 'whatsapp' | 'ghost';
type ButtonSize = 'md' | 'sm';

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export function Button({
  variant = 'default',
  size = 'md',
  block,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const cls = [
    'btn',
    variant !== 'default' ? variant : '',
    size === 'sm' ? 'sm' : '',
    block ? 'block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const interactive = !disabled && !reduceMotion;
  return (
    <motion.button
      className={cls}
      disabled={disabled}
      whileHover={interactive ? { scale: 1.04 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      transition={SPRING_SNAPPY}
      {...rest}
    />
  );
}

type LinkButtonProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export function LinkButton({
  variant = 'default',
  size = 'md',
  block,
  className = '',
  ...rest
}: LinkButtonProps) {
  const reduceMotion = useReducedMotion();
  const cls = [
    'btn',
    variant !== 'default' ? variant : '',
    size === 'sm' ? 'sm' : '',
    block ? 'block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <motion.a
      className={cls}
      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={SPRING_SNAPPY}
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- content comes from rest via children
      {...rest}
    />
  );
}

export type BadgeTone = 'default' | 'success' | 'danger' | 'warning';

export function Badge({ tone = 'default', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge ${tone !== 'default' ? tone : ''}`}>{children}</span>;
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
    <div className="chip-row">
      {options.map((o) => (
        <motion.button
          key={o.value}
          type="button"
          className="chip"
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
          whileTap={reduceMotion ? undefined : { scale: 0.93 }}
          transition={SPRING_SNAPPY}
        >
          {o.label}
        </motion.button>
      ))}
    </div>
  );
}

export function EmptyState({
  icon = '∅',
  title,
  hint,
}: {
  icon?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="empty">
      <div className="big">{icon}</div>
      <strong>{title}</strong>
      {hint && (
        <p className="muted" style={{ marginTop: 6 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
