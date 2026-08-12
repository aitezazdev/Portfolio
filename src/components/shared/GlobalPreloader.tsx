'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Hook to track window dimensions for responsive SVG paths.
 */
function useDimensions() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function update() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return dimensions;
}

/**
 * Variants for the main overlay container — slides up off screen.
 * Ease [0.76, 0, 0.24, 1] is Oliver Larose's signature snappy-smooth curve.
 */
const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 },
  },
};

/**
 * GlobalPreloader — Awwwards-style curved SVG preloader.
 *
 * Architecture from Denis Snellenberg / Oliver Larose:
 * - Full-screen overlay slides upward via `top: -100vh`
 * - SVG (calc(100%+300px) tall) has a path that morphs from
 *   curved bottom (control point at height+300) to flat (height)
 * - Both use [0.76, 0, 0.24, 1] ease for snappy, buttery feel
 * - Uses AnimatePresence for clean exit animations
 */
export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useDimensions();
  const reduced = useReducedMotion();

  const finish = useCallback(() => {
    setIsLoading(false);
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-complete');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  // Reduced motion: skip immediately
  useEffect(() => {
    if (reduced) {
      finish();
    }
  }, [reduced, finish]);

  // Auto-finish after the slide-up animation completes (~1.2s total)
  useEffect(() => {
    if (!isLoading || reduced) return;
    const timer = setTimeout(() => finish(), 1200);
    return () => clearTimeout(timer);
  }, [isLoading, reduced, finish]);

  // SVG paths using actual window dimensions for pixel-perfect curves
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
    height + 300
  } 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${
    width / 2
  } ${height} 0 ${height} L0 0`;

  // Curve variants for the SVG path morphing
  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && !reduced && width > 0 && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
          variants={slideUp}
          initial="initial"
          exit="exit"
        >
          {/* SVG extends 300px below viewport to create the visible curve */}
          <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] -z-10">
            <motion.path
              className="fill-ink"
              variants={curve}
              initial="initial"
              exit="exit"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
