'use client';

import { useEffect, useState, useCallback } from 'react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader from '@/components/shared/GlobalPreloader';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';

declare global {
  interface Window {
    __preloaderDone?: boolean;
  }
}

const PRELOADER_TTL_MS = 12 * 60 * 60 * 1000;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [instantDone, setInstantDone] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [quick, setQuick] = useState(false);

  useEffect(() => {
    console.log(
      '%c aitezaz.dev %c built by Aitezaz Sikandar - https://aitezazdev.vercel.app ',
      'background: #11100E; color: #F3EEE5; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-weight: bold;',
      'background: #FF4D2E; color: #11100E; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-weight: bold; border: 1px solid #FF4D2E;'
    );

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = prefersReduced;
    try {
      const at = Number(localStorage.getItem('preloader-seen-at') || 0);
      if (at && Date.now() - at < PRELOADER_TTL_MS) seen = true;
      else if (at) setQuick(true);
    } catch {}

    if (!seen) document.body.classList.add('preloader-active');

    if (seen) {
      document.documentElement.classList.remove('pl');
      window.__preloaderDone = true;
      document.body.classList.remove('preloader-active');
      setInstantDone(true);
      setIsLoading(false);
      setShowCursor(true);
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
      });
    }
  }, []);

  const handleReveal = useCallback(() => {
    document.body.classList.remove('preloader-active');
    window.scrollTo(0, 0);
    setShowCursor(true);
    window.__preloaderDone = true;
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  const handleExitComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="film-grain pointer-events-none" aria-hidden="true" />
      {showCursor && <CustomCursor />}

      {!instantDone && isLoading && (
        <GlobalPreloader quick={quick} onReveal={handleReveal} onComplete={handleExitComplete} />
      )}

      <SmoothScrollProvider>
        <Providers>{children}</Providers>
      </SmoothScrollProvider>
    </>
  );
}
