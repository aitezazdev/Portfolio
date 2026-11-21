'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Link } from 'next-transition-router';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { EASE } from '@/lib/motion';
import { FaArrowUp, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '@/lib/projects';
import { getAdjacentProjects } from '@/lib/projects';
import { site } from '@/lib/site';

export default function ProjectDetails({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { prev, next } = getAdjacentProjects(project.slug);

  useGSAP(
    () => {
      if (!titleRef.current) return;

      const split = SplitText.create(titleRef.current.querySelector('.pd-title-text'), {
        type: 'lines',
        mask: 'lines',
      });
      gsap.fromTo(
        split.lines,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1,
          ease: EASE.outQuart,
          stagger: 0.08,
          delay: 0.15,
        }
      );

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [project.slug] }
  );

  const scrollToTop = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section ref={rootRef} className="min-h-screen bg-surface-base text-white px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 md:py-20 relative overflow-x-clip">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 md:mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 text-muted hover:text-white transition-colors duration-200 group"
          >
            <span className="text-base sm:text-lg transform group-hover:-translate-x-1 transition-transform duration-200">
              ←
            </span>
            <span className="font-mono text-xs uppercase tracking-widest">Back to Projects</span>
          </Link>
        </div>

        <header className="mb-8 sm:mb-12 md:mb-16">
          <h1
            ref={titleRef}
            aria-label={project.title}
            className="font-display font-semibold tracking-[-0.045em] leading-[0.98] sm:leading-[1.02] text-[clamp(2.25rem,6.5vw,5.5rem)] mb-6 sm:mb-8"
          >
            <span aria-hidden="true" className="pd-title-text block">
              {project.title}
            </span>
          </h1>

          <p className="max-w-3xl font-sans text-base sm:text-lg md:text-xl leading-relaxed text-light/75 mb-8 sm:mb-10">
            {project.description}
          </p>

          {(project.liveUrl || project.github) && (
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {project.liveUrl && (
                <AnimatedButton
                  as="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  topText={
                    <span className="flex items-center gap-2">
                      <span>LIVE</span>
                      <FaExternalLinkAlt className="text-[11px]" />
                    </span>
                  }
                  bottomText={
                    <span className="flex items-center gap-2">
                      <span>DEMO ↗</span>
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
                      <span>CODE</span>
                    </span>
                  }
                  bottomText={
                    <span className="flex items-center gap-2">
                      <FaGithub className="text-sm" />
                      <span>GITHUB ↗</span>
                    </span>
                  }
                  variant="dark"
                  className="!border !border-white/15 hover:!border-white/40"
                />
              )}
            </div>
          )}
        </header>

        {project.images && project.images.length > 0 && (
          <div className="mb-10 sm:mb-14 md:mb-20">
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-x-3 sm:-inset-x-6 -inset-y-8 sm:-inset-y-10 -z-10 rounded-[3rem] bg-accent/20 blur-3xl opacity-60" />
              <div className="rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden border border-white/10 bg-surface-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-float border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 flex-1 max-w-xs truncate rounded-full bg-black/30 px-3 py-1 text-center font-mono text-[11px] text-muted">{project.liveUrl ? new URL(project.liveUrl).host : project.title}</span>
                </div>
                <div className="relative w-full aspect-[1919/923] overflow-hidden">
                  <Image
                    src={project.images[0]}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 md:gap-8 mb-8 sm:mb-12 md:mb-20">
          <div className="md:col-span-10">
            <ScrollWordReveal
              text={project.overview}
              offset={['start 0.98', 'end 0.85']}
              className="text-base sm:text-lg md:text-2xl text-light font-sans leading-relaxed"
            />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 md:gap-8 mb-8 sm:mb-12 md:mb-20">
          <div className="md:col-span-10">
            <ScrollWordReveal
              text={project.architecture}
              offset={['start 0.98', 'end 0.88']}
              className="text-sm sm:text-base md:text-lg text-light/80 font-sans leading-relaxed"
            />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-3 md:gap-8 mb-10 sm:mb-14 md:mb-20">
          <div className="md:col-span-10">
            <ScrollWordReveal
              text={project.implementation}
              offset={['start 0.98', 'end 0.88']}
              className="text-sm sm:text-base md:text-lg text-light/80 font-sans leading-relaxed"
            />
          </div>
        </div>

        <div className="mb-12 sm:mb-16 md:mb-24">
          <AnimatedHeading
            words={[{ t: 'What' }, { t: 'I', serif: false }, { t: 'built', serif: true }]}
            showLine={false}
            containerClassName="mb-6 sm:mb-10"
            className="text-[clamp(1.75rem,4.5vw,3.4rem)] text-white"
          />
          <ul className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {project.myRole.map((role, i) => (
              <li key={i} className="py-3.5 sm:py-5 flex items-baseline gap-3 sm:gap-5 group">
                <span aria-hidden="true" className="text-accent text-[9px] shrink-0 w-6 sm:w-8">
                  ◆
                </span>
                <ScrollWordReveal
                  text={role}
                  offset={['start 0.99', 'end 0.92']}
                  className="text-sm sm:text-base text-light/80 font-sans leading-relaxed flex-1 group-hover:text-light transition-colors duration-300"
                />
              </li>
            ))}
          </ul>
        </div>

        {project.images && project.images.length > 1 && (
          <div className="flex flex-col gap-6 sm:gap-10 md:gap-16 mb-14 sm:mb-18 md:mb-28">
            <div className="mb-1">
              <p className="font-mono text-xs uppercase tracking-widest text-warm-light">Gallery</p>
            </div>
            {project.images.slice(1).map((img, i) => {
              const actualIdx = i + 1;
              const wide = actualIdx % 3 === 0;
              return (
                <figure
                  key={`${project.slug}-img-${actualIdx}`}
                  className={`relative ${wide ? 'w-full' : 'w-full md:w-10/12'} ${
                    actualIdx % 3 === 1 ? 'md:ml-auto' : ''
                  }`}
                >
                  <div className="overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] border border-white/10 bg-surface-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]">
                    <div className="relative w-full aspect-[1919/923]">
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${actualIdx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1000px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-2.5 flex items-center justify-between font-mono text-[11px] sm:text-[11px] uppercase tracking-widest text-muted">
                    <span>{project.title}</span>
                    <span>
                      {String(actualIdx + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}

        <div className="mb-12 sm:mb-16 md:mb-20">
          <p className="font-mono text-xs uppercase tracking-widest text-warm-light mb-3 sm:mb-5">Built with</p>
          <div className="flex flex-wrap gap-2">
            {project.tech?.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-surface-mid border border-white/[0.08] text-cream"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="Project navigation" className="grid grid-cols-1 md:grid-cols-2 border-t border-white/[0.08] mb-12 sm:mb-16">
          {prev && (
            <Link
              href={`/projects/${prev.slug}`}
              className="group py-6 sm:py-10 md:py-14 md:pr-10 border-b md:border-b-0 md:border-r border-white/[0.08] no-underline"
            >
              <p className="font-mono text-[11px] sm:text-[11px] uppercase tracking-widest text-muted mb-2 sm:mb-3 flex items-center gap-2">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1.5">←</span>
                Previous
              </p>
              <p className="font-display font-semibold tracking-[-0.035em] leading-[1.05] text-[clamp(1.4rem,3.5vw,2.8rem)] text-light/60 group-hover:text-accent transition-colors duration-400">
                {prev.title}
              </p>
            </Link>
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className={`group py-6 sm:py-10 md:py-14 md:pl-10 no-underline text-right items-end ${
                prev ? '' : 'md:col-span-2'
              }`}
            >
              <p className="font-mono text-[11px] sm:text-[11px] uppercase tracking-widest text-muted mb-2 sm:mb-3 flex items-center justify-end gap-2">
                Next
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </p>
              <p className="font-display font-semibold tracking-[-0.035em] leading-[1.05] text-[clamp(1.4rem,3.5vw,2.8rem)] text-light/60 group-hover:text-accent transition-colors duration-400">
                {next.title}
              </p>
            </Link>
          )}
        </nav>

        <div className="relative flex flex-col items-center gap-6 py-6 sm:py-8">
          <div className="text-center flex flex-col items-center">
            <ScrollWordReveal
              text="Have a project in mind?"
              offset={['start 0.98', 'end 0.88']}
              className="text-muted text-base sm:text-lg justify-center mb-1"
            />
            <a
              href={`mailto:${site.email}`}
              className="inline-block py-2 text-lg sm:text-xl font-semibold text-muted hover:text-cream transition-colors"
            >
              {site.email}
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
