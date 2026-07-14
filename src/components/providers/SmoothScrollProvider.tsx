'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    } as any);
    lenisRef.current = lenis;
    window.__lenis = lenis;
    function raf(time: number) {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => {
      gsap.ticker.remove(raf);
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);
  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

