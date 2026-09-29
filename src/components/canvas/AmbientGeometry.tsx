'use client';

import React, { useEffect, useRef } from 'react';

interface NodeItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function AmbientGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });
  const animationFrameRef = useRef<number | null>(null);
  const nodesRef = useRef<NodeItem[]>([]);
  const isVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let isMobile = false;
    let dpr = 1;

    const initNodes = () => {
      isMobile = window.innerWidth < 768;
      const count = isMobile ? 18 : 90;
      const nodes: NodeItem[] = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.random() * 0.3 - 0.15,
          vy: Math.random() * 0.3 - 0.15,
          radius: 1.5 + Math.random() * 1.0,
        });
      }
      nodesRef.current = nodes;
    };

    const drawFrame = (updatePhysics = true) => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(52, 211, 153, 0.18)';
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (updatePhysics) {
          if (!isMobile && mouse.x > -9000) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 1) {
              const strength = ((120 - dist) / 120) * 0.8;
              node.vx += (dx / dist) * strength;
              node.vy += (dy / dist) * strength;
            }
          }
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.985;
          node.vy *= 0.985;

          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          const minSpeed = 0.12;
          if (speed < minSpeed && speed > 0.001) {
            const scale = minSpeed / speed;
            node.vx *= scale;
            node.vy *= scale;
          } else if (speed < 0.001) {
            node.vx = (Math.random() - 0.5) * 0.15;
            node.vy = (Math.random() - 0.5) * 0.15;
          }

          const maxSpeed = 2.5;
          if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
          }

          if (node.x <= 0) {
            node.x = 0;
            node.vx = Math.abs(node.vx) * 0.7;
          } else if (node.x >= width) {
            node.x = width;
            node.vx = -Math.abs(node.vx) * 0.7;
          }
          if (node.y <= 0) {
            node.y = 0;
            node.vy = Math.abs(node.vy) * 0.7;
          } else if (node.y >= height) {
            node.y = height;
            node.vy = -Math.abs(node.vy) * 0.7;
          }
        }

        ctx.moveTo(node.x + node.radius, node.y);
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) {
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
        }
      }
      ctx.stroke();
    };

    const resizeCanvas = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      isMobile = window.innerWidth < 768;
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initNodes();
      if (reduced) {
        drawFrame(false);
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    if (reduced) {
      return () => {
        resizeObserver.disconnect();
      };
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = null;
        return;
      }

      drawFrame(true);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const parentSection = container.parentElement;
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        } else {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    const handlePause = () => {
      isVisibleRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    const handleResume = () => {
      const rect = container.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        isVisibleRef.current = true;
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener('pause-ambient-geometry', handlePause);
    window.addEventListener('resume-ambient-geometry', handleResume);

    return () => {
      window.removeEventListener('pause-ambient-geometry', handlePause);
      window.removeEventListener('resume-ambient-geometry', handleResume);
      resizeObserver.disconnect();
      observer.disconnect();
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
