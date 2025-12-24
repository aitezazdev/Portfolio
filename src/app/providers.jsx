'use client';

import { useRef, startTransition } from 'react';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';

export default function Providers({ children }) {
  const firstLayer = useRef(null);
  const secondLayer = useRef(null);

  return (
    <TransitionRouter
      auto
      leave={(next, from, to) => {
        const tl = gsap
          .timeline({ onComplete: next })
          .fromTo(firstLayer.current, { y: '100%' }, { y: 0, duration: 0.5, ease: 'circ.inOut' })
          .fromTo(
            secondLayer.current,
            { y: '100%' },
            { y: 0, duration: 0.5, ease: 'circ.inOut' },
            '<50%',
          );

        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = gsap
          .timeline()
          .fromTo(secondLayer.current, { y: 0 }, { y: '-100%', duration: 0.5, ease: 'circ.inOut' })
          .fromTo(
            firstLayer.current,
            { y: 0 },
            { y: '-100%', duration: 0.5, ease: 'circ.inOut' },
            '<50%',
          )
          .call(() => requestAnimationFrame(() => startTransition(next)), null, '<50%');

        return () => tl.kill();
      }}
    >
      <div ref={firstLayer} className="fixed inset-0 z-50 translate-y-full bg-primary" />
      <div ref={secondLayer} className="fixed inset-0 z-50 translate-y-full bg-foreground" />
      {children}
    </TransitionRouter>
  );
}
