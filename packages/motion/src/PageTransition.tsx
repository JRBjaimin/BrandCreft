'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DURATION, EASE_BOLD } from './tokens';

/**
 * Drop into each app's app/template.tsx (Next.js remounts template.tsx on
 * every navigation, so a plain mount animation here reads as a page
 * transition). Entry animation only — true cross-fade exit transitions would
 * need a persistent, pathname-keyed AnimatePresence host above the router
 * outlet, which is a much bigger architectural change than this pass covers.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_BOLD }}
    >
      {children}
    </motion.div>
  );
}
