'use client';

import type { RateHistoryEntry, RatePoint } from '@brandcraft/storefront-data';
import { CountUp } from '@brandcraft/motion';
import { inr, relTime } from '../../lib/format';
import { RateSparkline } from './RateSparkline';

export function RatesWidget({
  rates,
  history,
}: {
  rates: RatePoint[];
  /** When provided, renders a 14-day sparkline per metal (full rates page only). */
  history?: Record<string, RateHistoryEntry[]>;
}) {
  if (rates.length === 0) return null;

  return (
    <div className="rate-grid">
      {rates.map((rate) => {
        const positive = rate.changePct >= 0;
        const series = history?.[rate.metal];
        return (
          <div className="rate-card" key={rate.metal}>
            <div className="between">
              <span className="metal">
                {rate.label} <span className="faint">· {rate.purity}</span>
              </span>
              {rate.stale && <span className="badge warning">Stale</span>}
            </div>
            <div className="price">
              <CountUp value={rate.pricePerGram} format={(n) => inr(Math.round(n))} />
              <span
                className="unit"
                style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}
              >
                {' '}
                /gram
              </span>
            </div>
            <div className={`change ${positive ? 'up' : 'down'}`}>
              {positive ? '▲' : '▼'} {Math.abs(rate.changePct)}%
            </div>
            {series && <RateSparkline history={series} positive={positive} />}
            <div className="rate-meta">
              <span>
                {rate.stale ? 'Last known' : 'Updated'} {relTime(rate.updatedAt)}
              </span>
              <span>{rate.source}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
