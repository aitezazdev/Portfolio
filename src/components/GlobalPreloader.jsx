'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PRELOAD_ASSETS } from '@/lib/assetConfig';

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    document.body.classList.add('preloader-active');

    const hasShownPreloader = sessionStorage.getItem('preloader-shown');
    if (hasShownPreloader) {
      setIsLoading(false);
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      return;
    }

    let canComplete = false;

    const smoothProgressUpdate = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.1) {
        currentProgress.current += diff * 0.08;
        setProgress(Math.min(Math.round(currentProgress.current), 98));
      }
      if (canComplete && targetProgress.current >= 100 && currentProgress.current >= 99) {
        currentProgress.current = 100;
        setProgress(100);
        startExitAnimation();
        return;
      }
      animationFrameId.current = requestAnimationFrame(smoothProgressUpdate);
    };

    const preloadAssets = async () => {
      const assets = PRELOAD_ASSETS.images;
      let loaded = 0;

      await Promise.all(
        assets.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = img.onerror = () => {
                loaded++;
                targetProgress.current = (loaded / assets.length) * 100;
                resolve(true);
              };
            }),
        ),
      );

      canComplete = true;
      targetProgress.current = 100;
    };

    smoothProgressUpdate();
    preloadAssets();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  const startExitAnimation = () => {
    gsap.to('.preloader-overlay', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsLoading(false);
        sessionStorage.setItem('preloader-shown', 'true');
        document.body.classList.remove('preloader-active');
        document.body.classList.add('preloader-complete');
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
      },
    });
  };

  if (!isLoading) return null;

  return (
    <div className="preloader-overlay fixed inset-0 z-[9999] bg-[#e8e8e3] flex flex-col items-center justify-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] font-syne">Portfolio</h1>
      </div>

      <div className="w-64 md:w-96 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 text-[#1a1a1a] font-mono text-sm md:text-base">
        {Math.round(progress)}%
      </div>

      <div className="mt-8 text-gray-600 text-sm md:text-base animate-pulse">Loading ...</div>
    </div>
  );
}
