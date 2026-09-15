'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { RateHistoryEntry } from '@brandcraft/storefront-data';

export function RateSparkline({
  history,
  positive,
}: {
  history: RateHistoryEntry[];
  positive: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (history.length < 2) return null;
  const values = history.map((h) => h.pricePerGram);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="14-day rate trend"
    >
      <motion.polyline
        points={points}
        fill="none"
        stroke={positive ? 'var(--success)' : 'var(--danger)'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? undefined : { pathLength: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
