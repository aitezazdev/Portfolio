'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { FaArrowUp, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '@/lib/projects';

export default function ProjectDetails({ project }: { project: Project }) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const scrollToTop = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="min-h-screen bg-[#080807] text-white px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-muted hover:text-white transition-all duration-300 group mb-8 md:mb-12"
        >
          <span className="text-base md:text-xl transform group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          <span className="font-mono text-xs md:text-sm uppercase tracking-widest">Back to Projects</span>
        </Link>
      </div>

      <div className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="flex-1 w-full text-center md:text-left">
            <AnimatedHeading
              text={project.title}
              className="text-[clamp(1.75rem,5vw,3.8rem)] font-black tracking-tight leading-[1.15] uppercase text-white text-center md:text-left"
              containerClassName="mb-0 text-center md:text-left"
              showLine={false}
            />
          </div>

          {(project.liveUrl || project.github) && (
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-4 pt-2 md:pt-0 w-full md:w-auto">
              {project.liveUrl && (
                <AnimatedButton
                  as="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  topText={
                    <span className="flex items-center gap-2">
                      <span>LIVE DEMO</span>
                      <FaExternalLinkAlt className="text-[11px]" />
                    </span>
                  }
                  bottomText={
                    <span className="flex items-center gap-2">
                      <span>EXPLORE SITE</span>
                      <span className="text-xs">↗</span>
                    </span>
                  }
                  variant="primary"
                />
              )}
              {project.github && (
                <AnimatedButton
                  as="a"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  topText={
                    <span className="flex items-center gap-2">
                      <FaGithub className="text-sm" />
                      <span>SOURCE CODE</span>
                    </span>
                  }
                  bottomText={
                    <span className="flex items-center gap-2">
                      <FaGithub className="text-sm" />
                      <span>VIEW GITHUB ↗</span>
                    </span>
                  }
                  variant="dark"
                  className="!border !border-white/15 hover:!border-white/40"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-4 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-warm block mb-3">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tech?.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-surface-mid border border-white/[0.08] text-cream"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-warm block mb-2">
              Description
            </span>
            <ScrollWordReveal
              text={project.description}
              offset={['start 0.95', 'end 0.7']}
              className="text-sm sm:text-base md:text-lg text-light/80 font-sans leading-relaxed"
            />
          </div>

          {project.myRole?.length > 0 && (
            <div className="pt-4">
              <span className="font-mono text-xs uppercase tracking-widest text-warm block mb-3">
                Key Contributions & Role
              </span>
              <ul className="space-y-2.5">
                {project.myRole.map((role, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm sm:text-base text-light/80 font-sans leading-relaxed"
                  >
                    <span className="text-accent mt-1 text-xs">◆</span>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-12 mb-16">
        {project.images?.map((img, i) => {
          const isLoaded = loadedImages[i];
          return (
            <div
              key={`${project.slug}-img-${i}`}
              className="overflow-hidden rounded-xl bg-[#121211] border border-[#1f1f1d] relative aspect-[16/10] max-h-[750px] w-full"
            >
              {!isLoaded && (
                <div className="absolute inset-0 bg-[#121211] flex flex-col items-center justify-center gap-3 z-0 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-[#C45D3E] shadow-[0_0_12px_rgba(196,93,62,0.6)]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white/30">
                    Loading Media...
                  </span>
                </div>
              )}

              <a
                href={img}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative z-10"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={i === 0}
                  onLoad={() => handleImageLoad(i)}
                  className={`object-contain w-full h-full transition-opacity duration-500 ease-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMTkxNyIvPjwvc3ZnPg=="
                />
              </a>
            </div>
          );
        })}
      </div>

      <div className="relative flex justify-center py-8">
        <div className="text-center">
          <p className="text-muted text-lg">Have a project in mind?</p>
          <a
            href="mailto:aitezazsikandar@gmail.com"
            className="text-xl font-semibold text-[#bab6b3] hover:text-[#d4d2d0] transition"
          >
            aitezazsikandar@gmail.com
          </a>
        </div>
        <button
          onClick={scrollToTop}
          className="absolute right-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 group focus:outline-none"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </section>
);
}
