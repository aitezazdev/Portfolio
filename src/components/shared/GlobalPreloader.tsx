'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * SVG Curve Overlay — the actual visual element.
 * A full-screen div that slides upward while an SVG path inside it
 * morphs from a curved bottom edge to flat.
 *
 * Architecture extracted from zunedaalim.com (chunk 1966, deobfuscated).
 */
function CurveOverlay({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      y: ['0vh', '-100vh'],
      transition: {
        duration: 2,
        ease: [0.2, 0.38, 0.09, 0.91],
      },
    });
  }, [controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen bg-ink"
      initial={{ y: '0vh' }}
      animate={controls}
      onAnimationComplete={onAnimationComplete}
      style={{ willChange: 'transform' }}
    >
      <svg
        className="absolute top-0 w-full h-full"
        viewBox="0 0 926 1000"
        preserveAspectRatio="none"
        style={{ height: 'calc(100% + 300px)' }}
      >
        <motion.path
          className="fill-ink"
          d="M0 0 L926 0 L926 1000 Q463 730 0 1000 L0 0"
          animate={{
            d: [
              'M0 0 L926 0 L926 1000 Q463 730 0 1000 L0 0',
              'M0 0 L926 0 L926 0 Q463 0 0 0 L0 0',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeOut',
          }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * GlobalPreloader — wrapper that manages show/hide state.
 *
 * Shows the CurveOverlay on mount, then removes it after
 * animation completes + a safety timeout.
 */
export default function GlobalPreloader() {
  const [show, setShow] = useState(true);
  const reduced = useReducedMotion();

  // Reduced motion: skip immediately
  useEffect(() => {
    if (reduced && show) {
      setShow(false);
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
  }, [reduced, show]);

  // Safety timeout — matches Zuned's architecture:
  // setTimeout(100ms) then setTimeout(2500ms) as fallback
  useEffect(() => {
    if (!show || reduced) return;

    const t1 = setTimeout(() => {
      const t2 = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(t2);
    }, 100);
    return () => clearTimeout(t1);
  }, [show, reduced]);

  // When show becomes false, fire completion events
  useEffect(() => {
    if (!show) {
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
  }, [show]);

  if (!show || reduced) return null;

  return (
    <CurveOverlay
      onAnimationComplete={() => setShow(false)}
    />
  );
}
