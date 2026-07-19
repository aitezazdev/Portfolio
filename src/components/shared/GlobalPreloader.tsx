'use client';

import { useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { safeSessionStorage } from '@/utils/storage';

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const shown = safeSessionStorage.getItem('preloader-shown');
    if (shown) {
      setIsLoading(false);
      document.body.classList.add('preloader-complete');
      return;
    }

    // Skip animation if user prefers reduced motion
    if (reduced) {
      safeSessionStorage.setItem('preloader-shown', 'true');
      setIsLoading(false);
      document.body.classList.add('preloader-complete');
      window.dispatchEvent(new CustomEvent('preloaderComplete'));
      return;
    }

    document.body.classList.add('preloader-active');
    const counterObj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('.preloader-overlay', {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            safeSessionStorage.setItem('preloader-shown', 'true');
            setIsLoading(false);
            document.body.classList.remove('preloader-active');
            document.body.classList.add('preloader-complete');
            window.dispatchEvent(new CustomEvent('preloaderComplete'));
          },
        });
      },
    });

    tl.to('.preloader-letter', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: 'power3.out',
    });

    tl.to('.preloader-line', {
      scaleX: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      transformOrigin: 'left',
    }, '-=0.4');

    tl.to(counterObj, {
      val: 100,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => setProgress(Math.round(counterObj.val)),
    }, 0);

    return () => { tl.kill(); };
  }, [reduced]);

  if (!isLoading) return null;

  return (
    <div
      className="preloader-overlay fixed inset-0 z-[9999] bg-ink flex flex-col items-center justify-center"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-wider text-cream flex flex-wrap justify-center mb-4">
          {'AITEZAZ SIKANDAR'.split('').map((char, index) => (
            <span
              key={index}
              className="preloader-letter inline-block opacity-0"
              style={{ transform: 'translateY(60px)' }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>
        <div className="preloader-line w-64 sm:w-80 md:w-[450px] h-[1px] bg-border-subtle origin-left scale-x-0" />
        <div className="mt-8 font-mono text-warm text-sm tracking-widest">
          {String(progress).padStart(2, '0')}%
        </div>
      </div>
    </div>
  );
}
