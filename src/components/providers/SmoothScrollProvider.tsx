'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const aliveRef = useRef<boolean>(false);

  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);

    if (isTouch) {
      aliveRef.current = true;
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        aliveRef.current = false;
        clearTimeout(refreshTimer);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    aliveRef.current = true;

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      if (!aliveRef.current) return;
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = setTimeout(() => {
      if (aliveRef.current) ScrollTrigger.refresh();
    }, 500);

    document.fonts?.ready.then(() => {
      if (aliveRef.current) ScrollTrigger.refresh();
    });
    const onLoad = () => {
      if (aliveRef.current) ScrollTrigger.refresh();
    };
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onLoad);
    }

    return () => {
      aliveRef.current = false;
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(raf);
      delete window.__lenis;
      lenis.destroy();
      clearTimeout(refreshTimer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
