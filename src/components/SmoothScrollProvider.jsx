"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const rafFunction = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafFunction);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafFunction);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
