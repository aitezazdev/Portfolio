'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedLink from '@/components/ui/AnimateLink';
import { FaArrowUp, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function ProjectDetails({ project }) {
  const [backUrl, setBackUrl] = useState('/');
  const detailsRef = useRef(null);
  const revealedRef = useRef(new Set());
  useEffect(() => {
    const previousUrl = sessionStorage.getItem('previous-project-url');
    if (previousUrl) {
      setBackUrl(previousUrl);
    }
  }, []);
  useEffect(() => {
    if (!detailsRef.current) return;
    const allContainers = detailsRef.current.querySelectorAll('.image-reveal-container');
    const allImgs = detailsRef.current.querySelectorAll('.image-reveal-container img');
    gsap.set(allContainers, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
    });
    gsap.set(allImgs, {
      scale: 1.15,
    });
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars?.id?.startsWith?.('img-reveal-')) {
        st.kill();
      }
    });
    return () => {
      revealedRef.current.clear();
    };
  }, [project.slug]);
  useGSAP(
    () => {
      if (!detailsRef.current) return;
      gsap.fromTo(
        detailsRef.current.querySelectorAll('.fade-up-item'),
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        },
      );
      const containers = detailsRef.current.querySelectorAll('.image-reveal-container');
      containers.forEach((container, idx) => {
        const img = container.querySelector('img');
        const rect = container.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight * 0.9;
        if (alreadyVisible) {
          gsap.to(container, {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1.2,
            ease: 'power4.inOut',
          });
          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: 1.6,
              ease: 'power3.out',
            });
          }
          revealedRef.current.add(idx);
        } else {
          gsap.fromTo(
            container,
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            },
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 1.2,
              ease: 'power4.inOut',
              scrollTrigger: {
                id: `img-reveal-${idx}`,
                trigger: container,
                start: 'top 85%',
                once: true,
                onEnter: () => revealedRef.current.add(idx),
              },
            },
          );
          if (img) {
            gsap.fromTo(
              img,
              {
                scale: 1.15,
              },
              {
                scale: 1,
                duration: 1.6,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: container,
                  start: 'top 85%',
                  once: true,
                },
              },
            );
          }
        }
      });
      const fallbackTimer = setTimeout(() => {
        if (!detailsRef.current) return;
        const clipped = detailsRef.current.querySelectorAll('.image-reveal-container');
        clipped.forEach((c, idx) => {
          if (!revealedRef.current.has(idx)) {
            gsap.to(c, {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 0.6,
              ease: 'power2.out',
            });
            const i = c.querySelector('img');
            if (i)
              gsap.to(i, {
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
              });
            revealedRef.current.add(idx);
          }
        });
      }, 2000);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
      return () => clearTimeout(fallbackTimer);
    },
    {
      scope: detailsRef,
      dependencies: [project.slug],
    },
  );
  const scrollToTop = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  return (
    <section ref={detailsRef} className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10">
      <div className="fade-up-item">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-3 text-[#a29e9a] hover:text-white transition-all duration-300 group mb-12"
        >
          <span className="text-2xl transform group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          <span className="text-lg font-medium">Back</span>
        </Link>
      </div>

      <div className="mb-6 fade-up-item">
        <div className="flex items-start justify-between gap-6 mb-6 md:mb-0">
          <AnimatedHeading
            text={project.title}
            className="text-5xl md:text-7xl font-extrabold flex-1"
          />

          <div className="hidden md:flex gap-4 pt-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                aria-label="GitHub Repository"
              >
                <FaGithub className="text-2xl" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                aria-label="Live Demo"
              >
                <FaExternalLinkAlt className="text-xl" />
              </a>
            )}
          </div>
        </div>

        <div className="flex md:hidden gap-4 mt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
              aria-label="GitHub Repository"
            >
              <FaGithub className="text-xl" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
              aria-label="Live Demo"
            >
              <FaExternalLinkAlt className="text-lg" />
            </a>
          )}
        </div>
      </div>

      <div className="mb-8 mt-4 fade-up-item">
        <strong className="text-xl font-bold block mb-1">Tech Stack</strong>
        <AnimateDescription
          text={project.tech?.join(', ')}
          className="text-base sm:text-lg text-[#a29e9a] font-sans"
        />
      </div>

      <div className="mb-8 fade-up-item">
        <strong className="text-xl font-bold block mb-1">Description</strong>
        <AnimateDescription
          text={project.description}
          className="text-base sm:text-lg text-[#a29e9a] font-sans"
        />
      </div>

      {project.myRole?.length > 0 && (
        <div className="mb-14 fade-up-item">
          <strong className="text-xl font-bold block mb-1">My Role</strong>
          <ul className="list-disc list-inside text-[#a29e9a] font-sans mt-2 space-y-2">
            {project.myRole.map((role, i) => (
              <li key={i} className="text-base sm:text-lg">
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-12 mb-16">
        {project.images?.map((img, i) => (
          <div
            key={`${project.slug}-img-${i}`}
            className="image-reveal-container overflow-hidden rounded-xl bg-[#1a1a18] relative aspect-[16/10] max-h-[750px] w-full"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            }}
          >
            <a
              href={img}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative"
            >
              <Image
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                priority={i === 0}
                className="object-cover object-top w-full h-full transition-transform duration-500 hover:scale-[1.03]"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMTkxNyIvPjwvc3ZnPg=="
                onError={(e) => {
                  const container = e.target.closest('.image-reveal-container');
                  if (container) {
                    gsap.set(container, {
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    });
                  }
                  e.target.style.opacity = '0';
                }}
              />
            </a>
            <div
              className="absolute inset-0 flex items-center justify-center bg-[#111110] pointer-events-none"
              aria-hidden="true"
              style={{
                zIndex: -1,
              }}
            >
              <span className="text-[#2a2a28] font-mono text-xs tracking-widest uppercase">
                Image unavailable
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex justify-center py-8 fade-up-item">
        <div className="text-center">
          <p className="text-[#a29e9a] text-lg">Have a project in mind?</p>
          <a
            href="mailto:aitezazsikandar@gmail.com"
            className="text-xl font-semibold text-[#bab6b3] hover:text-[#d4d2d0] transition"
          >
            aitezazsikandar@gmail.com
          </a>
        </div>

        <button
          onClick={scrollToTop}
          className="absolute right-0 w-10 h-10 rounded-full bg-[#6b645c] shadow flex items-center justify-center hover:bg-[#534e47] transition"
        >
          <AnimatedLink>
            <FaArrowUp className="w-4 h-4 text-[#e8e8e3]" />
          </AnimatedLink>
        </button>
      </div>
    </section>
  );
}
