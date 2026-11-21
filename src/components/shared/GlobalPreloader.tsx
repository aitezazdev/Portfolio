'use client';

// Made by Aitezaz Sikandar - https://aitezazdev.vercel.app

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const BG = '#0C0B0A';
const SKY = 'radial-gradient(120% 90% at 72% -10%, #1B1917 0%, #100F0D 45%, #0C0B0A 75%)';
const MIN_DISPLAY_MS = 2200;
const HARD_CAP_MS = 5200;
const QUICK_MIN_MS = 450;
const QUICK_CAP_MS = 1500;

interface Props {
  onReveal?: () => void;
  onComplete?: () => void;
  quick?: boolean;
}

interface Pt {
  x: number;
  y: number;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  warm: boolean;
}
interface Ember {
  x: number;
  y: number;
  v: number;
  r: number;
  a: number;
  ph: number;
}

function curvePoint(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

export default function GlobalPreloader({ onReveal, onComplete, quick = false }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<SVGLineElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [soundOn, setSoundOn] = useState(false);

  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const struckRef = useRef(false);
  const revealedRef = useRef(false);
  const doneRef = useRef(false);
  const soundRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const strikeRef = useRef<() => void>(() => {});
  const fx = useRef({ speed: 1, boltT: 0, boltA: 0, cutW: 0, glint: 0, lit: 0, progress: 0 });

  const toggleSound = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    if (next && !audioRef.current) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioRef.current = new Ctor();
      } catch {}
    }
    audioRef.current?.resume?.().catch(() => {});
  };

  const playStrikeSound = () => {
    const ctx = audioRef.current;
    if (!soundRef.current || !ctx) return;
    try {
      const now = ctx.currentTime;
      const len = Math.floor(ctx.sampleRate * 0.9);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 3;
      bp.frequency.setValueAtTime(1800, now);
      bp.frequency.exponentialRampToValueAtTime(9000, now + 0.28);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.45, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.9);
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(110, now + 0.18);
      o.frequency.exponentialRampToValueAtTime(48, now + 0.7);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, now + 0.18);
      og.gain.exponentialRampToValueAtTime(0.4, now + 0.2);
      og.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      o.connect(og).connect(ctx.destination);
      o.start(now + 0.18);
      o.stop(now + 0.85);
    } catch {}
  };

  useEffect(() => {
    const root = rootRef.current;
    const cv = canvasRef.current;
    if (!root || !cv) {
      onRevealRef.current?.();
      onCompleteRef.current?.();
      return;
    }
    const ctx = cv.getContext('2d');
    if (!ctx) {
      onRevealRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    const wrap0 = wrapRef.current;
    const panelA0 = panelARef.current;
    const panelB0 = panelBRef.current;
    const textEls = Array.from(root.querySelectorAll<HTMLElement>('.ld-text'));
    const barEls = Array.from(root.querySelectorAll<HTMLElement>('.ld-bar'));
    const fxState = fx.current;
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('pl')));
    const startedAt = performance.now();
    let fontsReady = false;
    let loaded = document.readyState === 'complete';
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    const minMs = quick ? QUICK_MIN_MS : MIN_DISPLAY_MS;
    const capMs = quick ? QUICK_CAP_MS : HARD_CAP_MS;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const small = W < 640;
    const embers: Ember[] = Array.from({ length: small ? 26 : 56 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      v: 14 + Math.random() * 34,
      r: 0.8 + Math.random() * 1.8,
      a: 0.25 + Math.random() * 0.55,
      ph: Math.random() * Math.PI * 2,
    }));
    let sparks: Spark[] = [];
    let slashA: Pt = { x: 0, y: 0 };
    let slashB: Pt = { x: 0, y: 0 };
    let slashC: Pt = { x: 0, y: 0 };
    let cutNormal: Pt = { x: 1, y: 0 };
    let armed = false;
    let lastHead = 0;

    let last = performance.now();
    let raf = 0;

    const throwSparks = (p: Pt, n: number, power: number) => {
      for (let i = 0; i < n; i++) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        const v = (60 + Math.random() * 300) * power;
        sparks.push({
          x: p.x,
          y: p.y,
          vx: cutNormal.x * dir * v + (Math.random() - 0.5) * 140,
          vy: cutNormal.y * dir * v - Math.random() * 140,
          r: 1 + Math.random() * 1.8,
          life: 0,
          max: 0.4 + Math.random() * 0.7,
          warm: Math.random() < 0.65,
        });
      }
    };

    const strokeBlade = (head: number, maxW: number, fill: string, blur: number, shadow: string, alpha: number) => {
      const N = 36;
      const steps = Math.max(2, Math.ceil(N * head));
      const left: Pt[] = [];
      const right: Pt[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * head;
        const p = curvePoint(slashA, slashC, slashB, t);
        const q = curvePoint(slashA, slashC, slashB, Math.min(1, t + 0.01));
        const o = curvePoint(slashA, slashC, slashB, Math.max(0, t - 0.01));
        let tx = q.x - o.x;
        let ty = q.y - o.y;
        const l = Math.hypot(tx, ty) || 1;
        tx /= l;
        ty /= l;
        const w = maxW * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.7) * (0.35 + 0.65 * (i / steps));
        left.push({ x: p.x - ty * (w / 2), y: p.y + tx * (w / 2) });
        right.push({ x: p.x + ty * (w / 2), y: p.y - tx * (w / 2) });
      }
      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (const p of left) ctx.lineTo(p.x, p.y);
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.shadowColor = shadow;
      ctx.shadowBlur = small ? Math.min(blur, 10) : blur;
      ctx.globalAlpha = alpha;
      ctx.fill();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = fx.current;
      ctx.clearRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';
      const eb = 0.28 + 0.6 * s.lit;
      for (const e of embers) {
        e.y -= e.v * dt * s.speed;
        e.ph += dt * 0.8 * s.speed;
        e.x += Math.sin(e.ph) * 10 * dt * s.speed;
        if (e.y < -8) {
          e.y = H + 8;
          e.x = Math.random() * W;
        }
        ctx.fillStyle = `rgba(255,${130 + Math.round(60 * s.lit)},${80 + Math.round(70 * s.lit)},${eb * e.a})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (armed && s.glint > 0.01) {
        const g = curvePoint(slashA, slashC, slashB, 0.14);
        const R = (small ? 46 : 84) * s.glint;
        ctx.save();
        ctx.translate(g.x, g.y);
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.55);
        halo.addColorStop(0, `rgba(255,236,214,${0.85 * s.glint})`);
        halo.addColorStop(1, 'rgba(255,120,70,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,248,238,${0.95 * s.glint})`;
        {
          const rx = R;
          const ry = R * 0.045;
          ctx.beginPath();
          ctx.moveTo(-rx, 0);
          ctx.quadraticCurveTo(0, -ry, rx, 0);
          ctx.quadraticCurveTo(0, ry, -rx, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -rx * 0.62);
          ctx.quadraticCurveTo(-ry, 0, 0, rx * 0.62);
          ctx.quadraticCurveTo(ry, 0, 0, -rx * 0.62);
          ctx.fill();
        }
        ctx.restore();
      }

      if (armed && s.boltA > 0.01 && s.boltT > lastHead && s.boltT < 0.995) {
        const steps = Math.max(1, Math.round((s.boltT - lastHead) / 0.04));
        for (let i = 1; i <= steps; i++) throwSparks(curvePoint(slashA, slashC, slashB, lastHead + ((s.boltT - lastHead) * i) / steps), small ? 1 : 2, 0.8);
      }
      lastHead = s.boltT;

      sparks = sparks.filter((p) => (p.life += dt) < p.max);
      for (const p of sparks) {
        p.vy += 420 * dt;
        p.vx *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = 1 - p.life / p.max;
        ctx.fillStyle = p.warm ? `rgba(255,150,80,${k})` : `rgba(255,244,226,${k})`;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }

      if (armed && s.boltA > 0.01 && s.boltT > 0.002) {
        ctx.globalCompositeOperation = 'lighter';
        const w = Math.max(0.0001, s.cutW);
        const k = s.boltA;
        strokeBlade(s.boltT, (small ? 34 : 54) * w, 'rgba(255,84,48,0.22)', 0, 'rgba(0,0,0,0)', k);
        strokeBlade(s.boltT, (small ? 12 : 18) * w, 'rgba(255,150,100,0.85)', 30, 'rgba(255,90,50,0.9)', k);
        strokeBlade(s.boltT, (small ? 4 : 6) * w + 1.4, '#ffffff', 10, 'rgba(255,230,210,1)', k);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    let shown = 0;
    let progRaf = 0;
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      let target = Math.min(90, (elapsed / minMs) * 88);
      if (fontsReady) target = Math.max(target, 55);
      if (loaded) target = Math.max(target, 80);
      const ready = fontsReady && loaded && elapsed >= minMs;
      if (ready || elapsed >= capMs) target = 100;
      shown += (target - shown) * 0.1;
      if (shown >= 99.4) shown = 100;
      fx.current.progress = shown;
      for (const b of barEls) b.style.transform = `scaleX(${shown / 100})`;
      if (shown === 100) {
        strikeRef.current();
        return;
      }
      progRaf = requestAnimationFrame(tick);
    };
    progRaf = requestAnimationFrame(tick);

    const reveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      try {
        localStorage.setItem('preloader-seen-at', String(Date.now()));
      } catch {}
      onRevealRef.current?.();
    };
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      reveal();
      onCompleteRef.current?.();
    };

    gsap.fromTo(textEls, { opacity: 0, y: 10, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: quick ? 0.7 : 1.2, ease: 'power3.out', delay: quick ? 0.05 : 0.15 });
    if (glowRef.current) gsap.fromTo(glowRef.current, { opacity: 0, yPercent: 14 }, { opacity: 1, yPercent: 0, duration: quick ? 0.8 : 3, ease: 'power2.out', delay: quick ? 0 : 0.2 });

    const tlRefs: gsap.core.Timeline[] = [];
    strikeRef.current = () => {
      if (struckRef.current) return;
      struckRef.current = true;
      const wrap = wrapRef.current!;
      const A = panelARef.current!;
      const B = panelBRef.current!;
      W = window.innerWidth;
      H = window.innerHeight;

      slashA = { x: W * 0.74, y: -H * 0.06 };
      slashB = { x: W * 0.26, y: H * 1.06 };
      const dx = slashB.x - slashA.x;
      const dy = slashB.y - slashA.y;
      const L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L;
      const ny = dx / L;
      cutNormal = { x: nx, y: ny };
      const bow = L * 0.035;
      slashC = { x: (slashA.x + slashB.x) / 2 + nx * bow, y: (slashA.y + slashB.y) / 2 + ny * bow };
      armed = true;

      const e1 = { x: slashA.x - dx * 0.2, y: slashA.y - dy * 0.2 };
      const e2 = { x: slashB.x + dx * 0.2, y: slashB.y + dy * 0.2 };
      A.style.clipPath = `polygon(-200px ${e1.y}px, ${e1.x}px ${e1.y}px, ${e2.x}px ${e2.y}px, -200px ${e2.y}px)`;
      B.style.clipPath = `polygon(${e1.x - 3}px ${e1.y}px, ${W + 200}px ${e1.y}px, ${W + 200}px ${e2.y}px, ${e2.x - 3}px ${e2.y}px)`;

      const seam = seamRef.current!;
      seam.setAttribute('x1', String(slashA.x));
      seam.setAttribute('y1', String(slashA.y));
      seam.setAttribute('x2', String(slashB.x));
      seam.setAttribute('y2', String(slashB.y));

      const dist = Math.max(W, H) * 1.05;
      const sign = nx < 0 ? 1 : -1;
      const ax = nx * dist * sign;
      const ay = ny * dist * sign;

      if (flashRef.current) gsap.killTweensOf(flashRef.current);
      const stillness = quick ? 0.1 : 1.0;
      const sweep = quick ? 0.1 : 0.2;
      const tl = gsap.timeline();
      tlRefs.push(tl);

      tl.to(textEls, { opacity: quick ? 0 : 0.35, duration: quick ? 0.12 : 0.7, ease: 'power2.out' }, 0)
        .to(hudRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0)
        .to(fx.current, { speed: 0.05, duration: quick ? 0.45 : 0.9, ease: 'power3.out' }, 0)
        .to(vignetteRef.current, { opacity: 1, duration: stillness, ease: 'power2.in' }, 0)
        .to(wrap, { scale: 1.025, duration: stillness + 0.2, ease: 'power1.out' }, 0);
      if (!quick) tl.to(fx.current, { glint: 1, duration: 0.3, ease: 'power2.out' }, 0.2).to(fx.current, { glint: 0, duration: 0.45, ease: 'power2.in' }, 0.55);

      const t0 = stillness;
      const tR = t0 + sweep;
      tl.add(() => playStrikeSound(), t0 - 0.02)
        .set(fx.current, { boltA: 1, cutW: 1, boltT: 0 }, t0)
        .to(fx.current, { boltT: 1, duration: sweep, ease: 'power2.in' }, t0)
        .to(textEls, { opacity: 1, duration: 0.05, ease: 'none' }, tR)
        .to(textEls, { opacity: 0.55, duration: 0.6, ease: 'power2.out' }, tR + 0.08)
        .fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.32, duration: 0.04, ease: 'none' }, tR)
        .to(flashRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, tR + 0.05)
        .to(fx.current, { lit: 1, duration: 0.04, ease: 'none' }, tR)
        .to(fx.current, { lit: 0, duration: 0.9, ease: 'power2.out' }, tR + 0.06)
        .to(
          wrap,
          {
            keyframes: [
              { x: -4, y: 2, duration: 0.03 },
              { x: 3, y: -2, duration: 0.03 },
              { x: 0, y: 0, duration: 0.06 },
            ],
            ease: 'none',
          },
          tR + 0.02,
        )
        .to(fx.current, { cutW: 0.1, duration: quick ? 0.2 : 0.7, ease: 'power3.out' }, tR);
      if (!quick && glowRef.current) tl.to(glowRef.current, { opacity: 1.5, scale: 1.1, duration: 0.2 }, tR).to(glowRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, tR + 0.2);
      tl.add(() => {
        const n = small ? 20 : 44;
        for (let i = 0; i < n; i++) throwSparks(curvePoint(slashA, slashC, slashB, Math.random()), 1, 1.1);
      }, tR);

      const tCut = tR + (quick ? 0.17 : 1.05);
      tl.add(() => reveal(), tCut)
        .to(fx.current, { boltA: 0, duration: quick ? 0.6 : 1.0, ease: 'power2.out' }, tCut)
        .fromTo(seam, { opacity: 0 }, { opacity: 0.9, duration: 0.08, ease: 'none' }, tCut)
        .to(seam, { opacity: 0, duration: quick ? 0.8 : 1.4, ease: 'power2.out' }, tCut + 0.08)
        .to(vignetteRef.current, { opacity: 0, duration: 0.6 }, tCut)
        .to(glowRef.current, { opacity: 0, duration: 0.8, ease: 'power2.in' }, tCut)
        .to(A, { x: ax, y: ay, rotation: -2, duration: quick ? 0.9 : 1.5, ease: quick ? 'power4.in' : 'power3.inOut' }, tCut + (quick ? 0 : 0.05))
        .to(B, { x: -ax, y: -ay, rotation: 2, duration: quick ? 0.9 : 1.5, ease: quick ? 'power4.in' : 'power3.inOut' }, tCut + (quick ? 0 : 0.05))
        .to(wrap, { scale: 1, duration: 0.6, ease: 'power2.out' }, tCut)
        .add(finish, tCut + (quick ? 0.95 : 1.65));
    };

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(progRaf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', onLoad);
      tlRefs.forEach((t) => t.kill());
      gsap.killTweensOf([root, wrap0, panelA0, panelB0, fxState, ...textEls]);
      audioRef.current?.close?.().catch(() => {});
    };
  }, [quick]);

  const wordmark = (
    <div aria-hidden="true" className="ld-text absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none opacity-0">
      <p className="flex items-baseline gap-[0.45em] text-3xl sm:text-5xl text-cream/90 leading-none">
        <span className="font-sans font-semibold tracking-tight">Aitezaz</span>
        <span className="italic font-normal" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
          Sikandar
        </span>
      </p>
      <div className="h-px w-36 sm:w-56 bg-cream/15 overflow-hidden">
        <div className="ld-bar h-full w-full origin-left bg-cream/80" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[99999] cursor-wait text-cream select-none pointer-events-auto overflow-hidden"
    >
      <div ref={wrapRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <div ref={panelARef} className="absolute inset-0" style={{ backgroundImage: SKY, backgroundColor: BG, willChange: 'transform' }}>
          {wordmark}
        </div>
        <div ref={panelBRef} className="absolute inset-0" style={{ backgroundImage: SKY, backgroundColor: BG, willChange: 'transform' }}>
          {wordmark}
        </div>

        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none opacity-0"
          style={{ background: 'radial-gradient(60% 80% at 50% 118%, rgba(255,77,46,0.34) 0%, rgba(255,77,46,0.12) 40%, transparent 72%)', transformOrigin: '50% 100%' }}
        />

        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />

        <svg aria-hidden="true" className="absolute inset-0 h-full w-full pointer-events-none overflow-visible" style={{ mixBlendMode: 'screen' }}>
          <defs>
            <filter id="seam-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <line ref={seamRef} x1="0" y1="0" x2="0" y2="0" stroke="#FF5A36" strokeWidth="12" filter="url(#seam-glow)" opacity="0" />
        </svg>

        <div
          ref={vignetteRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.8) 100%)' }}
        />
      </div>

      <div
        ref={flashRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, #FFF6EC 0%, #FFD9C0 60%, #FF9C75 100%)' }}
      />

      <div ref={hudRef} className="absolute inset-0 pointer-events-none">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          className="pointer-events-auto absolute top-4 right-4 sm:top-7 sm:right-8 px-1 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-cream/45 hover:text-cream transition-colors cursor-pointer"
        >
          Sound {soundOn ? 'on' : 'off'}
        </button>
      </div>
    </div>
  );
}
