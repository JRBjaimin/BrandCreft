export * from './tokens';
export { Reveal } from './Reveal';
export type { RevealProps } from './Reveal';
export { StaggerGroup, StaggerItem } from './Stagger';
export type { StaggerGroupProps } from './Stagger';
export { CountUp } from './CountUp';
export type { CountUpProps } from './CountUp';
export { PageTransition } from './PageTransition';
// useScrollScene (gsap) and SuccessBurst (lottie-react) are deliberately NOT
// re-exported here. This package builds to CommonJS (see tsconfig.json),
// which bundlers can't tree-shake the way they can ESM — re-exporting them
// from this barrel would add gsap's and lottie's weight to every single page
// of every app that imports anything from here (e.g. apps/admin/components/ui.tsx
// imports CountUp/SPRING_SNAPPY on nearly every route), even pages that never
// touch GSAP or Lottie. Import them from their own subpaths instead:
// '@brandcraft/motion/scroll-scene' and '@brandcraft/motion/success-burst'.
