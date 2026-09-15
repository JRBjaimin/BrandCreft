'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';
import { STAGGER_STEP, DURATION, EASE_BOLD } from './tokens';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER_STEP, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_BOLD },
  },
};

export interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  trigger?: 'mount' | 'scroll';
}

/**
 * Wraps a grid/list of <StaggerItem> children so they cascade in rather than
 * popping in all at once. Renders a plain div — safe for card grids, not
 * intended for <table> markup (transform-based animation on <tr>/<tbody> is
 * unreliable across browsers; table lists get a single <Reveal> instead).
 */
export function StaggerGroup({
  children,
  className,
  style,
  trigger = 'scroll',
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      variants={containerVariants}
      {...(trigger === 'scroll'
        ? { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
        : { animate: 'show' })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} style={style} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
