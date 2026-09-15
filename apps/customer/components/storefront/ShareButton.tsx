'use client';

import { useState } from 'react';
import { Button } from '../ui';

export function ShareButton({ title, url, size }: { title: string; url: string; size?: 'sm' }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to no-op */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — nothing more we can do here */
    }
  };

  return (
    <Button type="button" variant="ghost" size={size} onClick={share}>
      <span aria-hidden>{copied ? '✓' : '↗'}</span> {copied ? 'Link copied' : 'Share'}
    </Button>
  );
}
