'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  life: number;
  maxLife: number;
  speed: number;
  hueMix: number; // 0 = rust, 1 = cream
}

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let rafId: number | null = null;
    let visible = true;
    let time = Math.random() * 100;
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];

    // Layered trigonometric noise — smooth, organic, dependency-free.
    const noiseAngle = (x: number, y: number, t: number): number => {
      const n =
        Math.sin(x * 1.7 + t) * Math.cos(y * 1.35 - t * 0.7) +
        Math.sin((x + y) * 0.85 + t * 0.45) * 0.8 +
        Math.sin(x * 0.55 - y * 0.9 - t * 0.3) * 0.6;
      return n * 2.4;
    };

    const spawn = (p?: Partial<Particle>): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      px: 0,
      py: 0,
      life: 0,
      maxLife: 90 + Math.random() * 160,
      speed: 0.5 + Math.random() * 1.1,
      hueMix: Math.random() < 0.82 ? 0 : 0.7 + Math.random() * 0.3,
      ...p,
    });

    const resize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const isMobile = width < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = isMobile ? 40 : 220;
      particles = Array.from({ length: count }, () => {
        const p = spawn();
        p.px = p.x;
        p.py = p.y;
        p.life = Math.random() * p.maxLife;
        return p;
      });

      // Fresh ink base
      ctx.fillStyle = '#0d0d0c';
      ctx.fillRect(0, 0, width, height);
      if (reduced) renderStatic();
    };

    const stepParticle = (p: Particle): boolean => {
      const scale = 0.0042;
      const angle = noiseAngle(p.x * scale, p.y * scale, time);

      let vx = Math.cos(angle) * p.speed;
      let vy = Math.sin(angle) * p.speed * 0.85;

      // Cursor bends the field
      if (finePointer && mouse.x > -999) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 16900 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const push = ((130 - dist) / 130) * 2.2;
          vx += (dx / dist) * push;
          vy += (dy / dist) * push;
        }
      }

      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy;
      p.life++;

      if (
        p.life > p.maxLife ||
        p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20
      ) {
        Object.assign(p, spawn());
        p.px = p.x;
        p.py = p.y;
        return false;
      }
      return true;
    };

    const drawFrame = () => {
      // Silk-trail fade
      ctx.fillStyle = 'rgba(13, 13, 12, 0.045)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.15;
      for (const p of particles) {
        const alive = stepParticle(p);
        if (!alive) continue;

        const fadeEdge = Math.sin((p.life / p.maxLife) * Math.PI); // ease in/out
        if (p.hueMix === 0) {
          ctx.strokeStyle = `rgba(196, 93, 62, ${0.34 + fadeEdge * 0.4})`;
        } else {
          ctx.strokeStyle = `rgba(232, 228, 222, ${0.12 + fadeEdge * 0.2})`;
        }
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      time += 0.0028;
    };

    const renderStatic = () => {
      for (let i = 0; i < 260; i++) {
        drawFrame();
        time += 0.01;
      }
    };

    const animate = () => {
      if (!visible) { rafId = null; return; }
      drawFrame();
      rafId = requestAnimationFrame(animate);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    if (!reduced) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && rafId === null) rafId = requestAnimationFrame(animate);
        },
        { threshold: 0.02 }
      );
      observer.observe(container);

      if (finePointer) {
        const onMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        };
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
        return () => {
          observer.disconnect();
          resizeObserver.disconnect();
          container.removeEventListener('mousemove', onMove);
          container.removeEventListener('mouseleave', onLeave);
          if (rafId !== null) cancelAnimationFrame(rafId);
        };
      }
      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#0d0d0c]">
        <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      </div>
  );
}
