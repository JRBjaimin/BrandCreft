'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegistered() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export interface ScrollSceneContext {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  container: HTMLElement;
}

/**
 * Thin GSAP + ScrollTrigger wrapper for one-off "scene" animations (hero
 * parallax/entrance) that Framer Motion's simpler variant system doesn't
 * suit as well. SSR-safe (all GSAP calls happen inside useEffect), scoped
 * with gsap.context() so timelines/ScrollTriggers are cleaned up on unmount,
 * and skipped entirely when the visitor prefers reduced motion.
 */
export function useScrollScene<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: ScrollSceneContext) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    ensureRegistered();
    const container = ref.current;
    const context = gsap.context(() => setup({ gsap, ScrollTrigger, container }), container);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
