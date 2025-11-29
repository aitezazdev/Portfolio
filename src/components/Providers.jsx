"use client";

import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

export default function Providers({ children }) {
  return (
    <TransitionRouter
      leave={(next, from, to) => {
        const tween = gsap.fromTo(
          "main",
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -40, duration: 0.6, onComplete: next }
        );
        return () => tween.kill();
      }}
      enter={(next) => {
        const tween = gsap.fromTo(
          "main",
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.6, onComplete: next }
        );
        return () => tween.kill();
      }}>
      {children}
    </TransitionRouter>
  );
}
