'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  dimOpacity?: number;
  highlightColor?: string;
  dimColor?: string;
}

const Word: React.FC<WordProps> = ({
  children,
  range,
  progress,
  dimOpacity = 0.22,
  highlightColor = '#f0ede6',
  dimColor = 'rgba(240, 237, 230, 0.22)',
}) => {
  const opacity = useTransform(progress, range, [dimOpacity, 1]);
  const color = useTransform(progress, range, [dimColor, highlightColor]);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.04em]">
      <motion.span
        style={{ opacity, color }}
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
  offset = ['start 0.9', 'end 0.55'],
  highlightColor = '#f0ede6',
  dimColor = 'rgba(240, 237, 230, 0.22)',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset as any,
  });

  const words = text.split(/\s+/).filter(Boolean);
  const total = words.length;

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`}>
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
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default ScrollWordReveal;
