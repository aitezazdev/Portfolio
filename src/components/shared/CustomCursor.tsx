'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState<boolean>(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const mouse = useRef({ x: -100, y: -100 });
  const delayedMouse = useRef({ x: -100, y: -100 });

  // Disable on touch devices or when user prefers reduced motion
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || reduced) return;
    setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('custom-cursor-active');

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  // Restore native cursor / reset cursor state on path change
  useEffect(() => {
    if (!enabled) return;
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorTextEl = cursorTextRef.current;
    if (!cursorDot || !cursorOutline || !cursorTextEl) return;

    if (textSpanRef.current) textSpanRef.current.textContent = '';
    gsap.to(cursorDot, { scale: 1, duration: 0.3 });
    gsap.to(cursorOutline, { scale: 1, backgroundColor: 'transparent', duration: 0.4 });
    gsap.to(cursorTextEl, { opacity: 0, duration: 0.2 });
  }, [pathname, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorTextEl = cursorTextRef.current;
    if (!cursorDot || !cursorOutline || !cursorTextEl) return;

    gsap.set([cursorDot, cursorOutline, cursorTextEl], {
      xPercent: -50,
      yPercent: -50,
    });

    const setDotX = gsap.quickSetter(cursorDot, 'x', 'px');
    const setDotY = gsap.quickSetter(cursorDot, 'y', 'px');
    const setOutlineX = gsap.quickSetter(cursorOutline, 'x', 'px');
    const setOutlineY = gsap.quickSetter(cursorOutline, 'y', 'px');
    const setTextX = gsap.quickSetter(cursorTextEl, 'x', 'px');
    const setTextY = gsap.quickSetter(cursorTextEl, 'y', 'px');

    const tick = () => {
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * 0.18;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * 0.18;

      setDotX(mouse.current.x);
      setDotY(mouse.current.y);

      setOutlineX(delayedMouse.current.x);
      setOutlineY(delayedMouse.current.y);

      setTextX(delayedMouse.current.x);
      setTextY(delayedMouse.current.y);
    };

    gsap.ticker.add(tick);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let currentHoveredEl: HTMLElement | null = null;

    const cursorLeave = () => {
      if (textSpanRef.current) textSpanRef.current.textContent = '';
      gsap.to(cursorDot, { scale: 1, duration: 0.3 });
      gsap.to(cursorOutline, { scale: 1, backgroundColor: 'transparent', duration: 0.4 });
      gsap.to(cursorTextEl, { opacity: 0, duration: 0.2 });
    };

    const cursorEnter = (target: HTMLElement) => {
      const type = target.getAttribute('data-cursor');
      if (textSpanRef.current) textSpanRef.current.textContent = '';

      if (type === 'view' || type === 'drag' || type === 'copy') {
        if (textSpanRef.current) textSpanRef.current.textContent = type.toUpperCase();
        gsap.to(cursorOutline, {
          scale: type === 'drag' ? 4 : type === 'copy' ? 3 : 2,
          backgroundColor: 'rgba(124, 58, 237, 0.12)',
          duration: 0.4,
        });
        gsap.to(cursorTextEl, { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(cursorOutline, {
          scale: 2,
          backgroundColor: 'rgba(124, 58, 237, 0.18)',
          duration: 0.4,
        });
      }

      gsap.to(cursorDot, { scale: 0, duration: 0.3 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'a, button, [data-cursor], [role="button"]',
      );
      if (target && target !== currentHoveredEl) {
        if (currentHoveredEl) cursorLeave();
        currentHoveredEl = target;
        cursorEnter(target);
      } else if (!target && currentHoveredEl) {
        cursorLeave();
        currentHoveredEl = null;
      }
    };

    const handleMouseLeavePage = () => {
      if (currentHoveredEl) {
        cursorLeave();
        currentHoveredEl = null;
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeavePage);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeavePage);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      <div
        ref={cursorOutlineRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-12 h-12 border-2 border-forest rounded-full"
      />

      <div
        ref={cursorTextRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] opacity-0"
      >
        <span
          ref={textSpanRef}
          className="text-forest-light text-[11px] font-bold tracking-[0.15em]"
        />
      </div>
    </>
  );
}
