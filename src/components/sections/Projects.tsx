'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import { gsap, useGSAP } from '@/lib/gsap';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import { getAllProjects } from '@/lib/projects';
import { Project } from '@/lib/projects';

/* ─────────────────────────────────────────────
   DESKTOP: Hover-preview cursor hook
───────────────────────────────────────────── */
const useHoverPreview = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  onScrollLeave: () => void
) => {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const rotateTo = useRef<any>(null);
  const imgXTo = useRef<any>(null);
  const imgYTo = useRef<any>(null);
  const mouse = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);
  const dynamics = useRef({
    velocityX: 0,
    velocityY: 0,
    currentRotation: 0,
    targetRotation: 0,
  });

  const setFloatingRef = useCallback((el: HTMLDivElement | null) => {
    floatingRef.current = el;
    if (!el) return;
    gsap.set(el, {
      xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0, rotation: 0,
      transformOrigin: 'center center', clipPath: 'circle(0% at 50% 50%)',
    });
    rotateTo.current = gsap.quickTo(el, 'rotation', { duration: 0.4, ease: 'power3' });
  }, []);

  const setInnerRef = useCallback((el: HTMLDivElement | null) => {
    innerRef.current = el;
  }, []);

  const setImageContainerRef = useCallback((el: HTMLDivElement | null) => {
    imageContainerRef.current = el;
    if (!el) return;
    imgXTo.current = gsap.quickTo(el, 'x', { duration: 0.2, ease: 'power2' });
    imgYTo.current = gsap.quickTo(el, 'y', { duration: 0.2, ease: 'power2' });
  }, []);

  useEffect(() => {
    const lerpFactor = 0.12;
    const positionLerpFactor = 0.03;
    const maxRotation = 12;
    const maxParallax = 15;

    const tick = () => {
      const m = mouse.current;
      const d = dynamics.current;
      const rawVx = m.x - m.prevX;
      const rawVy = m.y - m.prevY;
      d.velocityX += (rawVx - d.velocityX) * 0.2;
      d.velocityY += (rawVy - d.velocityY) * 0.2;
      m.prevX = m.x;
      m.prevY = m.y;
      delayedMouse.current.x += (m.x - delayedMouse.current.x) * positionLerpFactor;
      delayedMouse.current.y += (m.y - delayedMouse.current.y) * positionLerpFactor;

      if (floatingRef.current) {
        gsap.set(floatingRef.current, {
          x: delayedMouse.current.x,
          y: delayedMouse.current.y,
        });
      }

      if (isHovering.current) {
        d.targetRotation = gsap.utils.clamp(-maxRotation, maxRotation, d.velocityX * 0.35);
        if (imgXTo.current && imgYTo.current) {
          imgXTo.current(gsap.utils.clamp(-maxParallax, maxParallax, -d.velocityX * 1.2));
          imgYTo.current(gsap.utils.clamp(-maxParallax, maxParallax, -d.velocityY * 1.2));
        }
      } else {
        d.targetRotation = 0;
        if (imgXTo.current && imgYTo.current) {
          imgXTo.current(0);
          imgYTo.current(0);
        }
      }

      d.currentRotation += (d.targetRotation - d.currentRotation) * lerpFactor;
      if (rotateTo.current && Math.abs(d.currentRotation) > 0.01) {
        rotateTo.current(d.currentRotation);
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
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const show = useCallback(() => {
    isHovering.current = true;
    if (!floatingRef.current) return;
    delayedMouse.current.x = mouse.current.x;
    delayedMouse.current.y = mouse.current.y;
    gsap.set(floatingRef.current, { x: mouse.current.x, y: mouse.current.y });
    dynamics.current.currentRotation = 0;
    dynamics.current.targetRotation = 0;
    if (rotateTo.current) rotateTo.current(0);
    gsap.to(floatingRef.current, {
      clipPath: 'circle(75% at 50% 50%)', opacity: 1, scale: 1,
      duration: 0.6, ease: 'power4.out', overwrite: 'auto',
    });
  }, []);

  const hide = useCallback(() => {
    isHovering.current = false;
    if (!floatingRef.current) return;
    gsap.to(floatingRef.current, {
      clipPath: 'circle(0% at 50% 50%)', opacity: 0, scale: 0.6,
      duration: 0.4, ease: 'power3.in', overwrite: 'auto',
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHovering.current) return;
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cursorY = mouse.current.y;
        if (cursorY < rect.top || cursorY > rect.bottom) {
          hide();
          onScrollLeave();
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, onScrollLeave, hide]);

  return { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, isHovering };
};

/* ─────────────────────────────────────────────
   MOBILE: Editorial Contained-Image Cards
───────────────────────────────────────────── */
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
          const year = card.querySelector('.mc-year');
          const tags = card.querySelectorAll('.mc-tag');
          const title = card.querySelector('.mc-title');
          const cta = card.querySelector('.mc-cta');

          gsap.set(card, { opacity: 0, y: 52 });
          if (imgWrap) gsap.set(imgWrap, { clipPath: 'inset(100% 0 0 0 round 14px)' });
          if (img) gsap.set(img, { scale: 1.12 });
          const metaEls = [num, year].filter(Boolean);
          if (metaEls.length) gsap.set(metaEls, { opacity: 0, y: 16 });
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
          if (metaEls.length) {
            tl.to(metaEls, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.42);
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
          text="PROJECTS"
          className="text-[clamp(3rem,14vw,5rem)] font-black leading-none uppercase text-charcoal"
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
                style={{ aspectRatio: '1919 / 923', clipPath: 'inset(100% 0 0 0 round 14px)' }}
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
                    fontSize: 'clamp(2.4rem,11vw,3.2rem)',
                    color: '#0c6145',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="mc-year font-mono text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(12, 97, 69, 0.13)', color: '#0c6145', border: '1px solid rgba(12, 97, 69, 0.28)' }}
                >
                  {project.year}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="mc-tag font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      fontSize: 9, background: 'rgba(255,255,255,0.055)', color: 'rgba(255,255,255,0.42)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h3
                className="mc-title font-black uppercase leading-none text-white mb-5"
                style={{ fontSize: 'clamp(1.75rem,7.5vw,2.6rem)', letterSpacing: '-0.025em' }}
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
                    style={{ background: '#0c6145', boxShadow: '0 0 16px rgba(12, 97, 69, 0.35)' }}
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

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function ProjectsPage() {
  const router = useRouter();
  const projects = getAllProjects();
  const isLoading = false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string>('');
  const lastHoveredImgRef = useRef<string>('');

  const handleScrollLeave = useCallback(() => {
    if (!containerRef.current) return;
    const lines = containerRef.current.querySelectorAll('.hover-line-ref');
    lines.forEach((line) => gsap.to(line, { width: '0%', duration: 0.3, ease: 'power2.out' }));
    const overlays = containerRef.current.querySelectorAll('.title-reveal-overlay');
    overlays.forEach((ov) => { (ov as HTMLElement).style.clipPath = 'inset(0 100% 0 0)'; });
    lastHoveredImgRef.current = '';
  }, []);

  const { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, isHovering } =
    useHoverPreview(containerRef, handleScrollLeave);

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

  const handleRowMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, imageUrl: string, index: number) => {
    router.prefetch(`/projects/${projects[index]?.slug || ''}`);
    const line = e.currentTarget.querySelector('.hover-line-ref');
    if (line) gsap.to(line, { width: '100%', duration: 0.4, ease: 'power2.out' });
    const titleOverlay = e.currentTarget.querySelector('.title-reveal-overlay') as HTMLElement | null;
    if (titleOverlay) titleOverlay.style.clipPath = 'inset(0 0% 0 0)';
    const isNewImage = lastHoveredImgRef.current !== imageUrl;
    lastHoveredImgRef.current = imageUrl;
    if (isNewImage && isHovering.current) {
      const floatingEl = document.querySelector('.floating-preview-ref');
      if (floatingEl) {
        gsap.to(floatingEl, {
          scale: 0.92, clipPath: 'circle(40% at 50% 50%)', duration: 0.15, ease: 'power2.in',
          onComplete: () => {
            setHoveredImage(imageUrl);
            gsap.to(floatingEl, { scale: 1, clipPath: 'circle(75% at 50% 50%)', duration: 0.35, ease: 'power3.out' });
          },
        });
      }
    } else {
      setHoveredImage(imageUrl);
      show();
    }
  };

  const handleRowMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const line = e.currentTarget.querySelector('.hover-line-ref');
    if (line) gsap.to(line, { width: '0%', duration: 0.4, ease: 'power2.out' });
    const titleOverlay = e.currentTarget.querySelector('.title-reveal-overlay') as HTMLElement | null;
    if (titleOverlay) titleOverlay.style.clipPath = 'inset(0 100% 0 0)';
    hide();
  };

  const handleRowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const row = e.currentTarget;
    const line = row.querySelector('.hover-line-ref');
    if (line) gsap.to(line, { width: '100%', duration: 0.15, ease: 'power2.out' });
    gsap.to(row, { backgroundColor: 'rgba(16, 185, 129, 0.04)', duration: 0.15, ease: 'power2.out' });
    const scrollY = (window as any).__lenis
      ? Math.round((window as any).__lenis.scroll)
      : Math.round(window.scrollY);
    sessionStorage.setItem('projects-scroll', scrollY.toString());
    sessionStorage.setItem('previous-project-url', window.location.pathname);
  };

  /* ── Loading skeleton ── */
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
      {/* ═══════════════════════════════════════
          DESKTOP
      ══════════════════════════════════════ */}
      <div className="hidden md:block py-24 md:py-32 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <AnimatedHeading
            text="PROJECTS"
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black leading-none uppercase text-charcoal"
          />
        </div>
        <hr className="border-t border-border w-full mb-4" />

        <div className="flex flex-col w-full">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="project-row-desktop relative flex items-stretch border-b border-border py-8 min-h-[120px] group cursor-pointer no-underline"
              onMouseEnter={(e) => handleRowMouseEnter(e, project.hoverImage || project.images[0], index)}
              onMouseLeave={handleRowMouseLeave}
              data-cursor="view"
              onClick={handleRowClick}
            >
              <div className="flex-[0_0_80px] font-mono text-[13px] text-gray-soft pt-2 relative h-6 overflow-hidden">
                <span className="block absolute transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block absolute translate-y-full opacity-0 text-forest transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  →
                </span>
              </div>

              <div className="flex-1 pr-8">
                <h3 className="relative text-[clamp(2rem,4vw,3.5rem)] font-extrabold uppercase leading-none tracking-tight overflow-hidden">
                  <span className="block text-charcoal select-none">{project.title}</span>
                  <span
                    className="title-reveal-overlay block text-forest absolute inset-0 select-none"
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

                <div className="font-mono text-xs text-gray-soft mt-2">{project.year}</div>
              </div>

              <div className="flex-[0_0_200px] text-right flex flex-col justify-end items-end pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-charcoal group-hover:text-forest transition-colors duration-250 flex items-center gap-1">
                  <span>View Project</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] bg-forest w-0 hover-line-ref pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Floating hover preview */}
        <div
          ref={setFloatingRef}
          className="floating-preview-ref fixed pointer-events-none z-[100] opacity-0"
          style={{
            top: 0, left: 0, willChange: 'transform, clip-path, opacity',
            clipPath: 'circle(0% at 50% 50%)',
          }}
        >
          <div
            ref={setInnerRef}
            className="w-[500px] rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '1919 / 923', willChange: 'transform',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 8px 20px -8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              ref={setImageContainerRef}
              className="w-full h-full relative"
              style={{ willChange: 'transform', transform: 'scale(1.12)' }}
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)' }}
              />
              {projects.map((project) => {
                const imgUrl = project.hoverImage || project.images[0];
                const isActive = hoveredImage === imgUrl;
                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 transition-opacity duration-300 ease-out"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <Image
                      src={imgUrl}
                      alt={project.title}
                      fill
                      sizes="500px"
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MOBILE
      ══════════════════════════════════════ */}
      <MobileSnapProjects projects={projects} router={router} />
    </section>
  );
}
