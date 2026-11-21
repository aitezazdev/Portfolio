'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import { gsap, useGSAP } from '@/lib/gsap';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import { getAllProjects, Project } from '@/lib/projects';
import { safeSessionStorage } from '@/utils/storage';
import { useReducedMotion } from '@/lib/useReducedMotion';

const useHoverPreview = (containerRef?: React.RefObject<HTMLDivElement | null>) => {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const imgXTo = useRef<any>(null);
  const imgYTo = useRef<any>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef<boolean>(false);
  const rafId = useRef<number | null>(null);
  const dynamics = useRef({ rotation: 0, scale: 0, opacity: 0 });
  const isVisibleRef = useRef<boolean>(false);

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
    imgXTo.current = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power2.out' });
    imgYTo.current = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power2.out' });
  }, []);

  const tick = useCallback(() => {
    if (!isVisibleRef.current) {
      rafId.current = null;
      return;
    }

    const m = mouse.current;
    const d = dynamics.current;

    const dx = m.x - delayedMouse.current.x;
    const dy = m.y - delayedMouse.current.y;

    delayedMouse.current.x += dx * 0.055;
    delayedMouse.current.y += dy * 0.055;

    const targetRot = isHovering.current ? gsap.utils.clamp(-9, 9, dx * 0.15) : 0;
    d.rotation += (targetRot - d.rotation) * 0.08;

    if (imageContainerRef.current && imgXTo.current && imgYTo.current) {
      if (isHovering.current) {
        imgXTo.current(gsap.utils.clamp(-14, 14, -dx * 0.25));
        imgYTo.current(gsap.utils.clamp(-12, 12, -dy * 0.25));
      } else {
        imgXTo.current(0);
        imgYTo.current(0);
      }
    }

    const el = floatingRef.current;
    if (el) {
      if (d.opacity < 0.005) {
        el.style.visibility = 'hidden';
      } else {
        if (el.style.visibility !== 'visible') el.style.visibility = 'visible';
        gsap.set(el, {
          x: delayedMouse.current.x,
          y: delayedMouse.current.y,
          scale: Math.max(d.scale, 0.0001),
          opacity: d.opacity,
          rotation: d.rotation,
        });
      }
    }

    if (!isHovering.current && d.opacity < 0.005 && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      rafId.current = null;
      return;
    }

    rafId.current = requestAnimationFrame(tick);
  }, []);

  const startLoop = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;
    if (!isVisibleRef.current) return;
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const stopLoop = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  const forceHide = useCallback(() => {
    isHovering.current = false;
    dynamics.current.opacity = 0;
    dynamics.current.scale = 0;
    dynamics.current.rotation = 0;
    stopLoop();
    const el = floatingRef.current;
    if (el) {
      el.style.visibility = 'hidden';
      gsap.set(el, { opacity: 0, scale: 0, rotation: 0 });
    }
  }, [stopLoop]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;

    const container = containerRef?.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (isHovering.current || dynamics.current.opacity > 0.005) {
            startLoop();
          }
        } else {
          forceHide();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      forceHide();
    };
  }, [containerRef, startLoop, forceHide]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches) return;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const show = useCallback((clientX?: number, clientY?: number) => {
    if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)) return;
    const el = floatingRef.current;
    if (!el) return;

    const targetX = clientX ?? mouse.current.x;
    const targetY = clientY ?? mouse.current.y;

    if (!isHovering.current) {
      if (targetX !== 0 && targetY !== 0) {
        delayedMouse.current.x = targetX;
        delayedMouse.current.y = targetY;
        gsap.set(el, { x: targetX, y: targetY });
      }
      isHovering.current = true;
    }

    gsap.to(dynamics.current, {
      scale: 1,
      opacity: 1,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    startLoop();
  }, [startLoop]);

  const hide = useCallback(() => {
    if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)) return;
    const el = floatingRef.current;
    if (!el) return;

    isHovering.current = false;
    if (!isVisibleRef.current) {
      forceHide();
      return;
    }
    gsap.to(dynamics.current, {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        if (!isHovering.current && el) {
          el.style.visibility = 'hidden';
          gsap.set(el, { opacity: 0, scale: 0 });
        }
      },
    });

    startLoop();
  }, [startLoop, forceHide]);

  return { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, forceHide, isHovering, mouse };
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

      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = cardRefs.current.filter((card): card is HTMLAnchorElement => card !== null);
        cards.forEach((card) => {
          const imgWrap = card.querySelector('.mc-img-wrap');
          const img = card.querySelector('.mc-img');
          const num = card.querySelector('.mc-num');
          const tags = card.querySelectorAll('.mc-tag');
          const title = card.querySelector('.mc-title');
          const cta = card.querySelector('.mc-cta');
          const desc = card.querySelector('.mc-desc');

          gsap.set(card, { opacity: 0, y: 52 });
          if (imgWrap) gsap.set(imgWrap, { clipPath: 'inset(100% 0 0 0 round 14px)' });
          if (img) gsap.set(img, { scale: 1.12 });
          if (num) gsap.set(num, { opacity: 0, y: 16 });
          if (tags.length) gsap.set(tags, { opacity: 0, y: 12 });
          if (title) gsap.set(title, { opacity: 0, y: 22 });
          if (cta) gsap.set(cta, { opacity: 0, y: 14 });
          if (desc) gsap.set(desc, { opacity: 0, y: 14 });

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
          if (desc) {
            tl.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.72);
          }
          if (cta) {
            tl.to(cta, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.78);
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
          words={[{ t: 'Things' }, { t: "I've" }, { t: 'shipped', serif: true }]}
          className="text-[clamp(3rem,14vw,5rem)] leading-none text-charcoal"
          accentClassName="text-accent-deep"
        />
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6">
        {projects.map((project, index) => {
          const featured = true;
          const num = String(index + 1).padStart(2, '0');
          const tags = (
            <div className="flex flex-wrap gap-1.5 overflow-hidden" style={{ height: 28 }}>
              {project.tech.slice(0, featured ? 3 : 2).map((t) => (
                <span
                  key={t}
                  className="mc-tag shrink-0 font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          );
          const arrow = (
            <span
              className="mc-cta reveal-hide flex shrink-0 items-center justify-center w-9 h-9 rounded-full text-ink text-sm"
              style={{ background: 'var(--color-accent)', boxShadow: '0 0 16px rgba(255, 77, 46, 0.3)' }}
              aria-hidden="true"
            >
              →
            </span>
          );
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              onTouchStart={() => router.prefetch(`/projects/${project.slug}`)}
              onClick={() => {
                const scrollY = window.__lenis ? Math.round(window.__lenis.scroll) : Math.round(window.scrollY);
                safeSessionStorage.setItem('projects-scroll', scrollY.toString());
                safeSessionStorage.setItem('previous-project-url', window.location.pathname);
              }}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="sticky overflow-hidden rounded-3xl block no-underline text-inherit"
              style={{ top: 84 + index * 12, background: 'var(--color-surface-card)', boxShadow: '0 -10px 30px rgba(0,0,0,0.28)' }}
            >
              {featured ? (
                <>
                  <div className="p-3 pb-0">
                    <div className="mc-img-wrap reveal-clip relative overflow-hidden rounded-2xl" style={{ aspectRatio: '16 / 10' }}>
                      <Image
                        src={project.hoverImage || project.images[0]}
                        alt={project.title}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 32px)"
                        className="mc-img object-cover object-top"
                        style={{ filter: 'brightness(0.94)' }}
                      />
                      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)', borderRadius: 16 }} />
                      <span className="mc-num absolute left-3 top-3 font-mono text-[11px] tracking-widest px-2.5 py-1 rounded-full bg-black/60 text-white/90 backdrop-blur-sm">
                        {num}
                      </span>
                    </div>
                  </div>
                  <div className="px-5 pt-4 pb-5 text-left">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="mc-title font-semibold leading-[1.05] text-white" style={{ fontSize: 'clamp(1.3rem, 5.5vw, 1.9rem)', letterSpacing: '-0.025em' }}>
                        {project.title}
                      </h3>
                      {arrow}
                    </div>
                    <p className="mc-desc text-[13.5px] leading-relaxed text-white/65 line-clamp-3 mb-3">{project.description}</p>
                    {tags}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3.5 p-3">
                  <div className="mc-img-wrap reveal-clip relative shrink-0 overflow-hidden rounded-xl" style={{ width: 104, height: 78 }}>
                    <Image
                      src={project.hoverImage || project.images[0]}
                      alt={project.title}
                      fill
                      sizes="104px"
                      className="mc-img object-cover object-top"
                      style={{ filter: 'brightness(0.94)' }}
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)', borderRadius: 12 }} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="mc-num block font-mono text-[11px] tracking-widest text-white/55 mb-1">{num}</span>
                    <h3 className="mc-title font-semibold leading-[1.1] text-white mb-2" style={{ fontSize: 'clamp(1.05rem, 4.6vw, 1.3rem)', letterSpacing: '-0.02em' }}>
                      {project.title}
                    </h3>
                    {tags}
                  </div>
                  {arrow}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const projects = getAllProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderReelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(-1);
  const reduced = useReducedMotion();

  const {
    setFloatingRef,
    setInnerRef,
    setImageContainerRef,
    show,
    hide,
    forceHide,
    mouse,
  } = useHoverPreview(containerRef);

  useGSAP(
    () => {
      if (projects.length === 0 || reduced) return;
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
    { scope: containerRef, dependencies: [projects, reduced] },
  );

  const activateRow = useCallback(
    (index: number, clientX?: number, clientY?: number) => {
      if (
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches)
      )
        return;
      if (!containerRef.current) return;

      if (activeIndexRef.current === index) {
        show(clientX, clientY);
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

      show(clientX, clientY);
    },
    [projects, router, show],
  );

  const deactivateAll = useCallback(
    (immediate = false) => {
      activeIndexRef.current = -1;
      if (containerRef.current) {
        const lines = containerRef.current.querySelectorAll('.hover-line-ref');
        lines.forEach((line) => gsap.to(line, { width: '0%', duration: 0.25, ease: 'power2.out', overwrite: 'auto' }));
        const overlays = containerRef.current.querySelectorAll('.title-reveal-overlay');
        overlays.forEach((ov) => {
          (ov as HTMLElement).style.clipPath = 'inset(0 100% 0 0)';
        });
      }
      if (immediate) {
        forceHide();
      } else {
        hide();
      }
    },
    [hide, forceHide],
  );

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
      const isContainerOutOfView = containerRect.bottom <= 0 || containerRect.top >= window.innerHeight;
      if (
        isContainerOutOfView ||
        my < containerRect.top ||
        my > containerRect.bottom ||
        mx < containerRect.left ||
        mx > containerRect.right
      ) {
        if (activeIndexRef.current !== -1 || isContainerOutOfView) {
          deactivateAll(isContainerOutOfView);
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
        activateRow(foundIndex, mx, my);
      } else if (activeIndexRef.current !== -1) {
        deactivateAll();
      }
    };

    const handleWindowLeave = () => {
      deactivateAll(true);
    };

    window.addEventListener('scroll', handleCheckScroll, { passive: true });
    window.addEventListener('mouseleave', handleWindowLeave);
    window.addEventListener('blur', handleWindowLeave);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', handleCheckScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleCheckScroll);
      window.removeEventListener('mouseleave', handleWindowLeave);
      window.removeEventListener('blur', handleWindowLeave);
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
    gsap.to(row, { backgroundColor: 'rgba(255, 77, 46, 0.08)', duration: 0.15, ease: 'power2.out' });
    const scrollY = window.__lenis
      ? Math.round(window.__lenis.scroll)
      : Math.round(window.scrollY);
    safeSessionStorage.setItem('projects-scroll', scrollY.toString());
    safeSessionStorage.setItem('previous-project-url', window.location.pathname);
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      onMouseLeave={handleTableMouseLeave}
      className="relative w-full bg-cream text-charcoal overflow-clip"
    >
      <div className="hidden md:block pt-16 pb-20 md:pt-20 md:pb-24 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <AnimatedHeading
            words={[{ t: 'Things' }, { t: "I've" }, { t: 'shipped', serif: true }]}
            className="text-[clamp(2.5rem,7vw,6.5rem)] leading-none text-charcoal"
            accentClassName="text-accent-deep"
          />
        </div>
        <hr className="border-t border-border w-full mb-4" />

        <div className="flex flex-col w-full" onMouseLeave={handleTableMouseLeave}>
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="project-row-desktop relative flex items-stretch border-b border-border py-8 min-h-[120px] group cursor-pointer no-underline"
              onMouseEnter={(e) => {
                mouse.current.x = e.clientX;
                mouse.current.y = e.clientY;
                activateRow(index, e.clientX, e.clientY);
              }}
              data-cursor="view"
              onClick={handleRowClick}
            >
              <div className="flex-[0_0_80px] font-mono text-[13px] text-warm pt-2 relative h-6 overflow-hidden">
                <span className="block absolute transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block absolute translate-y-full opacity-0 text-accent-deep transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  →
                </span>
              </div>

              <div className="flex-1 pr-8">
                <h3 className="relative text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] overflow-hidden">
                  <span className="block text-charcoal select-none">{project.title}</span>
                  <span
                    aria-hidden="true"
                    className="title-reveal-overlay block text-accent-deep absolute inset-0 select-none"
                    style={{
                      clipPath: 'inset(0 100% 0 0)',
                      transition: 'clip-path 0.5s cubic-bezier(0.76,0,0.24,1)',
                    }}
                  >
                    {project.title}
                  </span>
                </h3>

                <div className="mt-3 flex flex-wrap gap-2 opacity-0 translate-y-2 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  {project.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-transparent border border-gray-300 text-warm text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-[0_0_200px] text-right flex justify-end items-start pt-[clamp(0.5rem,1.4vw,1.25rem)]">
                <span className="font-mono text-xs uppercase tracking-widest text-charcoal group-hover:text-accent-deep transition-colors duration-250 flex items-center gap-1">
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
            willChange: 'transform, opacity',
          }}
        >
          <div
            ref={setInnerRef}
            className="w-[420px] xl:w-[460px] rounded-2xl overflow-hidden shadow-2xl bg-surface-mid"
            style={{
              aspectRatio: '16 / 10',
              willChange: 'transform',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 10px 20px -8px rgba(0, 0, 0, 0.22)',
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
                      className="w-full h-full absolute inset-0 overflow-hidden"
                      style={{ top: `${idx * 100}%` }}
                    >
                      <Image
                        src={imgUrl}
                        alt={project.title}
                        fill
                        sizes="480px"
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
