'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [enabled, setEnabled] = useState<boolean>(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });

  // Disable entirely on touch devices or when user prefers reduced motion
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || reduced) return;
    setEnabled(true);
  }, [reduced]);

  // Restore native cursor on path change
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.remove('cursor-disabled');
    // (cursor-none is still served via CSS body:not(.cursor-disabled) *)

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorTextEl = cursorTextRef.current;
    if (!cursorDot || !cursorOutline || !cursorTextEl) return;

    setCursorText('');
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

    // Use gsap.ticker instead of a separate RAF loop
    const tick = () => {
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * 0.1;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * 0.1;
      gsap.set(cursorDot, { x: mouse.current.x, y: mouse.current.y });
      gsap.set([cursorOutline, cursorTextEl], {
        x: delayedMouse.current.x,
        y: delayedMouse.current.y,
      });
    };

    gsap.ticker.add(tick);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Interactive element hover states
    let currentHoveredEl: HTMLElement | null = null;

    const cursorLeave = () => {
      setCursorText('');
      gsap.to(cursorDot, { scale: 1, duration: 0.3 });
      gsap.to(cursorOutline, { scale: 1, backgroundColor: 'transparent', duration: 0.4 });
      gsap.to(cursorTextEl, { opacity: 0, duration: 0.2 });
    };

    const cursorEnter = (target: HTMLElement) => {
      const type = target.getAttribute('data-cursor');

      setCursorText('');

      if (type === 'view' || type === 'drag' || type === 'copy') {
        setCursorText(type.toUpperCase());
        gsap.to(cursorOutline, {
          scale: type === 'drag' ? 4 : type === 'copy' ? 3 : 2,
          backgroundColor: 'rgba(97,92,86,0.1)',
          duration: 0.4,
        });
        gsap.to(cursorTextEl, { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(cursorOutline, { scale: 2, backgroundColor: 'rgba(97,92,86,0.15)', duration: 0.4 });
      }

      gsap.to(cursorDot, { scale: 0, duration: 0.3 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        'a, button, [data-cursor], [role="button"]'
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
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-12 h-12 border-2 border-[#615c56] rounded-full"
      />

      <div
        ref={cursorTextRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] opacity-0"
      >
        <span className="text-[#615c56] text-[11px] font-bold tracking-[0.15em]">
          {cursorText}
        </span>
      </div>
    </>
  );
}
