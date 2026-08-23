'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';

export const preloaderWords = [
  'السلام علیکم',
  'नमस्ते',
  'Hola',
  'مرحباً',
  'په خیر راغلي',
  'Welcome',
];

export const slideUp: Variants = {
  initial: {
    top: 0,
    backgroundColor: '#141516',
  },
  exit: {
    top: '-100vh',
    backgroundColor: 'rgba(20, 21, 22, 0)',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

const MIN_DISPLAY_MS = 1400;
const HARD_CAP_MS = 3200;

export default function GlobalPreloader({ onComplete }: { onComplete?: () => void }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dimension, setDimension] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });

  const targetRef = useRef(0);
  const displayedRef = useRef(0);
  const fontsResolvedRef = useRef(false);
  const loadedRef = useRef(false);
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    startedAtRef.current = performance.now();
    document.fonts?.ready.then(() => {
      fontsResolvedRef.current = true;
    });
    const onLoad = () => {
      loadedRef.current = true;
    };
    if (document.readyState === 'complete') loadedRef.current = true;
    window.addEventListener('load', onLoad);

    const capTimer = setTimeout(() => {
      fontsResolvedRef.current = true;
      loadedRef.current = true;
    }, HARD_CAP_MS - MIN_DISPLAY_MS);

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(capTimer);
    };
  }, []);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const elapsed = performance.now() - startedAtRef.current;

      let target = Math.min(90, (elapsed / MIN_DISPLAY_MS) * 88);
      if (fontsResolvedRef.current) target = Math.max(target, 55);
      if (loadedRef.current) target = Math.max(target, 80);
      if (fontsResolvedRef.current && loadedRef.current && elapsed >= MIN_DISPLAY_MS) {
        target = 100;
      }

      targetRef.current = target;
      displayedRef.current += (targetRef.current - displayedRef.current) * 0.09;
      const shown = displayedRef.current >= 99.5 ? 100 : displayedRef.current;
      setProgress(shown);

      if (shown === 100 && !finishedRef.current) {
        finishedRef.current = true;
        try {
          sessionStorage.setItem('preloader-seen', '1');
        } catch {}
        setTimeout(() => onCompleteRef.current?.(), 220);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (finishedRef.current) return;
    if (index === preloaderWords.length - 1) return;
    const timeout = setTimeout(
      () => {
        setIndex((prev) => prev + 1);
      },
      index === 0 ? 380 : 280,
    );
    return () => clearTimeout(timeout);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height + 300} 0 ${dimension.height} L0 0`;

  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${
    dimension.width / 2
  } ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#141516] cursor-wait text-cream select-none pointer-events-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75, transition: { duration: 1, delay: 0.15 } }}
        className="flex items-center text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#f0ede6] z-10"
      >
        <p className="tracking-wide">{preloaderWords[index]}</p>
      </motion.div>

      <div className="absolute bottom-8 left-8 z-10 flex items-baseline gap-3 font-mono" aria-hidden="true">
        <span className="text-accent text-sm uppercase tracking-widest">loading</span>
        <span className="text-[#f0ede6] text-lg tabular-nums">{Math.round(progress)}%</span>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent z-10"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden="true"
      />

      <svg className="absolute top-0 -z-10 h-[calc(100%+300px)] w-full pointer-events-none">
        <motion.path
          className="fill-[#141516]"
          variants={curve}
          initial="initial"
          exit="exit"
        />
      </svg>
    </motion.div>
  );
}
