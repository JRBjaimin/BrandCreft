'use client';

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SPRING_BOUNCY } from '@brandcraft/motion';
import { SuccessBurst } from '@brandcraft/motion/success-burst';
import { dataProvider } from '../../lib/data';

/**
 * Anonymous, browser-local favourite toggle — no customer account exists yet
 * (see docs/02, section 2). Backed by localStorage via the storefront-data
 * mock provider; swapping to an authenticated call later is a provider-only
 * change.
 */
export function FavouriteButton({
  businessId,
  productId,
  stopNavigation = false,
}: {
  businessId: string;
  productId: string;
  /** Set true when this button is rendered as a sibling overlay on a card link. */
  stopNavigation?: boolean;
}) {
  const [active, setActive] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    dataProvider.isFavourite(businessId, productId).then((v) => {
      if (!cancelled) setActive(v);
    });
    return () => {
      cancelled = true;
    };
  }, [businessId, productId]);

  const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
    if (stopNavigation) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = await dataProvider.toggleFavourite(businessId, productId);
    setActive(next);
    if (next) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 900);
    }
  };

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <motion.button
        type="button"
        className="product-fav"
        data-active={active}
        aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
        aria-pressed={active}
        onClick={toggle}
        whileTap={reduceMotion ? undefined : { scale: 0.82 }}
        transition={SPRING_BOUNCY}
      >
        {reduceMotion ? (
          active ? (
            '♥'
          ) : (
            '♡'
          )
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active ? 'on' : 'off'}
              initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={SPRING_BOUNCY}
              style={{ display: 'inline-block' }}
            >
              {active ? '♥' : '♡'}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.button>
      {justAdded && (
        <span style={{ position: 'absolute', inset: -20, pointerEvents: 'none' }} aria-hidden>
          <SuccessBurst size={72} />
        </span>
      )}
    </span>
  );
}
