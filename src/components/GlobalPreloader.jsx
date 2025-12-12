"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { PRELOAD_ASSETS } from "@/lib/assetConfig";

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    document.body.classList.add('preloader-active');
    
    const hasShownPreloader = sessionStorage.getItem("preloader-shown");

    if (hasShownPreloader) {
      setIsLoading(false);
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
      return;
    }

    let totalAssets = 0;
    let loadedAssets = 0;
    let canComplete = false;

    const smoothProgressUpdate = () => {
      const diff = targetProgress.current - currentProgress.current;

      if (Math.abs(diff) > 0.1) {
        currentProgress.current += diff * 0.08;
        setProgress(Math.min(Math.round(currentProgress.current), 98));
      }

      if (
        canComplete &&
        targetProgress.current >= 100 &&
        currentProgress.current >= 99
      ) {
        currentProgress.current = 100;
        setProgress(100);
        setTimeout(() => {
          startExitAnimation();
        }, 400);
        return;
      }

      animationFrameId.current = requestAnimationFrame(smoothProgressUpdate);
    };

    const updateTargetProgress = () => {
      const percentage =
        totalAssets > 0 ? (loadedAssets / totalAssets) * 100 : 0;
      targetProgress.current = Math.min(percentage, 98);
    };

    const trackAsset = () => {
      loadedAssets++;
      updateTargetProgress();

      if (loadedAssets >= totalAssets) {
        setTimeout(() => {
          canComplete = true;
          targetProgress.current = 100;
        }, 300);
      }
    };

    const preloadAssets = () => {
      const criticalAssets = PRELOAD_ASSETS.images;
      totalAssets = criticalAssets.length + 5;

      criticalAssets.forEach((src) => {
        if (src.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          const img = new Image();
          img.onload = () => {
            setTimeout(() => trackAsset(), Math.random() * 100);
          };
          img.onerror = () => {
            console.warn(`Failed to load: ${src}`);
            setTimeout(() => trackAsset(), Math.random() * 100);
          };
          img.src = src;
        }
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => trackAsset(), i * 50);
          }
        });
      } else {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => trackAsset(), i * 50);
        }
      }
    };

    smoothProgressUpdate();

    if (document.readyState === "complete") {
      preloadAssets();
    } else {
      window.addEventListener("load", preloadAssets);
    }

    const fallbackTimer = setTimeout(() => {
      canComplete = true;
      targetProgress.current = 100;
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const startExitAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        sessionStorage.setItem("preloader-shown", "true");
        
        document.body.classList.remove('preloader-active');
        document.body.classList.add('preloader-complete');
        
        window.dispatchEvent(new CustomEvent("preloaderComplete"));
      },
    });

    tl.to(".preloader-overlay", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  };

  if (!isLoading) return null;

  return (
    <div className="preloader-overlay fixed inset-0 z-[9999] bg-[#e8e8e3] flex flex-col items-center justify-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] font-syne">
          Portfolio
        </h1>
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

      <div className="mt-8 text-gray-600 text-sm md:text-base animate-pulse">
        Loading Experience...
      </div>
    </div>
  );
}