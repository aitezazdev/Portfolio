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

      gsap.fromTo(
        '.pd-meta-item',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE.outCubic, stagger: 0.07, delay: 0.4 }
      );

      gsap.utils.toArray<HTMLElement>('.pd-figure-parallax').forEach((wrap) => {
        const inner = wrap.querySelector('.pd-figure-inner');
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

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
    <section ref={rootRef} className="min-h-screen bg-[#080807] text-white px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-muted hover:text-white transition-all duration-300 group mb-10 md:mb-14"
          >
            <span className="text-base md:text-xl transform group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest">Back to Projects</span>
          </Link>
        </div>

        {/* ---------- Hero ---------- */}
        <header className="mb-16 md:mb-24">
          <h1
            ref={titleRef}
            aria-label={project.title}
            className="font-display font-black uppercase tracking-tight leading-[1.02] text-[clamp(2.4rem,6.5vw,5.5rem)] mb-10"
          >
            <span aria-hidden="true" className="pd-title-text block">
              {project.title}
            </span>
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.08] pt-6">
            <div className="pd-meta-item">
              <p className="font-mono text-[11px] uppercase tracking-widest text-warm mb-1.5">Role</p>
              <p className="text-sm md:text-base font-medium">{project.role}</p>
            </div>
            <div className="pd-meta-item">
              <p className="font-mono text-[11px] uppercase tracking-widest text-warm mb-1.5">Year</p>
              <p className="text-sm md:text-base font-medium">{project.year}</p>
            </div>
            <div className="pd-meta-item">
              <p className="font-mono text-[11px] uppercase tracking-widest text-warm mb-1.5">Type</p>
              <p className="text-sm md:text-base font-medium">{project.type}</p>
            </div>
            <div className="pd-meta-item flex flex-wrap items-start gap-2.5">
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
                      <span>EXPLORE ↗</span>
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
          </div>
        </header>

        {/* ---------- Stats band ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.08] rounded-2xl overflow-hidden mb-20 md:mb-28 border border-white/[0.08]">
          {project.stats.map((stat) => (
            <div key={stat.label} className="bg-[#0d0d0c] px-6 py-8 md:py-10 text-center sm:text-left">
              <p
                className="font-display font-black leading-none mb-2 text-stat"
                style={{ color: project.accent }}
              >
                {stat.value}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Narrative ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-20 md:mb-28">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-warm">(Overview)</p>
          </div>
          <div className="md:col-span-8">
            <ScrollWordReveal
              text={project.overview}
              offset={['start 0.98', 'end 0.85']}
              className="text-lg sm:text-xl md:text-2xl text-light font-sans leading-relaxed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-20 md:mb-28">
          <div className="md:col-span-5 space-y-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">(The Challenge)</p>
              <ScrollWordReveal
                text={project.challenge}
                offset={['start 0.98', 'end 0.88']}
                className="text-sm sm:text-base text-light/70 font-sans leading-relaxed"
              />
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8 space-y-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">(The Solution)</p>
              <ScrollWordReveal
                text={project.solution}
                offset={['start 0.98', 'end 0.88']}
                className="text-sm sm:text-base text-light/70 font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* ---------- Contributions ---------- */}
        <div className="mb-20 md:mb-28">
          <AnimatedHeading
            words={[{ t: 'KEY' }, { t: 'moves', serif: true }]}
            showLine={false}
            containerClassName="mb-10"
            className="text-[clamp(1.9rem,4.5vw,3.4rem)] text-white"
          />
          <ul className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {project.myRole.map((role, i) => (
              <li key={i} className="py-5 flex items-start gap-5 group">
                <span className="font-mono text-xs text-accent mt-1 shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}
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

        {/* ---------- Parallax gallery ---------- */}
        <div className="flex flex-col gap-12 md:gap-16 mb-24 md:mb-32">
          {project.images?.map((img, i) => {
            const wide = i % 3 === 0;
            return (
              <figure
                key={`${project.slug}-img-${i}`}
                className={`relative ${wide ? 'w-full' : 'w-full md:w-10/12'} ${
                  i % 3 === 1 ? 'md:ml-auto' : ''
                }`}
              >
                <div
                  className={`overflow-hidden rounded-xl bg-[#121211] border border-[#1f1f1d] relative aspect-[21/9] ${
                    wide ? 'max-h-[500px]' : 'max-h-[420px]'
                  } w-full`}
                >
                  <div className="pd-figure-parallax absolute inset-0 overflow-hidden">
                    <div className="pd-figure-inner absolute inset-x-0 -top-[8%] h-[116%]" style={{ willChange: 'transform' }}>
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1100px"
                        priority={i === 0}
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
                  <span>{project.title}</span>
                  <span>
                    {String(i + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* ---------- Tech stack chips ---------- */}
        <div className="mb-24 md:mb-32">
          <p className="font-mono text-xs uppercase tracking-widest text-warm mb-5">Built with</p>
          <div className="flex flex-wrap gap-2">
            {project.tech?.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-surface-mid border border-white/[0.08] text-cream"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Prev / Next ---------- */}
        <nav aria-label="Project navigation" className="grid grid-cols-1 md:grid-cols-2 border-t border-white/[0.08] mb-20">
          {prev && (
            <Link
              href={`/projects/${prev.slug}`}
              className="group py-10 md:py-14 md:pr-10 border-b md:border-b-0 md:border-r border-white/[0.08] no-underline"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1.5">←</span>
                Previous
              </p>
              <p className="font-display font-black uppercase tracking-tight leading-none text-[clamp(1.5rem,3.5vw,2.8rem)] text-light/60 group-hover:text-accent transition-colors duration-400">
                {prev.title}
              </p>
            </Link>
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className={`group py-10 md:py-14 md:pl-10 no-underline text-right items-end ${
                prev ? '' : 'md:col-span-2'
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted mb-3 flex items-center justify-end gap-2">
                Next
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </p>
              <p className="font-display font-black uppercase tracking-tight leading-none text-[clamp(1.5rem,3.5vw,2.8rem)] text-light/60 group-hover:text-accent transition-colors duration-400">
                {next.title}
              </p>
            </Link>
          )}
        </nav>

        {/* ---------- CTA ---------- */}
        <div className="relative flex justify-center py-8">
          <div className="text-center flex flex-col items-center">
            <ScrollWordReveal
              text="Have a project in mind?"
              offset={['start 0.98', 'end 0.88']}
              className="text-muted text-lg justify-center mb-1"
            />
            <a
              href={`mailto:${site.email}`}
              className="text-xl font-semibold text-[#bab6b3] hover:text-[#d4d2d0] transition"
            >
              {site.email}
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
