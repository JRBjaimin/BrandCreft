import type { CSSProperties } from 'react';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}

function mix(hex: string, targetR: number, targetG: number, targetB: number, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (targetR - r) * amount,
    g + (targetG - g) * amount,
    b + (targetB - b) * amount,
  );
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const [rl, gl, bl] = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** Derives the CSS custom properties a business-scoped page injects for on-brand theming. */
export function accentStyle(baseColor: string | undefined): CSSProperties {
  const accent = baseColor && /^#[0-9a-fA-F]{3,6}$/.test(baseColor) ? baseColor : '#7c2d12';
  const contrast = relativeLuminance(accent) > 0.45 ? '#1a1611' : '#ffffff';
  return {
    ['--accent' as string]: accent,
    ['--accent-hover' as string]: mix(accent, 0, 0, 0, 0.18),
    ['--accent-soft' as string]: mix(accent, 255, 255, 255, 0.88),
    ['--accent-contrast' as string]: contrast,
  };
}
