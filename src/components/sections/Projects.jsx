'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import { getAllProjects } from '@/lib/projects';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const useHoverPreview = (containerRef, onScrollLeave) => {
  const floatingRef = useRef(null);
  const innerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const rotateTo = useRef(null);
  const imgXTo = useRef(null);
  const imgYTo = useRef(null);
  const mouse = useRef({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
  });
  const delayedMouse = useRef({
    x: 0,
    y: 0,
  });
  const isHovering = useRef(false);
  const rafId = useRef(null);
  const dynamics = useRef({
    velocityX: 0,
    velocityY: 0,
    currentRotation: 0,
    targetRotation: 0,
  });
  const setFloatingRef = useCallback((el) => {
    floatingRef.current = el;
    if (!el) return;
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.6,
      opacity: 0,
      rotation: 0,
      transformOrigin: 'center center',
      clipPath: 'circle(0% at 50% 50%)',
    });
    rotateTo.current = gsap.quickTo(el, 'rotation', {
      duration: 0.4,
      ease: 'power3',
    });
  }, []);
  const setInnerRef = useCallback((el) => {
    innerRef.current = el;
  }, []);
  const setImageContainerRef = useCallback((el) => {
    imageContainerRef.current = el;
    if (!el) return;
    imgXTo.current = gsap.quickTo(el, 'x', {
      duration: 0.2,
      ease: 'power2',
    });
    imgYTo.current = gsap.quickTo(el, 'y', {
      duration: 0.2,
      ease: 'power2',
    });
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
          const px = gsap.utils.clamp(-maxParallax, maxParallax, -d.velocityX * 1.2);
          const py = gsap.utils.clamp(-maxParallax, maxParallax, -d.velocityY * 1.2);
          imgXTo.current(px);
          imgYTo.current(py);
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
    const handleMouseMove = (e) => {
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
    gsap.set(floatingRef.current, {
      x: mouse.current.x,
      y: mouse.current.y,
    });
    dynamics.current.currentRotation = 0;
    dynamics.current.targetRotation = 0;
    if (rotateTo.current) rotateTo.current(0);
    gsap.to(floatingRef.current, {
      clipPath: 'circle(75% at 50% 50%)',
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power4.out',
      overwrite: 'auto',
    });
  }, []);
  const hide = useCallback(() => {
    isHovering.current = false;
    if (!floatingRef.current) return;
    gsap.to(floatingRef.current, {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
      scale: 0.6,
      duration: 0.4,
      ease: 'power3.in',
      overwrite: 'auto',
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
          if (onScrollLeave) onScrollLeave();
          return;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, onScrollLeave, hide]);
  return {
    setFloatingRef,
    setInnerRef,
    setImageContainerRef,
    show,
    hide,
    isHovering,
  };
};
export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [hoveredImage, setHoveredImage] = useState('');
  const lastHoveredImgRef = useRef('');
  const handleScrollLeave = useCallback(() => {
    if (!containerRef.current) return;
    const lines = containerRef.current.querySelectorAll('.hover-line-ref');
    lines.forEach((line) =>
      gsap.to(line, {
        width: '0%',
        duration: 0.3,
        ease: 'power2.out',
      }),
    );
    const overlays = containerRef.current.querySelectorAll('.title-reveal-overlay');
    overlays.forEach((ov) => {
      ov.style.clipPath = 'inset(0 100% 0 0)';
    });
    lastHoveredImgRef.current = '';
  }, []);
  const { setFloatingRef, setInnerRef, setImageContainerRef, show, hide, isHovering } =
    useHoverPreview(containerRef, handleScrollLeave);
  useEffect(() => {
    const data = getAllProjects();
    setProjects(data);
    const criticalImages = data.slice(0, 4).map((project) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = project.hoverImage || project.images[0];
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    Promise.all(criticalImages).then(() => {
      setIsLoading(false);
    });
  }, []);
  useGSAP(
    () => {
      if (isLoading || projects.length === 0) return;
      const rows = containerRef.current.querySelectorAll('.project-row-desktop');
      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight * 0.95;
        if (alreadyVisible) {
          gsap.fromTo(
            row,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: index * 0.08,
              ease: 'power3.out',
            },
          );
        } else {
          gsap.fromTo(
            row,
            {
              y: 40,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 92%',
                once: true,
              },
            },
          );
        }
      });
      const cards = containerRef.current.querySelectorAll('.project-card-mobile');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: (index % 2) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
          },
        );
      });
    },
    {
      scope: containerRef,
      dependencies: [isLoading, projects],
    },
  );
  const handleRowMouseEnter = (e, imageUrl, index) => {
    router.prefetch(`/projects/${projects[index]?.slug || ''}`);
    const line = e.currentTarget.querySelector('.hover-line-ref');
    if (line) {
      gsap.to(line, {
        width: '100%',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
    const titleOverlay = e.currentTarget.querySelector('.title-reveal-overlay');
    if (titleOverlay) {
      titleOverlay.style.clipPath = 'inset(0 0% 0 0)';
    }
    const isNewImage = lastHoveredImgRef.current !== imageUrl;
    lastHoveredImgRef.current = imageUrl;
    if (isNewImage && isHovering.current) {
      const floatingEl = document.querySelector('.floating-preview-ref');
      if (floatingEl) {
        gsap.to(floatingEl, {
          scale: 0.92,
          clipPath: 'circle(40% at 50% 50%)',
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            setHoveredImage(imageUrl);
            gsap.to(floatingEl, {
              scale: 1,
              clipPath: 'circle(75% at 50% 50%)',
              duration: 0.35,
              ease: 'power3.out',
            });
          },
        });
      }
    } else {
      setHoveredImage(imageUrl);
      show();
    }
  };
  const handleRowMouseLeave = (e) => {
    const line = e.currentTarget.querySelector('.hover-line-ref');
    if (line) {
      gsap.to(line, {
        width: '0%',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
    const titleOverlay = e.currentTarget.querySelector('.title-reveal-overlay');
    if (titleOverlay) {
      titleOverlay.style.clipPath = 'inset(0 100% 0 0)';
    }
    hide();
  };
  const handleRowClick = (e, slug) => {
    const row = e.currentTarget;
    const line = row.querySelector('.hover-line-ref');
    if (line) {
      gsap.to(line, {
        width: '100%',
        duration: 0.15,
        ease: 'power2.out',
      });
    }
    gsap.to(row, {
      backgroundColor: 'rgba(16, 185, 129, 0.04)',
      duration: 0.15,
      ease: 'power2.out',
    });
    const scrollY = window.__lenis ? Math.round(window.__lenis.scroll) : Math.round(window.scrollY);
    sessionStorage.setItem('projects-scroll', scrollY.toString());
    sessionStorage.setItem('previous-project-url', window.location.pathname);
  };
  if (isLoading) {
    return (
      <section
        id="projects"
        className="relative min-h-screen w-full bg-[#e8e8e3] text-[#1a1a1a] overflow-hidden px-12 py-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="h-20 bg-gray-300 rounded animate-pulse w-1/3 mb-10" />
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-8 border-b border-gray-300 flex animate-pulse">
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
      className="relative min-h-screen w-full bg-[#e8e8e3] text-[#1a1a1a] overflow-hidden"
    >
      <div className="hidden md:block px-12 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <AnimatedHeading
            text="PROJECTS"
            className="text-[clamp(4rem,8vw,8rem)] font-black leading-none uppercase text-[#1a1a1a]"
          />
        </div>
        <hr className="border-t border-[#d0d0c8] w-full mb-4" />

        <div className="flex flex-col w-full">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="project-row-desktop relative flex items-stretch border-b border-[#d0d0c8] py-8 min-h-[120px] group cursor-pointer no-underline"
              onMouseEnter={(e) =>
                handleRowMouseEnter(e, project.hoverImage || project.images[0], index)
              }
              onMouseLeave={handleRowMouseLeave}
              data-cursor="view"
              onClick={(e) => handleRowClick(e, project.slug)}
            >
              <div className="flex-[0_0_80px] font-mono text-[13px] text-[#9a9a90] pt-2 relative h-6 overflow-hidden">
                <span className="block absolute transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block absolute translate-y-full opacity-0 text-[#10b981] transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  →
                </span>
              </div>

              <div className="flex-1 pr-8">
                <h3 className="relative text-[clamp(2rem,4vw,3.5rem)] font-extrabold uppercase leading-none tracking-tight overflow-hidden">
                  <span className="block text-[#1a1a1a] select-none">{project.title}</span>

                  <span
                    className="title-reveal-overlay block text-[#10b981] absolute inset-0 select-none"
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
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-transparent border border-[#c0c0b8] text-[#6b645c] text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="font-mono text-xs text-[#9a9a90] mt-2">{project.year}</div>
              </div>

              <div className="flex-[0_0_200px] text-right flex flex-col justify-end items-end pb-2">
                <span
                  className="font-mono text-xs uppercase tracking-widest text-[#1a1a1a] 
                               group-hover:text-[#10b981] transition-colors duration-250 
                               flex items-center gap-1"
                >
                  <span>View Project</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] bg-[#10b981] w-0 hover-line-ref pointer-events-none" />
            </Link>
          ))}
        </div>

        <div
          ref={setFloatingRef}
          className="floating-preview-ref fixed pointer-events-none z-[100] opacity-0"
          style={{
            top: 0,
            left: 0,
            willChange: 'transform, clip-path, opacity',
            clipPath: 'circle(0% at 50% 50%)',
          }}
        >
          <div
            ref={setInnerRef}
            className="w-[420px] aspect-[16/10] rounded-2xl overflow-hidden"
            style={{
              willChange: 'transform',
              boxShadow:
                '0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 8px 20px -8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              ref={setImageContainerRef}
              className="w-full h-full relative"
              style={{
                willChange: 'transform',
                transform: 'scale(1.12)',
              }}
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
                }}
              />
              {hoveredImage && (
                <Image
                  src={hoveredImage}
                  alt="Project Preview"
                  fill
                  sizes="420px"
                  priority={false}
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden px-6 sm:px-8 py-10">
        <h2 className="text-4xl font-black uppercase mb-6 mt-16 text-[#1a1a1a]">Projects</h2>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 p-0">
          {projects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id}
              data-cursor="view"
              className="project-card-mobile bg-white rounded-2xl overflow-hidden border border-[#e0e0d8] relative cursor-pointer block"
              onMouseEnter={() => router.prefetch(`/projects/${project.slug}`)}
              onFocus={() => router.prefetch(`/projects/${project.slug}`)}
              onClick={() => {
                const scrollY = window.__lenis
                  ? Math.round(window.__lenis.scroll)
                  : Math.round(window.scrollY);
                sessionStorage.setItem('projects-scroll', scrollY.toString());
                sessionStorage.setItem('previous-project-url', window.location.pathname);
              }}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={project.hoverImage || project.images[0]}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={index < 2}
                  className="object-cover object-top w-full h-full"
                />
              </div>

              <div className="p-4">
                <div className="font-mono text-xs text-[#9a9a90] mb-1">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-bold text-base text-[#1a1a1a] leading-tight mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#f0f0eb] text-[#6b645c] text-xs px-2 py-0.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-sm">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
