'use client';

import { useEffect, useRef, useState } from 'react';
import FlowField from '@/components/canvas/FlowField';

const INK = '#11100E';
const PAPER = '#F3EEE5';
const ACCENT = '#FF4D2E';
const INTRO_MS = 1900;

interface Cell {
  x: number;
  y: number;
  at: number;
}

interface PortraitMap {
  cols: number;
  rows: number;
  data: string;
}

interface Props {
  src?: string;
  label?: string;
}

export default function AitezazPortrait({
  src = '/portrait/map',
  label = 'Portrait of Aitezaz Sikandar',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let map: PortraitMap | null = null;
    let bits: Uint8Array | null = null;
    let cells: Cell[] = [];
    let base: HTMLCanvasElement | null = null;
    let cellSize = 4;
    let dpr = 1;
    let introStart = 0;
    let introDone = reduced;
    let visible = false;
    let raf = 0;
    let destroyed = false;

    const finishing = (g: CanvasRenderingContext2D) => {
      const gr = g.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.46,
        canvas.height * 0.22,
        canvas.width / 2,
        canvas.height * 0.5,
        canvas.height * 0.8,
      );
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(1, 'rgba(0,0,0,0.62)');
      g.fillStyle = gr;
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.globalAlpha = 0.07;
      g.fillStyle = '#000';
      const step = Math.max(2, Math.round(3 * dpr));
      for (let y = 0; y < canvas.height; y += step) g.fillRect(0, y, canvas.width, 1);
      g.globalAlpha = 1;
    };

    const buildCells = () => {
      if (!map || !bits || !canvas.width) return;
      const { cols, rows } = map;
      const scale = Math.max(canvas.width / cols, canvas.height / rows);
      const ox = (canvas.width - cols * scale) / 2;
      const oy = (canvas.height - rows * scale) / 2;
      cellSize = Math.ceil(scale);
      const next: Cell[] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const n = j * cols + i;
          if (!(bits[n >> 3] & (1 << (n & 7)))) continue;
          next.push({
            x: Math.floor(ox + i * scale),
            y: Math.floor(oy + j * scale),
            at: (j / rows) * 0.78 + Math.random() * 0.18,
          });
        }
      }
      cells = next;

      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.fillStyle = INK;
      octx.fillRect(0, 0, off.width, off.height);
      octx.fillStyle = PAPER;
      for (const c of cells) octx.fillRect(c.x, c.y, cellSize, cellSize);
      finishing(octx);
      base = off;
    };

    const render = (now: number) => {
      raf = 0;
      if (destroyed || !base) return;
      const W = canvas.width;
      const H = canvas.height;

      if (introDone) {
        ctx.drawImage(base, 0, 0);
        return;
      }
      if (!visible) return;
      if (!introStart) introStart = now;
      const t = Math.min(1, (now - introStart) / INTRO_MS);
      const line = (1 - Math.pow(1 - t, 3)) * 1.12;

      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);
      for (const c of cells) {
        if (c.at > line) continue;
        ctx.fillStyle = line - c.at < 0.05 ? ACCENT : PAPER;
        ctx.fillRect(c.x, c.y, cellSize, cellSize);
      }
      finishing(ctx);

      if (t < 1) {
        ctx.fillStyle = ACCENT;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(0, Math.min(H, (line / 0.96) * H), W, Math.max(1, Math.round(dpr)));
        ctx.globalAlpha = 1;
        schedule();
      } else {
        introDone = true;
        schedule();
      }
    };

    const schedule = () => {
      if (!raf && !destroyed) raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      buildCells();
      if (!introDone && !introStart) {
        ctx.fillStyle = INK;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      schedule();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { threshold: 0.3 },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('missing');
        return r.json() as Promise<PortraitMap>;
      })
      .then((m) => {
        if (destroyed) return;
        const raw = atob(m.data);
        const arr = new Uint8Array(raw.length);
        for (let k = 0; k < raw.length; k++) arr[k] = raw.charCodeAt(k);
        map = m;
        bits = arr;
        resize();
      })
      .catch(() => {
        if (!destroyed) setFailed(true);
      });

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [src]);

  if (failed) return <FlowField />;

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} role="img" aria-label={label} className="block h-full w-full" />
    </div>
  );
}
