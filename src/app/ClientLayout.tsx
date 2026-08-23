'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader from '@/components/shared/GlobalPreloader';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';

declare global {
  interface Window {
    __preloaderDone?: boolean;
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [instantDone, setInstantDone] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    console.log(
      '%c Creative Portfolio Blueprint %c by Aitezaz Sikandar (https://aitezaz.xyz) ',
      'background: #080807; color: #e8e8e3; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-weight: bold;',
      'background: #e8e8e3; color: #080807; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-weight: bold; border: 1px solid #080807;'
    );

    let seen = false;
    try {
      seen = sessionStorage.getItem('preloader-seen') === '1';
    } catch {}

    if (seen) {
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

  const finishPreloader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    document.body.classList.remove('preloader-active');
    window.scrollTo(0, 0);
    setShowCursor(true);
    window.__preloaderDone = true;
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  return (
    <>
      <div className="film-grain pointer-events-none" aria-hidden="true" />
      {showCursor && <CustomCursor />}

      {!instantDone && (
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {isLoading && (
            <GlobalPreloader key="preloader" onComplete={finishPreloader} />
          )}
        </AnimatePresence>
      )}

      <Providers>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Providers>
    </>
  );
}
