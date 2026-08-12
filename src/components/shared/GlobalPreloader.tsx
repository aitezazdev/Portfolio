'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Track window dimensions for responsive SVG paths.
 */
function useDimensions() {
  const [dim, setDim] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function update() {
      setDim({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return dim;
}

/*──────────────────────────────────────────────
  Framer Motion variants
  Ease [0.76, 0, 0.24, 1] — Oliver Larose's signature snappy-smooth curve
──────────────────────────────────────────────*/

/** Container slides up off screen on exit */
const slideUp = {
  initial: { top: 0 },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 },
  },
};

/** Word text fades in on mount */
const opacity = {
  initial: { opacity: 0 },
  enter: {
    opacity: 0.75,
    transition: { duration: 0.2, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/*──────────────────────────────────────────────
  Greeting words — cycle through before exit
──────────────────────────────────────────────*/
const WORDS = ['Hello', 'Salam', 'Bonjour', 'Hola', 'Ciao', 'Olà', 'Welcome'];

/**
 * GlobalPreloader — Awwwards-style curved SVG preloader.
 *
 * Architecture: Denis Snellenberg / Oliver Larose pattern.
 * 1. Full-screen overlay with cycling greeting words
 * 2. After words finish, parent triggers exit via AnimatePresence
 * 3. Exit: container slides up (0.8s) + SVG path morphs curved→flat (0.7s)
 * 4. onExitComplete fires body class changes (NOT before animation ends)
 */
export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const { width, height } = useDimensions();
  const reduced = useReducedMotion();

  // Reduced motion: skip immediately
  useEffect(() => {
    if (reduced) {
      setIsLoading(false);
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
    }
  }, [reduced]);

  // Cycle through words, then trigger exit
  useEffect(() => {
    if (!isLoading || reduced) return;
    if (wordIndex >= WORDS.length - 1) {
      // All words shown — wait a beat, then exit
      const exitTimer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(exitTimer);
    }
    // First word stays longer (600ms), rest cycle fast (150ms)
    const delay = wordIndex === 0 ? 600 : 150;
    const timer = setTimeout(() => setWordIndex(wordIndex + 1), delay);
    return () => clearTimeout(timer);
  }, [wordIndex, isLoading, reduced]);

  // Called by AnimatePresence AFTER exit animation finishes
  const handleExitComplete = useCallback(() => {
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-complete');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  // SVG paths — use actual window dimensions for pixel-perfect curves
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
    height + 300
  } 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${
    width / 2
  } ${height} 0 ${height} L0 0`;

  /** SVG curve morph variants */
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
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {isLoading && !reduced && width > 0 && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
          variants={slideUp}
          initial="initial"
          exit="exit"
        >
          {/* Cycling greeting word */}
          <motion.p
            className="flex items-center text-3xl sm:text-4xl md:text-5xl text-cream/75 font-display font-medium select-none z-10"
            variants={opacity}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <span className="block w-2.5 h-2.5 bg-cream/75 rounded-full mr-3" />
            {WORDS[wordIndex]}
          </motion.p>

          {/* SVG extends 300px below viewport to create the visible curve */}
          <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none">
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
