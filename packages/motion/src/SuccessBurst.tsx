'use client';

import { Component } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Lottie from 'lottie-react';
import { useReducedMotion } from 'framer-motion';
import successCheck from './lottie/success-check.json';

/**
 * lottie-web can throw at runtime on a malformed animation file. This asset
 * is hand-authored (not fetched from a third party), but since there's no
 * browser available to visually verify it in this environment, the burst is
 * wrapped in an error boundary — a broken Lottie render must never take down
 * the page it's decorating.
 */
class LottieErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export interface SuccessBurstProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/** A small celebratory burst for "done!" moments — favourite added, enquiry sent, business created. */
export function SuccessBurst({ size = 64, className, style, onComplete }: SuccessBurstProps) {
  const reduceMotion = useReducedMotion();
  // The success itself is always communicated via text/state elsewhere — this is decoration only.
  if (reduceMotion) return null;

  return (
    <LottieErrorBoundary>
      <div
        className={className}
        style={{ width: size, height: size, pointerEvents: 'none', ...style }}
        aria-hidden
      >
        <Lottie animationData={successCheck} loop={false} onComplete={onComplete} />
      </div>
    </LottieErrorBoundary>
  );
}
