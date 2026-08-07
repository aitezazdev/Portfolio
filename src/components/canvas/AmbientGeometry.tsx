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
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let isMobile = false;
    let dpr = 1;
    let cachedRect: DOMRect | null = null;

    const initNodes = () => {
      isMobile = window.innerWidth < 768;
      const count = isMobile ? 40 : 80;
      const nodes: NodeItem[] = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 1.5 + Math.random() * 1.0,
        });
      }
      nodesRef.current = nodes;
    };

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      cachedRect = containerRef.current.getBoundingClientRect();
      width = cachedRect.width;
      height = cachedRect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initNodes();
    };

    let resizeTimeout: NodeJS.Timeout | number | undefined;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 150);
    };

    resizeCanvas();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || !cachedRect) return;
      mouseRef.current = {
        x: e.clientX - cachedRect.left,
        y: e.clientY - cachedRect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const parentSection = containerRef.current?.parentElement;
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    // IntersectionObserver to pause RAF loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animationFrameRef.current) {
          animate();
        }
      },
      { threshold: 0.05 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Update particle positions & render nodes
      ctx.beginPath();
      ctx.fillStyle = 'rgba(124, 58, 237, 0.25)';
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!isMobile && mouse.x > -9000) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            const strength = ((120 - dist) / 120) * 0.6;
            node.vx += (dx / dist) * strength;
            node.vy += (dy / dist) * strength;
          }
        }

        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.98;
        node.vy *= 0.98;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed < 0.12 && speed > 0.001) {
          const scale = 0.12 / speed;
          node.vx *= scale;
          node.vy *= scale;
        } else if (speed < 0.001) {
          node.vx = (Math.random() - 0.5) * 0.15;
          node.vy = (Math.random() - 0.5) * 0.15;
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

        ctx.moveTo(node.x + node.radius, node.y);
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fill();

      // Batch line connections
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.12)';
      ctx.lineWidth = 0.6;

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

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      observer.disconnect();
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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
