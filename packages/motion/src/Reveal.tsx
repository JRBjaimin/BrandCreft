'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import { EASE_BOLD, DURATION } from './tokens';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Extra delay in seconds — used to hand-stagger a handful of elements. */
  delay?: number;
  /** Vertical travel distance in px. */
  distance?: number;
  /** 'mount' animates as soon as rendered; 'scroll' waits until in view. */
  trigger?: 'mount' | 'scroll';
}

/** Fade + rise + gentle scale-in — the default "this just appeared" moment. */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  distance = 28,
  trigger = 'scroll',
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const hidden = { opacity: 0, y: distance, scale: 0.96 };
  const shown = { opacity: 1, y: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      {...(trigger === 'scroll'
        ? { whileInView: shown, viewport: { once: true, margin: '-80px' } }
        : { animate: shown })}
      transition={{ duration: DURATION.base, ease: EASE_BOLD, delay }}
    >
      {children}
    </motion.div>
  );
}
