// Updated HomeBanner.tsx with improved first-load animation logic
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import dynamic from 'next/dynamic';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { safeSessionStorage } from '@/utils/storage';

const AmbientGeometry = dynamic(() => import('@/components/canvas/AmbientGeometry'), {
  ssr: false,
});

// ... (keep RoleTicker component as is)

const HomeBanner = () => {
  // ... (keep refs and state)
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track first load

  const splitText = (text: string) =>
    text.split('').map((char, idx) => (
      <span
        key={idx}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{ display: 'inline-block', ['--idx' as any]: idx }}
      >
        <span className="letter-original block">{char === ' ' ? ' ' : char}</span>
        <span aria-hidden="true" className="letter-duplicate block absolute top-full left-0 w-full select-none">
          {char === ' ' ? ' ' : char}
        </span>
      </span>
    ));

  // Initialize animation state on first load or when preloader is shown
  useEffect(() => {
    if (reduced) return;

    const hasShownPreloader = safeSessionStorage.getItem('preloader-shown');

    // Always reset positions for first-time visibility or after preloader
    if (nameRef.current) {
      gsap.set(nameRef.current.querySelectorAll('.letter-wrapper'), {
        y: hasShownPreloader || !isFirstLoad ? '0%' : '100%',
        opacity: hasShownPreloader || !isFirstLoad ? 1 : 0
      });
      gsap.set(nameRef.current.querySelectorAll('.letter-original, .letter-duplicate'), { y: '0%' });
    }

    [paragraphRef, tickerRef, buttonsRef].forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, {
          y: hasShownPreloader || !isFirstLoad ? 0 : 40,
          opacity: hasShownPreloader || !isFirstLoad ? 1 : 0
        });
      }
    });

    setPreloaderComplete(hasShownPreloader);
  }, [reduced, isFirstLoad]);

  // Animate home screen elements after preloader finishes OR on first load
  useEffect(() => {
    if (reduced) return;

    const hasShownPreloader = safeSessionStorage.getItem('preloader-shown');
    const shouldAnimate = hasShownPreloader || isFirstLoad;

    if (!shouldAnimate) return;

    // Animate name letters
    if (nameRef.current) {
      gsap.set(nameRef.current.querySelectorAll('.letter-original, .letter-duplicate'), { y: '0%' });
      const letters = nameRef.current.querySelectorAll('.letter-wrapper');
      if (letters.length) {
        gsap.to(letters, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.1,
        });
      }
    }

    // Animate other elements
    const tl = gsap.timeline({ delay: 0.5, ease: 'power3.out' });
    [paragraphRef, tickerRef, buttonsRef].forEach((ref) => {
      if (ref.current) {
        tl.to(ref.current, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5');
      }
    });

    // Mark first load as complete after animation
    if (isFirstLoad) {
      setIsFirstLoad(false);
      // Save to session storage to indicate first load is complete
      safeSessionStorage.setItem('home-first-load', 'complete');
    }
  }, [preloaderComplete, reduced, isFirstLoad]);

  // ... (keep mouse handlers, spotlight, ScrollTrigger, etc.)

  return (
    // ... (keep JSX structure)
  );
};

export default HomeBanner;