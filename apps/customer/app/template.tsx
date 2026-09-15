import { PageTransition } from '@brandcraft/motion';
import type { ReactNode } from 'react';

/** Next.js remounts template.tsx on every navigation, so this reads as a page transition. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
