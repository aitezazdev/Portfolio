'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, className = '' }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visibleRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    // For reduced motion, just fade in — no scramble
    if (reduced) {
      gsap.set(el, { opacity: 0, y: '30px' });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: '0px',
            duration: 0.8,
            ease: 'power3.out',
          });
        },
      });
      return;
    }

    // Full scramble effect
    let intervalId: any = null;
    const scrambleText = (targetEl: HTMLElement, finalText: string, duration = 400) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
      const steps = Math.floor(duration / 50);
      let step = 0;
      intervalId = setInterval(() => {
        targetEl.textContent = finalText
          .split('')
          .map((char, i) => {
            if (i < (step / steps) * finalText.length) return char;
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        step++;
        if (step > steps) {
          clearInterval(intervalId);
          targetEl.textContent = finalText;
        }
      }, 50);
    };

    gsap.set(el, { opacity: 0, y: '30px' });

    const triggerInstance = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        // Scramble the visible (aria-hidden) span
        if (visibleRef.current) {
          scrambleText(visibleRef.current, text, 400);
        }
        gsap.to(el, {
          opacity: 1,
          y: '0px',
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
      triggerInstance.kill();
    };
  }, [text, reduced]);

  return (
    <div className="mb-8">
      <div className="overflow-hidden">
        <h2 ref={headingRef} className={`font-display font-bold uppercase tracking-tighter ${className}`}>
          {/* Visually hidden — real text for screen readers */}
          <span className="sr-only">{text}</span>
          {/* Visible span — gets scrambled */}
          <span ref={visibleRef} aria-hidden="true">
            {text}
          </span>
        </h2>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-forest to-transparent mt-1" />
    </div>
  );
};

export default AnimatedHeading;
