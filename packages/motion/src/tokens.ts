/**
 * Shared motion language for BrandCraft — "bold & energetic": bigger travel
 * distances, back-out overshoot easing, snappy springs rather than restrained
 * linear fades. Both apps import from here so the two consoles and the
 * storefront feel like one product, not three different animation styles.
 */
import type { Transition } from 'framer-motion';

/** Snappy back-out overshoot — the signature "pop" easing for this product. */
export const EASE_BOLD: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
/** Plain ease-out for cases where overshoot would look wrong (e.g. width/height). */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  micro: 0.18,
  base: 0.45,
  scene: 0.85,
} as const;

export const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 420, damping: 22, mass: 0.6 };
export const SPRING_BOUNCY: Transition = { type: 'spring', stiffness: 300, damping: 14, mass: 0.7 };

/** Stagger delay between siblings in a <StaggerGroup> — snappy, not slow. */
export const STAGGER_STEP = 0.07;
