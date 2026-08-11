'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

const WORDS = ['Hello', 'Salam', 'Bonjour', 'Hola', 'Ciao', 'Guten Tag', 'Olà', 'Welcome'];

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [wordIdx, setWordIdx] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const finish = useCallback(() => {
    setIsLoading(false);
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-complete');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);



  // Main preloader animation
  useEffect(() => {
    if (!isLoading) return;

    // Reduced motion: skip immediately
    if (reduced) {
      finish();
      return;
    }

    document.body.classList.add('preloader-active');

    // Phase 1: Cycle through words
    let currentWord = 0;
    const wordInterval = setInterval(() => {
      currentWord++;
      if (currentWord >= WORDS.length) {
        clearInterval(wordInterval);
        // Brief pause on last word, then start exit
        setTimeout(() => startExit(), 300);
      } else {
        setWordIdx(currentWord);
      }
    }, 180);

    function startExit() {
      const overlay = overlayRef.current;
      const path = pathRef.current;
      if (!overlay || !path) {
        finish();
        return;
      }

      // Phase 2: Fade out the word text
      if (wordRef.current) {
        gsap.to(wordRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.3,
          ease: 'power2.in',
        });
      }

      // Phase 3: SVG curve morph + overlay slide up
      // The overlay slides up via translateY while the SVG path
      // morphs from a curved bottom to flat — creating the liquid wave effect
      const tl = gsap.timeline({
        onComplete: finish,
        delay: 0.15,
      });

      // Animate the SVG path from curved to flat
      const curveObj = { progress: 0 };
      tl.to(curveObj, {
        progress: 1,
        duration: 0.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          const p = curveObj.progress;
          // Curve control point moves from 730 (curved inward) to 1000 (flat bottom)
          const controlY = 730 + (1000 - 730) * p;
          path.setAttribute(
            'd',
            `M0 0 L926 0 L926 1000 Q463 ${controlY} 0 1000 L0 0`
          );
        },
      });

      // Simultaneously slide the entire overlay upward
      tl.to(
        overlay,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        '<' // start at the same time as the curve morph
      );
    }

    return () => {
      clearInterval(wordInterval);
    };
  }, [isLoading, reduced, finish]);

  if (!isLoading) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
    >
      {/* Centered word */}
      <span
        ref={wordRef}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-cream select-none tracking-tight"
      >
        {WORDS[wordIdx]}
      </span>

      {/* SVG curve at bottom — extends below the overlay for the liquid edge */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 926 1000"
        preserveAspectRatio="none"
        style={{ height: '300px', transform: 'translateY(99%)' }}
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
