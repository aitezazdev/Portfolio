'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import { gsap, useGSAP } from '@/lib/gsap';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import { getAllProjects } from '@/lib/projects';
import { Project } from '@/lib/projects';

const useHoverPreview = () => {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imgXTo = useRef<any>(null);
  const imgYTo = useRef<any>(null);
  const mouse = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);
  const dynamics = useRef({ velocityX: 0, velocityY: 0, rotation: 0 });
  /**
   * Snellenberg-style single-writer architecture: scale/opacity are NOT
   * tweened on enter/exit. One rAF loop lerps EVERYTHING (position, scale,
   * opacity, rotation, inner zoom) and emits exactly one transform per
   * frame. No tween-vs-rAF races, no blur repaints -> perfectly fluid.
   */
  const vis = useRef({ scale: 0, opacity: 0 });

  const setFloatingRef = useCallback((el: HTMLDivElement | null) => {
    floatingRef.current = el;
    if (!el) return;
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: -1000,
      y: -1000,
      scale: 0,
      opacity: 0,
      rotation: 0,
      transformOrigin: 'center center',
    });
    el.style.visibility = 'hidden';
  }, []);

  const setInnerRef = useCallback((el: HTMLDivElement | null) => {
    innerRef.current = el;
  }, []);

  const setImageContainerRef = useCallback((el: HTMLDivElement | null) => {
    imageContainerRef.current = el;
    if (!el) return;
    imgXTo.current = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power2' });
    imgYTo.current = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power2' });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;

    const POSITION_LERP = 0.115;
    const SCALE_LERP = 0.13;
    const OPACITY_LERP = 0.17;
    const ROT_LERP = 0.09;
    const MAX_ROT = 6;
    const MAX_PARALLAX = 12;

    const tick = () => {
      const m = mouse.current;
      const d = dynamics.current;

      // Smoothed cursor velocity (for tilt + parallax)
      d.velocityX += (m.x - m.prevX - d.velocityX) * 0.18;
      d.velocityY += (m.y - m.prevY - d.velocityY) * 0.18;
      m.prevX = m.x;
      m.prevY = m.y;

      delayedMouse.current.x += (m.x - delayedMouse.current.x) * POSITION_LERP;
      delayedMouse.current.y += (m.y - delayedMouse.current.y) * POSITION_LERP;

      const target = isHovering.current ? 1 : 0;
      vis.current.scale += (target - vis.current.scale) * SCALE_LERP;
      vis.current.opacity += (target - vis.current.opacity) * OPACITY_LERP;

      const targetR = isHovering.current
        ? gsap.utils.clamp(-MAX_ROT, MAX_ROT, d.velocityX * 0.3)
        : 0;
      d.rotation += (targetR - d.rotation) * ROT_LERP;

      if (imageContainerRef.current) {
        gsap.set(imageContainerRef.current, {
          scale: 1.12 + (1 - vis.current.scale) * 0.26,
        });
        if (imgXTo.current && imgYTo.current) {
          if (isHovering.current) {
            imgXTo.current(gsap.utils.clamp(-MAX_PARALLAX, MAX_PARALLAX, -d.velocityX));
            imgYTo.current(gsap.utils.clamp(-MAX_PARALLAX, MAX_PARALLAX, -d.velocityY));
          } else {
            imgXTo.current(0);
            imgYTo.current(0);
          }
        }
      }

      const el = floatingRef.current;
      if (el) {
        if (vis.current.opacity < 0.02) {
          el.style.visibility = 'hidden';
        } else {
          if (el.style.visibility !== 'visible') el.style.visibility = 'visible';
          gsap.set(el, {
            x: delayedMouse.current.x,
            y: delayedMouse.current.y,
            scale: Math.max(vis.current.scale, 0.0001),
            opacity: vis.current.opacity,
            rotation: d.rotation,
          });
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const show = useCallback(() => {
    if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)) return;
    isHovering.current = true;
  }, []);

  const hide = useCallback(() => {
    isHovering.current = false;
  }, []);

  return { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, isHovering, mouse };
};

interface MobileSnapProjectsProps {
  projects: Project[];
  router: ReturnType<typeof useRouter>;
}

function MobileSnapProjects({ projects, router }: MobileSnapProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      if (!sectionRef.current || !projects.length) return;
      const mm = gsap.matchMedia();

      mm.add('(max-width: 767px)', () => {
        const cards = cardRefs.current.filter(Boolean);
        cards.forEach((card) => {
          const imgWrap = card.querySelector('.mc-img-wrap');
          const img = card.querySelector('.mc-img');
          const num = card.querySelector('.mc-num');
          const tags = card.querySelectorAll('.mc-tag');
          const title = card.querySelector('.mc-title');
          const cta = card.querySelector('.mc-cta');

          gsap.set(card, { opacity: 0, y: 52 });
          if (imgWrap) gsap.set(imgWrap, { clipPath: 'inset(100% 0 0 0 round 14px)' });
          if (img) gsap.set(img, { scale: 1.12 });
          if (num) gsap.set(num, { opacity: 0, y: 16 });
          if (tags.length) gsap.set(tags, { opacity: 0, y: 12 });
          if (title) gsap.set(title, { opacity: 0, y: 22 });
          if (cta) gsap.set(cta, { opacity: 0, y: 14 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });

          tl.to(card, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0);
          if (imgWrap) {
            tl.to(imgWrap, {
              clipPath: 'inset(0% 0 0 0 round 14px)', duration: 0.9, ease: 'power4.inOut',
            }, 0.1);
          }
          if (img) {
            tl.to(img, { scale: 1, duration: 1.1, ease: 'power3.out' }, 0.1);
          }
          if (num) {
            tl.to(num, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.42);
          }
          if (tags.length) {
            tl.to(tags, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.07 }, 0.55);
          }
          if (title) {
            tl.to(title, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.62);
          }
          if (cta) {
            tl.to(cta, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.82);
          }
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [projects] },
  );

  return (
    <div ref={sectionRef} className="md:hidden bg-cream pb-12">
      <div className="px-6 pt-16 pb-8">
        <AnimatedHeading
          words={[{ t: 'SELECTED' }, { t: 'works', serif: true }]}
          className="text-[clamp(3rem,14vw,5rem)] leading-none text-charcoal"
        />
      </div>

      <div className="flex flex-col gap-4 px-4">
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            onTouchStart={() => router.prefetch(`/projects/${project.slug}`)}
            onClick={() => {
              const scrollY = (window as any).__lenis
                ? Math.round((window as any).__lenis.scroll)
                : Math.round(window.scrollY);
              sessionStorage.setItem('projects-scroll', scrollY.toString());
              sessionStorage.setItem('previous-project-url', window.location.pathname);
            }}
            ref={(el) => { cardRefs.current[index] = el; }}
            className="overflow-hidden rounded-3xl block no-underline text-inherit"
            style={{ background: '#111110', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <div className="p-3 pb-0">
              <div
                className="mc-img-wrap relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: '21 / 9', clipPath: 'inset(100% 0 0 0 round 14px)' }}
              >
                <Image
                  src={project.hoverImage || project.images[0]}
                  alt={project.title}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 32px)"
                  priority={index < 2}
                  className="mc-img object-cover object-top"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)' }}
                />
              </div>
            </div>

            <div className="px-5 pt-4 pb-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <span
                  className="mc-num font-mono font-black leading-none"
                  style={{
                    fontSize: 'clamp(2rem, 9vw, 2.6rem)',
                    color: '#C45D3E',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="mc-tag font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      fontSize: 9,
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h3
                className="mc-title font-black uppercase leading-tight text-white mb-4"
                style={{ fontSize: 'clamp(1.3rem, 5.5vw, 2rem)', letterSpacing: '-0.025em' }}
              >
                {project.title}
              </h3>

              <div className="mc-cta" style={{ opacity: 0 }}>
                <div className="h-px w-full mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[11px] uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    View Project
                  </span>
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full text-white text-sm"
                    style={{ background: '#C45D3E', boxShadow: '0 0 16px rgba(196, 93, 62, 0.35)' }}
                  >
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const projects = getAllProjects();
  const isLoading = false;
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderReelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(-1);

  const { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, mouse } =
    useHoverPreview();

  useEffect(() => {
    getAllProjects().slice(0, 4).forEach((project) => {
      const img = new window.Image();
      img.src = project.hoverImage || project.images[0];
    });
  }, []);

  useGSAP(
    () => {
      if (isLoading || projects.length === 0) return;
      const rows = containerRef.current?.querySelectorAll('.project-row-desktop');
      if (!rows?.length) return;
      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight * 0.95;
        if (alreadyVisible) {
          gsap.fromTo(row, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: index * 0.08, ease: 'power3.out' });
        } else {
          gsap.fromTo(row, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 92%', once: true } });
        }
      });
    },
    { scope: containerRef, dependencies: [isLoading, projects] },
  );

  const activateRow = useCallback(
    (index: number) => {
      if (
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)
      )
        return;
      if (!containerRef.current) return;

      if (activeIndexRef.current === index) {
        show();
        return;
      }
      activeIndexRef.current = index;

      router.prefetch(`/projects/${projects[index]?.slug || ''}`);

      const rows = containerRef.current.querySelectorAll<HTMLAnchorElement>('.project-row-desktop');
      rows.forEach((row, idx) => {
        const line = row.querySelector('.hover-line-ref');
        const titleOverlay = row.querySelector('.title-reveal-overlay') as HTMLElement | null;
        if (idx === index) {
          if (line) gsap.to(line, { width: '100%', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          if (titleOverlay) titleOverlay.style.clipPath = 'inset(0 0% 0 0)';
        } else {
          if (line) gsap.to(line, { width: '0%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          if (titleOverlay) titleOverlay.style.clipPath = 'inset(0 100% 0 0)';
        }
      });

      if (sliderReelRef.current) {
        gsap.to(sliderReelRef.current, {
          yPercent: -index * 100,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }

      show();
    },
    [projects, router, show],
  );

  const deactivateAll = useCallback(() => {
    activeIndexRef.current = -1;
    if (containerRef.current) {
      const lines = containerRef.current.querySelectorAll('.hover-line-ref');
      lines.forEach((line) => gsap.to(line, { width: '0%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
      const overlays = containerRef.current.querySelectorAll('.title-reveal-overlay');
      overlays.forEach((ov) => {
        (ov as HTMLElement).style.clipPath = 'inset(0 100% 0 0)';
      });
    }
    hide();
  }, [hide]);

  useEffect(() => {
    const handleCheckScroll = () => {
      if (
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)
      )
        return;
      if (!containerRef.current) return;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx === 0 && my === 0) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      if (
        my < containerRect.top ||
        my > containerRect.bottom ||
        mx < containerRect.left ||
        mx > containerRect.right
      ) {
        if (activeIndexRef.current !== -1) {
          deactivateAll();
        }
        return;
      }

      const rows = containerRef.current.querySelectorAll<HTMLAnchorElement>('.project-row-desktop');
      let foundIndex = -1;
      rows.forEach((row, idx) => {
        const rect = row.getBoundingClientRect();
        if (my >= rect.top && my <= rect.bottom && mx >= rect.left && mx <= rect.right) {
          foundIndex = idx;
        }
      });

      if (foundIndex !== -1) {
        activateRow(foundIndex);
      } else if (activeIndexRef.current !== -1) {
        deactivateAll();
      }
    };

    window.addEventListener('scroll', handleCheckScroll, { passive: true });
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.on('scroll', handleCheckScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleCheckScroll);
      if (lenis) {
        lenis.off('scroll', handleCheckScroll);
      }
    };
  }, [activateRow, deactivateAll, mouse]);

  const handleTableMouseLeave = () => {
    deactivateAll();
  };

  const handleRowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const row = e.currentTarget;
    const line = row.querySelector('.hover-line-ref');
    if (line) gsap.to(line, { width: '100%', duration: 0.15, ease: 'power2.out' });
    gsap.to(row, { backgroundColor: 'rgba(196, 93, 62, 0.04)', duration: 0.15, ease: 'power2.out' });
    const scrollY = (window as any).__lenis
      ? Math.round((window as any).__lenis.scroll)
      : Math.round(window.scrollY);
    sessionStorage.setItem('projects-scroll', scrollY.toString());
    sessionStorage.setItem('previous-project-url', window.location.pathname);
  };

  if (isLoading) {
    return (
      <section id="projects" className="relative min-h-screen w-full bg-cream text-charcoal overflow-hidden px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 bg-gray-300 rounded animate-pulse w-1/3 mb-10" />
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-8 border-b border-border flex animate-pulse">
                <div className="w-12 h-6 bg-gray-300 rounded mr-8" />
                <div className="flex-1 space-y-4">
                  <div className="h-10 bg-gray-300 rounded w-1/2" />
                  <div className="h-6 bg-gray-300 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-cream text-charcoal overflow-hidden"
    >
      <div className="hidden md:block pt-16 pb-20 md:pt-20 md:pb-24 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <AnimatedHeading
            words={[{ t: 'SELECTED' }, { t: 'works', serif: true }]}
            className="text-[clamp(2.5rem,7vw,6.5rem)] leading-none text-charcoal"
          />
        </div>
        <hr className="border-t border-border w-full mb-4" />

        <div className="flex flex-col w-full" onMouseLeave={handleTableMouseLeave}>
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="project-row-desktop relative flex items-stretch border-b border-border py-8 min-h-[120px] group cursor-pointer no-underline"
              onMouseEnter={() => activateRow(index)}
              data-cursor="view"
              onClick={handleRowClick}
            >
              <div className="flex-[0_0_80px] font-mono text-[13px] text-gray-soft pt-2 relative h-6 overflow-hidden">
                <span className="block absolute transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block absolute translate-y-full opacity-0 text-accent transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  →
                </span>
              </div>

              <div className="flex-1 pr-8">
                <h3 className="relative text-[clamp(2rem,4vw,3.5rem)] font-extrabold uppercase leading-none tracking-tight overflow-hidden">
                  <span className="block text-charcoal select-none">{project.title}</span>
                  <span
                    className="title-reveal-overlay block text-accent absolute inset-0 select-none"
                    style={{
                      clipPath: 'inset(0 100% 0 0)',
                      transition: 'clip-path 0.5s cubic-bezier(0.76,0,0.24,1)',
                    }}
                  >
                    {project.title}
                  </span>
                </h3>

                <div className="mt-3 flex flex-wrap gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  {project.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-transparent border border-gray-300 text-warm text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-[0_0_200px] text-right flex flex-col justify-end items-end pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-charcoal group-hover:text-accent transition-colors duration-250 flex items-center gap-1">
                  <span>View Project</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 hover-line-ref pointer-events-none" />
            </Link>
          ))}
        </div>

        <div
          ref={setFloatingRef}
          className="floating-preview-ref fixed pointer-events-none z-[100]"
          style={{
            top: 0,
            left: 0,
            willChange: 'transform',
          }}
        >
          <div
            ref={setInnerRef}
            className="w-[400px] xl:w-[440px] rounded-2xl overflow-hidden shadow-2xl bg-surface-mid"
            style={{
              aspectRatio: '16 / 10',
              willChange: 'transform',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.38), 0 10px 20px -8px rgba(0, 0, 0, 0.22)',
            }}
          >
            <div
              ref={setImageContainerRef}
              className="w-full h-full relative overflow-hidden"
              style={{ willChange: 'transform', transform: 'scale(1.12)' }}
            >
              <div
                ref={sliderReelRef}
                className="w-full h-full relative"
                style={{ willChange: 'transform', transform: 'translateY(0%)' }}
              >
                {projects.map((project, idx) => {
                  const imgUrl = project.hoverImage || project.images[0];
                  return (
                    <div
                      key={project.id}
                      className="w-full h-full absolute inset-0"
                      style={{ top: `${idx * 100}%` }}
                    >
                  <Image
                    src={imgUrl}
                    alt={project.title}
                    fill
                    sizes="460px"
                    priority={idx < 2}
                    className="object-cover object-top"
                  />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileSnapProjects projects={projects} router={router} />
    </section>
  );
}
