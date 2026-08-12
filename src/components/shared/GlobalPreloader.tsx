'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/*──────────────────────────────────────────────
  Variants — exact Oliver Larose / Denis Snellenberg
  Ease [0.76, 0, 0.24, 1] = snappy-smooth
──────────────────────────────────────────────*/

/** Container slides up off screen on exit */
const slideUp = {
  initial: { top: 0 },
  exit: {
    top: '-100vh',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 },
  },
};

/** Word text fades in */
const fade = {
  initial: { opacity: 0 },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 },
  },
};

const WORDS = ['Hello', 'Salam', 'Bonjour', 'Hola', 'Ciao', 'Olà', 'Welcome'];

/**
 * Preloader — the visual component.
 * Has NO AnimatePresence — that lives in the parent (ClientLayout).
 * Declares `exit` variants that are triggered by the parent's AnimatePresence
 * when it unmounts this component.
 */
export default function Preloader() {
  const [wordIndex, setWordIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  // Get window dimensions on mount
  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Cycle through words
  useEffect(() => {
    if (wordIndex >= WORDS.length - 1) return;
    const delay = wordIndex === 0 ? 600 : 150;
    const timer = setTimeout(() => setWordIndex(wordIndex + 1), delay);
    return () => clearTimeout(timer);
  }, [wordIndex]);

  // SVG paths using actual window dimensions
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${
    dimension.height + 300
  } 0 ${dimension.height}  L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height} 0 ${dimension.height}  L0 0`;

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
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink cursor-wait"
      variants={slideUp}
      initial="initial"
      exit="exit"
    >
      {dimension.width > 0 && (
        <>
          {/* Centered word with dot */}
          <motion.p
            className="flex items-center text-3xl sm:text-4xl md:text-5xl text-cream font-display font-medium select-none z-10"
            variants={fade}
            initial="initial"
            animate="enter"
          >
            <span className="block w-[10px] h-[10px] bg-cream rounded-full mr-3" />
            {WORDS[wordIndex]}
          </motion.p>

          {/* SVG curve — 300px taller than viewport for the bulge effect */}
          <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none -z-10">
            <motion.path
              className="fill-ink"
              variants={curve}
              initial="initial"
              exit="exit"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}
