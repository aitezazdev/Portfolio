'use client';

import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { EASE } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

export interface HeadingWord {
  /** Word text */
  t: string;
  /** Render this word in italic serif accent instead of heavy grotesk */
  serif?: boolean;
}

interface AnimatedHeadingProps {
  /** Simple mode: single-style heading */
  text?: string;
  /** Editorial mode: mix of grotesk + serif-accent words */
  words?: HeadingWord[];
  className?: string;
  containerClassName?: string;
  showLine?: boolean;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  words,
  className = '',
  containerClassName = 'mb-8',
  showLine = true,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const resolvedWords: HeadingWord[] =
    words && words.length > 0 ? words : [{ t: text ?? '' }];
  const plainText = resolvedWords.map((w) => w.t).join(' ');

  useGSAP(
    () => {
      if (reduced) return;
      const root = rootRef.current;
      if (!root) return;

      const splits: SplitText[] = [];
      const chars: HTMLElement[] = [];
      root.querySelectorAll<HTMLElement>('.ah-word').forEach((wordEl) => {
        const split = SplitText.create(wordEl, {
          type: 'chars',
          charsClass: 'ah-char',
        });
        splits.push(split);
        chars.push(...(split.chars as HTMLElement[]));
      });
      if (!chars.length) return;

      gsap.set(chars, {
        yPercent: 120,
        rotateX: -60,
        opacity: 0,
        transformPerspective: 700,
        transformOrigin: '50% 100%',
      });

      const line = root.querySelector<HTMLElement>('.ah-line');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 90%', once: true },
        defaults: { ease: EASE.outQuart },
      });

      tl.to(
        chars,
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.72,
          stagger: { each: 0.02, from: 'start' },
        },
        0
      );

      if (line) {
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: EASE.inOutQuad }, 0.15);
      }

      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: rootRef, dependencies: [reduced, plainText] }
  );

  return (
    <div ref={rootRef} className={containerClassName}>
      <h2
        className={`font-display font-black uppercase tracking-tighter leading-none ${className}`}
        aria-label={plainText}
      >
        <span aria-hidden="true" className="flex flex-wrap items-baseline gap-x-[0.24em]">
          {resolvedWords.map((word, i) => (
            <span
              key={`${word.t}-${i}`}
              className={`ah-word relative inline-block overflow-visible ${
                word.serif ? 'serif-accent normal-case font-normal text-[1.06em]' : ''
              }`}
              style={{
                paddingBottom: '0.14em',
                marginBottom: '-0.14em',
                ...(word.serif ? {} : {}),
              }}
            >
              {word.t}
            </span>
          ))}
        </span>
      </h2>
      {showLine && <div className="ah-line h-1 w-24 origin-left bg-gradient-to-r from-accent to-transparent mt-1" />}
    </div>
  );
};

export default AnimatedHeading;
