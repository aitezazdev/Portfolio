"use client";

import { useRef, startTransition } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export function Providers({ children }) {
  const first = useRef(null);
  const second = useRef(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        const tl = gsap.timeline({ onComplete: next });

        tl.fromTo(
          first.current,
          { y: "100%" },
          { y: 0, duration: 0.5, ease: "circ.inOut" }
        ).fromTo(
          second.current,
          { y: "100%" },
          { y: 0, duration: 0.5, ease: "circ.inOut" },
          "<50%"
        );

        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap.timeline();

        tl.fromTo(
          second.current,
          { y: 0 },
          { y: "-100%", duration: 0.5, ease: "circ.inOut" }
        )
          .fromTo(
            first.current,
            { y: 0 },
            { y: "-100%", duration: 0.5, ease: "circ.inOut" },
            "<50%"
          )
          .call(() =>
            requestAnimationFrame(() => {
              startTransition(next);
            })
          );

        return () => tl.kill();
      }}>
      {children}

      <div
        ref={first}
        className="fixed inset-0 z-[999] translate-y-full bg-black"
      />
      <div
        ref={second}
        className="fixed inset-0 z-[999] translate-y-full bg-white"
      />
    </TransitionRouter>
  );
}
