'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export interface CountUpProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
  style?: CSSProperties;
}

/** Animates a number counting up to `value` the first time it scrolls into view. */
export function CountUp({ value, format, className, style }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 110, damping: 20, mass: 0.9 });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (inView) motionValue.set(value);
  }, [inView, value, reduceMotion, motionValue]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    return spring.on('change', (v) => setDisplay(v));
  }, [spring, reduceMotion]);

  const formatted = format ? format(display) : Math.round(display).toLocaleString();

  return (
    <span ref={ref} className={className} style={style}>
      {formatted}
    </span>
  );
}
