'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export default function HeroAurora() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const host = root?.parentElement;
    if (!root || !host) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      root.style.setProperty('--px', cx.toFixed(4));
      root.style.setProperty('--py', cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    host.addEventListener('mousemove', onMove);
    return () => {
      host.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={rootRef} aria-hidden="true" className="hero-aurora absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="ha-blob ha-sun" />
      <div className="ha-blob ha-amber" />
      <div className="ha-blob ha-rose" />
      <div className="ha-grid" />
      <div className="ha-grain film-grain-static" />
      <div className="ha-fade" />
    </div>
  );
}
