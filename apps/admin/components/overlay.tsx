'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SPRING_BOUNCY, SPRING_SNAPPY } from '@brandcraft/motion';
import { Button } from './ui';

/**
 * Entrance animation only. Every call site conditionally renders these with
 * `{open && <Modal/>}`, not <AnimatePresence>, so there's nothing mounted to
 * play an exit animation against — retrofitting that would mean touching
 * every modal/drawer call site across the app. Scoped out of this pass.
 */

function useEscape(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEscape(onClose);
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="overlay"
      onMouseDown={onClose}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="modal"
        style={wide ? { width: 'min(720px, calc(100vw - 32px))' } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={SPRING_BOUNCY}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button
            className="icon-btn"
            style={{ marginLeft: 'auto' }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}

export function Drawer({
  title,
  onClose,
  children,
  footer,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEscape(onClose);
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="overlay"
      onMouseDown={onClose}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="drawer"
        onMouseDown={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { x: '100%' }}
        animate={reduceMotion ? undefined : { x: 0 }}
        transition={SPRING_SNAPPY}
      >
        <div className="drawer-head">
          <h3>{title}</h3>
          <button
            className="icon-btn"
            style={{ marginLeft: 'auto' }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="muted">{body}</div>
    </Modal>
  );
}
