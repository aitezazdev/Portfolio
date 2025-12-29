'use client';

import { useRef, startTransition } from 'react';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import { useLenis } from '@/components/SmoothScrollProvider';

export default function Providers({ children }) {
  const firstLayer = useRef(null);
  const secondLayer = useRef(null);
  const lenis = useLenis();

  return (
    <TransitionRouter
      auto={true}
      leave={(next, from, to) => {
        console.log({ from, to });

        if (lenis?.current) {
          lenis.current.stop();
        }

        const tl = gsap
          .timeline({
            onComplete: next,
          })
          .fromTo(
            firstLayer.current,
            { y: '100%' },
            {
              y: 0,
              duration: 0.5,
              ease: 'circ.inOut',
            },
          )
          .fromTo(
            secondLayer.current,
            { y: '100%' },
            {
              y: 0,
              duration: 0.5,
              ease: 'circ.inOut',
            },
            '<50%',
          );

        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap
          .timeline({
            onComplete: () => {
              if (lenis?.current) {
                lenis.current.start();
              }
            },
          })
          .fromTo(
            secondLayer.current,
            { y: 0 },
            {
              y: '-100%',
              duration: 0.5,
              ease: 'circ.inOut',
            },
          )
          .fromTo(
            firstLayer.current,
            { y: 0 },
            {
              y: '-100%',
              duration: 0.5,
              ease: 'circ.inOut',
            },
            '<50%',
          )
          .call(
            () => {
              requestAnimationFrame(() => {
                startTransition(next);
              });
            },
            undefined,
            '<50%',
          );

        return () => tl.kill();
      }}
    >
      <main>{children}</main>
      <div
        ref={firstLayer}
        className="fixed inset-0 z-50 translate-y-full bg-primary pointer-events-none"
      />
      <div
        ref={secondLayer}
        className="fixed inset-0 z-50 translate-y-full bg-foreground pointer-events-none"
      />
    </TransitionRouter>
  );
}
