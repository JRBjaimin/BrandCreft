'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QrCode({ url, size = 88 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      color: { dark: '#201d18', light: '#ffffff' },
    })
      .then((src) => {
        if (!cancelled) setDataUrl(src);
      })
      .catch(() => {
        /* non-fatal — page still works without a QR image */
      });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  if (!dataUrl) return null;

  // eslint-disable-next-line @next/next/no-img-element -- generated data: URI, not an optimizable remote asset
  return <img src={dataUrl} width={size} height={size} alt="Scan to open this page" />;
}
