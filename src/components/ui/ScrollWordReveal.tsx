'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  dimOpacity: number;
  highlightColor: string;
  dimColor: string;
  isMounted: boolean;
  reduced: boolean;
}

const Word: React.FC<WordProps> = ({
  children,
  range,
  progress,
  dimOpacity,
  highlightColor,
  dimColor,
  isMounted,
  reduced,
}) => {
  const opacity = useTransform(progress, range, [dimOpacity, 1]);
  const color = useTransform(progress, range, [dimColor, highlightColor]);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.04em]">
      <motion.span
        style={
          isMounted && !reduced
            ? { opacity, color }
            : { color: reduced ? highlightColor : dimColor, opacity: reduced ? 1 : dimOpacity }
        }
        className="inline-block transition-colors duration-150 will-change-[opacity,color]"
      >
        {children}
      </motion.span>
    </span>
  );
};

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  dimOpacity?: number;
  offset?: [string, string];
  highlightColor?: string;
  dimColor?: string;
}

export const ScrollWordReveal: React.FC<ScrollWordRevealProps> = ({
  text,
  className = '',
  dimOpacity = 0.22,
  offset = ['start 0.95', 'end 0.65'],
  highlightColor = '#f0ede6',
  dimColor = 'rgba(240, 237, 230, 0.22)',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset as any,
  });

  const words = text.split(/\s+/).filter(Boolean);
  const total = words.length;

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`} suppressHydrationWarning>
      {words.map((word, i) => {
        const start = i / total;
        const end = start + 1 / total;
        return (
          <Word
            key={i}
            range={[start, end]}
            progress={scrollYProgress}
            dimOpacity={dimOpacity}
            highlightColor={highlightColor}
            dimColor={dimColor}
            isMounted={isMounted}
            reduced={reduced}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default ScrollWordReveal;
