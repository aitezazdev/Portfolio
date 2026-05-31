'use client';

import { useEffect, useState } from 'react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader from '@/components/shared/GlobalPreloader';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';
export default function ClientLayout({ children }) {
  const [showCursor, setShowCursor] = useState(false);
  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('preloader-shown');
    if (alreadyLoaded) {
      setShowCursor(true);
      return;
    }
    const handlePreloaderComplete = () => {
      setShowCursor(true);
    };
    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    return () => {
      window.removeEventListener('preloaderComplete', handlePreloaderComplete);
    };
  }, []);
  return (
    <>
      <div className="film-grain pointer-events-none" />
      <div className="scroll-progress-bar fixed top-0 left-0 h-[2px] bg-[#10b981] z-[9999] w-full origin-left scale-x-0 pointer-events-none" />
      {showCursor && <CustomCursor />}
      <GlobalPreloader />
      <div className="page-overlay"></div>
      <Providers>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Providers>
    </>
  );
}
