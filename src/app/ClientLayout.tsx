'use client';

import { useEffect, useState } from 'react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader from '@/components/shared/GlobalPreloader';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';
import { safeSessionStorage } from '@/utils/storage';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showCursor, setShowCursor] = useState(false);
  useEffect(() => {
    console.log(
      '%c Creative Portfolio Blueprint %c by Aitezaz Sikandar (https://aitezaz.xyz) ',
      'background: #080807; color: #e8e8e3; padding: 4px 8px; border-radius: 4px 0 0 4px; font-family: monospace; font-weight: bold;',
      'background: #e8e8e3; color: #080807; padding: 4px 8px; border-radius: 0 4px 4px 0; font-family: monospace; font-weight: bold; border: 1px solid #080807;'
    );

    const alreadyLoaded = safeSessionStorage.getItem('preloader-shown');
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
      {showCursor && <CustomCursor />}
      <GlobalPreloader />
      <div className="page-overlay"></div>
      <Providers>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Providers>
    </>
  );
}

