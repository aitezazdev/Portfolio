'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  dimOpacity?: number;
  /** Framer-style offsets kept for API compatibility: ['start 0.95', 'end 0.7'] */
  offset?: [string, string];
  highlightColor?: string;
  dimColor?: string;
  /** Color for *accented* words (rendered serif italic) */
  accentColor?: string;
}

interface Token {
  t: string;
  accent: boolean;
}

/** Parses "*word*" markup into serif-accent tokens. */
const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  const re = /\*([^*]+)\*|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) tokens.push({ t: m[1], accent: true });
    else tokens.push({ t: m[2], accent: false });
  }
  return tokens;
};

const hexToRgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
};

export const ScrollWordReveal: React.FC<ScrollWordRevealProps> = ({
  text,
  className = '',
  dimOpacity = 0.22,
  offset = ['start 0.99', 'end 0.85'],
  highlightColor = '#f0ede6',
  dimColor = 'rgba(240, 237, 230, 0.22)',
  accentColor = '#E07A5F',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const parsePct = (part: string | undefined, fallback: number) => {
    const v = parseFloat(part ?? '');
    return Number.isFinite(v) ? v * 100 : fallback * 100;
  };
  const stStart = `top ${parsePct(offset[0]?.split(' ')[1], 0.99)}%`;
  const stEnd = `bottom ${parsePct(offset[1]?.split(' ')[1], 0.85)}%`;

  const tokens = React.useMemo(() => tokenize(text), [text]);

  useGSAP(
    () => {
      if (reduced) return;
      const el = containerRef.current;
      if (!el) return;
      const wordEls = el.querySelectorAll<HTMLSpanElement>('.swr-word');
      if (!wordEls.length) return;

      gsap.set(wordEls, {
        opacity: dimOpacity,
        y: 10,
        filter: 'blur(4px)',
        color: (i: number, target: Element) =>
          (target as HTMLElement).dataset.accent === 'true'
            ? hexToRgba(accentColor, Math.max(dimOpacity, 0.3))
            : dimColor,
      });

      gsap.to(wordEls, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        color: (i: number, target: Element) =>
          (target as HTMLElement).dataset.accent === 'true' ? accentColor : highlightColor,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: stStart,
          end: stEnd,
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [reduced, text] }
  );

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`}>
      {tokens.map((tok, i) => (
        <span key={`${tok.t}-${i}`} className="relative inline-block mr-[0.28em] my-[0.04em]">
          <span
            className={`swr-word inline-block will-change-[transform,filter,opacity] ${
              tok.accent ? 'serif-accent normal-case text-[1.12em]' : ''
            }`}
            data-accent={tok.accent}
          >
            {tok.t}
          </span>
        </span>
      ))}
    </p>
  );
};

export default ScrollWordReveal;
