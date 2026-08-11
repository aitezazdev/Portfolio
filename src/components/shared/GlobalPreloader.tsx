'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * SVG Curve Overlay — exact replica of zunedaalim.com preloader.
 *
 * A full-screen div that slides upward (y: 0vh → -100vh) while
 * an SVG path morphs from a curved bottom edge to flat.
 * The SVG is taller than the viewport (calc(100% + 300px)) so
 * the curve visually hangs below creating the liquid wave effect.
 */
function CurveOverlay({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const controls = useAnimationControls();

  useEffect(() => {
    // Brief pause (0.3s) so the dark screen "breathes" before sweeping up.
    // On production sites this pause happens naturally from network latency.
    const timer = setTimeout(() => {
      controls.start({
        y: ['0vh', '-100vh'],
        transition: {
          duration: 2,
          ease: [0.2, 0.38, 0.09, 0.91],
        },
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen bg-ink"
      initial={{ y: '0vh' }}
      animate={controls}
      onAnimationComplete={onAnimationComplete}
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
            delay: 0.3,
          }}
        />
      </svg>
    </motion.div>
  );
}

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

  // Safety fallback: remove after 3s no matter what
  useEffect(() => {
    if (!show || reduced) return;
    const fallback = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(fallback);
  }, [show, reduced]);

  // Fire completion events when preloader hides
  useEffect(() => {
    if (!show) {
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
  }, [show]);

  if (!show || reduced) return null;

  return <CurveOverlay onAnimationComplete={() => setShow(false)} />;
}
