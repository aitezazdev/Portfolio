'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { safeSessionStorage } from '@/utils/storage';

const GREETINGS = [
  'Hello',
  'Salam',
  'Bonjour',
  'Hola',
  'Ciao',
  'Guten Tag',
  'Olà',
  'Welcome',
  'Aitezaz Sikandar',
];

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const shown = safeSessionStorage.getItem('preloader-shown');
    if (shown) {
      setIsLoading(false);
      document.body.classList.add('preloader-complete');
      return;
    }

    if (reduced) {
      safeSessionStorage.setItem('preloader-shown', 'true');
      setIsLoading(false);
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      return;
    }

    document.body.classList.add('preloader-active');

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const getPath = (p: number) => {
      // p goes from 0 (covered) to 1 (revealed at top y=0)
      const currentH = height * (1 - p);
      // Curve tension bulges downward during exit pull
      const curveHeight = Math.sin(p * Math.PI) * 350;
      const controlY = currentH + curveHeight;
      return `M 0 0 L ${width} 0 L ${width} ${currentH} Q ${width / 2} ${controlY} 0 ${currentH} Z`;
    };

    if (pathRef.current) {
      pathRef.current.setAttribute('d', getPath(0));
    }

    const counterObj = { val: 0, greeting: 0, curve: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        safeSessionStorage.setItem('preloader-shown', 'true');
        setIsLoading(false);
        document.body.classList.remove('preloader-active');
        document.body.classList.add('preloader-complete');
      },
    });

    // Step 1: Counter & Greeting Cycling (0% -> 100%)
    tl.to(counterObj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(counterObj.val);
        setProgress(val);
        const idx = Math.min(
          Math.floor((val / 100) * (GREETINGS.length - 1)),
          GREETINGS.length - 1
        );
        setGreetingIdx(idx);
      },
    });

    // Step 2: Content Fade Out & Dispatch preloaderComplete
    tl.to(
      contentRef.current,
      {
        y: -40,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          window.dispatchEvent(new CustomEvent('preloaderComplete'));
        },
      },
      '+=0.1'
    );

    // Step 3: SVG Liquid Wave Curve Pull Up (0 -> 1)
    tl.to(counterObj, {
      curve: 1,
      duration: 0.9,
      ease: 'power4.inOut',
      onUpdate: () => {
        if (pathRef.current) {
          pathRef.current.setAttribute('d', getPath(counterObj.curve));
        }
      },
    }, '-=0.1');

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
    };
  }, [reduced]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-between overflow-hidden"
    >
      {/* SVG Liquid Curve Background Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none fill-ink z-10">
        <path ref={pathRef} d="" />
      </svg>

      {/* Preloader Center Content */}
      <div
        ref={contentRef}
        className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-auto px-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-xs tracking-widest text-warm uppercase">
            Portfolio Loading
          </span>
        </div>

        {/* Dynamic Multilingual Greeting */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-cream tracking-tight text-center min-h-[1.2em] flex items-center justify-center select-none">
          <span className="inline-block transition-all duration-200">
            {GREETINGS[greetingIdx]}
          </span>
        </h1>

        {/* Dynamic Percentage Counter */}
        <div className="mt-8 flex flex-col items-center">
          <div className="w-48 sm:w-64 h-[2px] bg-border-subtler overflow-hidden rounded-full relative">
            <div
              className="h-full bg-accent transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 font-mono text-warm text-sm tracking-widest">
            {String(progress).padStart(3, '0')} / 100
          </div>
        </div>
      </div>
    </div>
  );
}

