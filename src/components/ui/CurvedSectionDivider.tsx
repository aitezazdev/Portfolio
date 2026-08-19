'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface CurvedSectionDividerProps {
  className?: string;
  curveColor?: string; // color of the curved shape (e.g. #E8E4DE / bg-cream)
  bottomColor?: string; // background of the section underneath (e.g. #0F0E0C / bg-ink)
}

export default function CurvedSectionDivider({
  className = '',
  curveColor = '#E8E4DE',
  bottomColor = '#0F0E0C',
}: CurvedSectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Dynamic curve height: arches up to 160px and flattens down to 0px on scroll
  const curveHeight = useTransform(scrollYProgress, [0, 0.9], [160, 0]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden pointer-events-none z-20 ${className}`}
      style={{ backgroundColor: bottomColor }}
    >
      {!reduced ? (
        <motion.div
          className="w-[120%] -left-[10%] relative"
          style={{
            height: curveHeight,
            backgroundColor: curveColor,
            borderRadius: '0 0 50% 50%',
            boxShadow: '0 30px 40px rgba(0, 0, 0, 0.15)',
          }}
        />
      ) : (
        <div
          className="w-full h-12"
          style={{
            backgroundColor: curveColor,
            borderRadius: '0 0 50% 50%',
          }}
        />
      )}
    </div>
  );
}
