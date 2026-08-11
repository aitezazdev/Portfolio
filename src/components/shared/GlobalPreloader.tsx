'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  const finish = useCallback(() => {
    setIsLoading(false);
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-complete');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    if (reduced) {
      finish();
      return;
    }

    document.body.classList.add('preloader-active');

    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) {
      finish();
      return;
    }

    // Initial state: SVG path covers full area with curved bottom
    path.setAttribute('d', 'M0 0 L926 0 L926 1000 Q463 730 0 1000 L0 0');

    // Small delay before starting the exit animation (matches Zuned's setTimeout 100ms)
    const startTimer = setTimeout(() => {
      // 1) Slide the entire overlay div upward over 2s
      //    (custom cubic-bezier matching Zuned's [0.2, 0.38, 0.09, 0.91])
      gsap.to(overlay, {
        y: '-100vh',
        duration: 2,
        ease: 'custom',
        onComplete: finish,
      });

      // Register custom ease to match Zuned's exact bezier curve
      // CustomEase might not be available, so use power2.inOut as close approximation
      gsap.to(overlay, {
        y: '-100vh',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: finish,
        overwrite: true,
      });

      // 2) Simultaneously morph the SVG path from curved to flat over 4s
      const curveObj = { t: 0 };
      gsap.to(curveObj, {
        t: 1,
        duration: 4,
        ease: 'power1.out', // "easeOut"
        onUpdate: () => {
          const p = curveObj.t;
          // Interpolate bottom edge from 1000 to 0
          const bottomY = Math.round(1000 * (1 - p));
          // Interpolate curve control point from 730 to 0
          const controlY = Math.round(730 * (1 - p));
          path.setAttribute(
            'd',
            `M0 0 L926 0 L926 ${bottomY} Q463 ${controlY} 0 ${bottomY} L0 0`
          );
        },
      });
    }, 100);

    return () => {
      clearTimeout(startTimer);
    };
  }, [isLoading, reduced, finish]);

  if (!isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen bg-ink"
      style={{ willChange: 'transform' }}
    >
      {/* SVG fills the overlay + extends 300px below to create visible curve */}
      <svg
        className="absolute top-0 w-full h-full pointer-events-none"
        viewBox="0 0 926 1000"
        preserveAspectRatio="none"
        style={{ height: 'calc(100% + 300px)' }}
      >
        <path
          ref={pathRef}
          className="fill-ink"
          d="M0 0 L926 0 L926 1000 Q463 730 0 1000 L0 0"
        />
      </svg>
    </div>
  );
}
