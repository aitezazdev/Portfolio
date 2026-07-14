'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from '@studio-freight/lenis';

export default function MarqueeStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;
  const items = ['Available for Work', 'Open to Opportunities', "Let's Build", 'MERN Stack'];
  useEffect(() => {
    const track1 = track1Ref.current;
    if (!track1) return;
    const totalWidth1 = track1.scrollWidth;
    const wrap = (val: string | number, max: number): number => {
      const modulus = parseFloat(val as string) % max;
      return modulus <= 0 ? modulus : modulus - max;
    };
    tween1Ref.current = gsap.to(track1, {
      x: `-=${totalWidth1 / 2}`,
      duration: 45,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => wrap(x, totalWidth1 / 2)),
      },
    });
    return () => {
      if (tween1Ref.current) tween1Ref.current.kill();
    };
  }, []);
  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    const handleScroll = ({ velocity }: { velocity: number }) => {
      if (tween1Ref.current) {
        const multiplier = Math.min(3, Math.max(1, 1 + Math.abs(velocity) * 0.5));
        tween1Ref.current.timeScale(velocity < -0.5 ? -multiplier : multiplier);
      }
    };
    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenisRef]);

  return (
    <div
      ref={containerRef}
      className="w-full relative z-20 overflow-hidden select-none border-t border-b border-[#c8c8c0]"
      style={{
        willChange: 'transform',
      }}
    >
      <div className="overflow-hidden bg-[#e8e8e3] py-3">
        <div ref={track1Ref} className="inline-flex items-center gap-0 whitespace-nowrap">
          {Array.from({
            length: 8,
          }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 pr-6">
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="font-mono text-[13px] uppercase tracking-[0.15em] text-[#6b645c] font-medium">
                    {item}
                  </span>
                  <span className="text-[#0c6145] text-[10px]">◆</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
