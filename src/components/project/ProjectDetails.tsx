'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
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
          className="inline-flex items-center gap-3 text-muted hover:text-white transition-all duration-300 group mb-12"
        >
          <span className="text-lg md:text-2xl transform group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          <span className="text-sm md:text-lg font-medium">Back</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-6 mb-6 md:mb-0">
          <AnimatedHeading
            text={project.title}
            className="text-[clamp(2.2rem,6vw,4.5rem)] font-black tracking-tight leading-none uppercase flex-1 text-white"
          />
          <div className="hidden md:flex gap-4 pt-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
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
                className="w-14 h-14 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
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
              className="w-12 h-12 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
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
              className="w-12 h-12 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
              aria-label="Live Demo"
            >
              <FaExternalLinkAlt className="text-lg" />
            </a>
          )}
        </div>
      </div>

      <div className="mb-6 mt-4">
        <strong className="text-sm sm:text-base md:text-xl font-bold block mb-1">Tech Stack</strong>
        <AnimateDescription
          text={project.tech?.join(', ')}
          className="text-sm sm:text-base md:text-lg text-muted font-sans"
        />
      </div>

      <div className="mb-6">
        <strong className="text-sm sm:text-base md:text-xl font-bold block mb-1">Description</strong>
        <AnimateDescription
          text={project.description}
          className="text-sm sm:text-base md:text-lg text-muted font-sans"
        />
      </div>

      {project.myRole?.length > 0 && (
        <div className="mb-10">
          <strong className="text-sm sm:text-base md:text-xl font-bold block mb-1">My Role</strong>
          <ul className="list-disc list-inside text-muted font-sans mt-2 space-y-2">
            {project.myRole.map((role, i) => (
              <li key={i} className="text-sm sm:text-base md:text-lg">
                {role}
              </li>
            ))}
          </ul>
        </div>
      )}

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
