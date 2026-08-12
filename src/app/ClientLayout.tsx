'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader from '@/components/shared/GlobalPreloader';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    console.log(
      '%c Creative Portfolio Blueprint %c by Aitezaz Sikandar (https://aitezaz.xyz) ',
      'background: #080807; color: #e8e8e3; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-weight: bold;',
      'background: #e8e8e3; color: #080807; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-weight: bold; border: 1px solid #080807;'
    );

    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = useCallback(() => {
    setShowCursor(true);
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  return (
    <>
      <div className="film-grain pointer-events-none" />
      {showCursor && <CustomCursor />}

      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isLoading && <GlobalPreloader key="preloader" />}
      </AnimatePresence>

      <div className="page-overlay" />
      <Providers>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Providers>
    </>
  );
}
