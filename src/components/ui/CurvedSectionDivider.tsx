'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface CurvedSectionDividerProps {
  className?: string;
  /** color of the curved shape (e.g. #E8E4DE / bg-cream) */
  curveColor?: string;
  /** background of the section underneath (e.g. #0F0E0C / bg-ink) */
  bottomColor?: string;
}

export default function CurvedSectionDivider({
  className = '',
  curveColor = '#E8E4DE',
  bottomColor = '#0F0E0C',
}: CurvedSectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !curveRef.current || !containerRef.current) return;
      gsap.fromTo(
        curveRef.current,
        { height: 150 },
        {
          height: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [reduced] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden pointer-events-none z-20 ${className}`}
      style={{ backgroundColor: bottomColor }}
      aria-hidden="true"
    >
      <div
        ref={curveRef}
        className="w-[120%] -left-[10%] relative"
        style={{
          height: reduced ? 64 : 150,
          backgroundColor: curveColor,
          borderRadius: '0 0 50% 50%',
        }}
      />
    </div>
  );
}
