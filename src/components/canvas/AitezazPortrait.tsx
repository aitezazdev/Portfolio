'use client';

import { useEffect, useRef, useState } from 'react';
import FlowField from '@/components/canvas/FlowField';

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const INK = '#11100E';
const PAPER = '#F3EEE5';
const ACCENT = '#FF4D2E';
const TARGET_COLUMNS = 150;
const INTRO_MS = 1900;

interface Cell {
  x: number;
  y: number;
  at: number;
}

interface Props {
  src?: string;
  label?: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export default function AitezazPortrait({
  src = '/portrait/photo.webp',
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
    let tone: HTMLImageElement | null = null;
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
      if (!tone || !canvas.width) return;
      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);
      const probe = document.createElement('canvas');
      probe.width = cols;
      probe.height = rows;
      const pctx = probe.getContext('2d', { willReadFrequently: true });
      if (!pctx) return;
      pctx.imageSmoothingQuality = 'high';
      drawCover(pctx, tone, cols, rows);
      const data = pctx.getImageData(0, 0, cols, rows).data;
      const lumas: number[] = [];
      for (let k = 0; k < data.length; k += 4) {
        if (data[k + 3] >= 128) {
          lumas.push(0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]);
        }
      }
      if (!lumas.length) return;
      lumas.sort((a, b) => a - b);
      const lo = lumas[Math.floor(lumas.length * 0.02)];
      const hi = lumas[Math.floor(lumas.length * 0.98)];
      const span = Math.max(1, hi - lo);
      const next: Cell[] = [];
      for (let j = 0; j < rows; j++) {
        const fade = Math.pow(Math.min(1, Math.max(0, 1 - (j / rows - 0.62) / 0.3)), 1.6);
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          if (data[k + 3] < 128) continue;
          const luma = 0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2];
          const norm = Math.min(1, Math.max(0, (luma - lo) / span));
          const light = 0.4 + 0.8 / (1 + Math.exp((i / cols - 0.47) * 7));
          const v = (Math.pow(norm, 1.9) * light * (0.05 + 0.95 * fade) * 1.5 - 0.03) / 0.78;
          if (v <= BAYER[j % 8][i % 8]) continue;
          next.push({
            x: i * cellSize,
            y: j * cellSize,
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
      cellSize = Math.max(2, Math.round(canvas.width / TARGET_COLUMNS));
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

    loadImage(src)
      .then((img) => {
        if (destroyed) return;
        tone = img;
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
