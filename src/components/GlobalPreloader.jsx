"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const hasShownPreloader = sessionStorage.getItem("preloader-shown");
    
    if (hasShownPreloader) {
      setIsLoading(false);
      return;
    }

    let totalAssets = 10;
    let loadedAssets = 0;
    let canComplete = false;

    const smoothProgressUpdate = () => {
      const diff = targetProgress.current - currentProgress.current;
      
      if (Math.abs(diff) > 0.1) {
        currentProgress.current += diff * 0.1;
        setProgress(Math.min(Math.round(currentProgress.current), 95));
      }
      
      if (canComplete && targetProgress.current >= 100 && currentProgress.current >= 99) {
        currentProgress.current = 100;
        setProgress(100);
        setTimeout(() => {
          startExitAnimation();
        }, 300);
        return;
      }
      
      animationFrameId.current = requestAnimationFrame(smoothProgressUpdate);
    };

    const updateTargetProgress = () => {
      const percentage = (loadedAssets / totalAssets) * 100;
      targetProgress.current = Math.min(percentage, 95);
    };

    const trackAsset = () => {
      loadedAssets++;
      updateTargetProgress();
      
      if (loadedAssets >= totalAssets) {
        setTimeout(() => {
          canComplete = true;
          targetProgress.current = 100;
        }, 800);
      }
    };

    const loadImages = () => {
      const images = Array.from(document.getElementsByTagName("img"));
      const bgImages = Array.from(document.querySelectorAll("*")).filter((el) => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg && bg !== "none" && bg.includes("url");
      });

      const allImages = [...images];
      bgImages.forEach((el) => {
        const bg = window.getComputedStyle(el).backgroundImage;
        const urls = bg.match(/url\(['"]?(.*?)['"]?\)/g);
        if (urls) {
          urls.forEach((url) => {
            const src = url.replace(/url\(['"]?|['"]?\)/g, "");
            if (!src.startsWith("data:")) {
              const img = new Image();
              img.src = src;
              allImages.push(img);
            }
          });
        }
      });

      if (allImages.length > 0) {
        totalAssets += allImages.length;
      }

      allImages.forEach((img) => {
        if (img.complete) {
          setTimeout(() => trackAsset(), Math.random() * 100);
        } else {
          img.onload = () => setTimeout(() => trackAsset(), Math.random() * 100);
          img.onerror = () => setTimeout(() => trackAsset(), Math.random() * 100);
        }
      });
    };

    const loadFonts = async () => {
      if (document.fonts && document.fonts.ready) {
        const fontFaces = Array.from(document.fonts);
        if (fontFaces.length > 0) {
          totalAssets += fontFaces.length;
        }
        
        try {
          await document.fonts.ready;
          fontFaces.forEach((_, i) => {
            setTimeout(() => trackAsset(), i * 50);
          });
        } catch (err) {
          fontFaces.forEach(() => trackAsset());
        }
      } else {
        trackAsset();
      }
    };

    const checkGSAP = () => {
      if (typeof gsap !== "undefined") {
        setTimeout(() => trackAsset(), 100);
      } else {
        const checkInterval = setInterval(() => {
          if (typeof gsap !== "undefined") {
            clearInterval(checkInterval);
            trackAsset();
          }
        }, 50);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          trackAsset();
        }, 1000);
      }
    };

    smoothProgressUpdate();

    setTimeout(() => {
      trackAsset();
      trackAsset();
    }, 50);

    loadFonts();
    checkGSAP();

    const loadAllImages = () => {
      setTimeout(() => {
        loadImages();
      }, 100);
    };

    if (document.readyState === "complete") {
      loadAllImages();
    } else {
      window.addEventListener("load", loadAllImages);
    }

    setTimeout(() => {
      if (loadedAssets < 5) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => trackAsset(), i * 150);
        }
      }
    }, 1000);

    const fallbackTimer = setTimeout(() => {
      canComplete = true;
      targetProgress.current = 100;
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const startExitAnimation = () => {
    console.log("Starting exit animation");
    
    const tl = gsap.timeline({
      onComplete: () => {
        console.log("Preloader complete!");
        setIsLoading(false);
        sessionStorage.setItem("preloader-shown", "true");
        
        window.dispatchEvent(new CustomEvent('preloaderComplete'));
        console.log("Event dispatched: preloaderComplete");
      },
    });

    tl.to(".preloader-overlay", {
      opacity: 0,
      duration: 0.6,
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
        Loading ...
      </div>
    </div>
  );
}