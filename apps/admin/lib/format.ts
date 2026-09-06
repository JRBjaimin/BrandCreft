export function inr(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function dateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const GRADIENTS: [string, string][] = [
  ['#4f46e5', '#a855f7'],
  ['#0ea5e9', '#22d3ee'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#84cc16'],
  ['#ec4899', '#8b5cf6'],
  ['#f43f5e', '#fb923c'],
];

/** Deterministic offline placeholder image as an inline SVG data URI. */
export function placeholder(seed: string, label = ''): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [a, b] = GRADIENTS[h % GRADIENTS.length];
  const text = (label || seed.slice(0, 2)).slice(0, 14);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>
    </linearGradient></defs>
    <rect width='400' height='400' fill='url(#g)'/>
    <text x='50%' y='52%' font-family='system-ui,sans-serif' font-size='34'
      font-weight='700' fill='rgba(255,255,255,0.92)' text-anchor='middle'
      dominant-baseline='middle'>${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3600000).toISOString();
}

export function daysAhead(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}
