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
      if (currentProgress.current < targetProgress.current) {
        currentProgress.current += (targetProgress.current - currentProgress.current) * 0.1;
        setProgress(Math.min(currentProgress.current, 95));
        animationFrameId.current = requestAnimationFrame(smoothProgressUpdate);
      } else {
        if (canComplete && targetProgress.current >= 100) {
          currentProgress.current = 100;
          setProgress(100);
          setTimeout(() => {
            startExitAnimation();
          }, 300);
        }
      }
    };

    const updateTargetProgress = () => {
      const percentage = (loadedAssets / totalAssets) * 100;
      targetProgress.current = Math.min(percentage, 95);
      if (!animationFrameId.current) {
        smoothProgressUpdate();
      }
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

    return () => {
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
      },
    });

    tl.to(".preloader-content", {
      opacity: 0,
      duration: 0.3,
    })
      .to(".preloader-overlay", {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(
        ".preloader-overlay-inner",
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.6"
      );
  };

  if (!isLoading) return null;

  return (
    <div className="preloader-overlay fixed inset-0 z-[9999] bg-[#1a1a1a]">
      <div className="preloader-overlay-inner absolute inset-0 bg-[#e8e8e3]">
        <div className="preloader-content flex flex-col items-center justify-center h-full">
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
      </div>
    </div>
  );
}