'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const shown = sessionStorage.getItem('preloader-shown');

    if (shown) {
      setIsLoading(false);
      document.body.classList.add('preloader-complete');
      return;
    }

    document.body.classList.add('preloader-active');

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        finish();
      }

      setProgress(Math.round(current));
    }, 100);

    function finish() {
      gsap.to('.preloader-overlay', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          sessionStorage.setItem('preloader-shown', 'true');
          setIsLoading(false);
          document.body.classList.remove('preloader-active');
          document.body.classList.add('preloader-complete');
          window.dispatchEvent(new CustomEvent('preloaderComplete'));
        },
      });
    }

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="preloader-overlay fixed inset-0 z-[9999] bg-[#e8e8e3] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-[#1a1a1a]">Portfolio</h1>
      <div className="w-64 md:w-96 h-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 font-mono text-[#1a1a1a]">{progress}%</div>
    </div>
  );
}
