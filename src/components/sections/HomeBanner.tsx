'use client';

import ReactiveSerif from '@/components/ui/ReactiveSerif';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Magnetic from '@/components/ui/Magnetic';
import { EASE } from '@/lib/motion';
import { site } from '@/lib/site';
import { useReducedMotion } from '@/lib/useReducedMotion';

import HeroAurora from '@/components/canvas/HeroAurora';

const RoleTicker = () => {
  const roles = site.roles;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      const wrapper = containerRef.current;
      if (!wrapper) return;
      const currentWord = wrapper.querySelector('.ticker-word-current');
      const nextWord = wrapper.querySelector('.ticker-word-next');
      if (currentWord && nextWord) {
        gsap.set(nextWord, { yPercent: 100 });
        gsap.to(currentWord, { yPercent: -100, duration: 0.4, ease: EASE.outCubic });
        gsap.to(nextWord, {
          yPercent: 0,
          duration: 0.4,
          ease: EASE.outCubic,
          onComplete: () => {
            setCurrentIdx((prev) => (prev + 1) % roles.length);
            gsap.set(currentWord, { yPercent: 0 });
          },
        });
      }
    }, 2600);
    return () => clearInterval(interval);
  }, [roles.length, reduced]);

  const nextIdx = (currentIdx + 1) % roles.length;
  return (
    <div className="h-6 w-full overflow-hidden mb-8 flex justify-center items-center select-none">
      <div
        ref={containerRef}
        className="relative h-6 w-full max-w-md text-center font-mono text-xs sm:text-sm uppercase tracking-[0.14em] sm:tracking-widest whitespace-nowrap text-accent-deep"
      >
        <div className="ticker-word-current absolute inset-0 flex items-center justify-center">
          {roles[currentIdx]}
        </div>
        <div className="ticker-word-next absolute inset-0 flex items-center justify-center translate-y-full">
          {roles[nextIdx]}
        </div>
      </div>
    </div>
  );
};

const StampBadge = ({ onClick }: { onClick: () => void }) => (
  <Magnetic strength={0.35}>
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to contact section"
      className="group relative w-28 h-28 lg:w-36 lg:h-36 rounded-full grid place-items-center select-none"
    >
      <svg viewBox="0 0 200 200" className="stamp-disc absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text
          className="fill-charcoal font-mono uppercase"
          style={{ fontSize: '15.5px', letterSpacing: '0.305em' }}
        >
          <textPath href="#stamp-circle">
            AVAILABLE FOR WORK • LET&apos;S BUILD • 
          </textPath>
        </text>
      </svg>
      <span className="grid place-items-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-accent text-on-accent transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-45">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 7l10 10M17 7v10H7" />
        </svg>
      </span>
    </button>
  </Magnetic>
);

const HomeBanner = () => {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const splitsRef = useRef<SplitText[]>([]);
  const hasPlayedRef = useRef(false);
  const removeHoverRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();

  const prepareIntro = useCallback(() => {
    const name = nameRef.current;
    if (!name) return [] as HTMLElement[];

    const lines = name.querySelectorAll<HTMLElement>('[data-hero-line]');
    const chars: HTMLElement[] = [];
    splitsRef.current.forEach((sp) => sp.revert());
    splitsRef.current = [];
    lines.forEach((line) => {
      const split = SplitText.create(line, { type: 'chars', charsClass: 'hero-char' });
      splitsRef.current.push(split);
      chars.push(...(split.chars as HTMLElement[]));
    });

    gsap.set(chars, {
      yPercent: 125,
      rotateX: -70,
      opacity: 0,
      transformPerspective: 900,
      transformOrigin: '50% 100%',
    });
    gsap.set([paragraphRef.current, tickerRef.current], { y: 34, opacity: 0 });
    gsap.set(buttonsRef.current?.children ?? [], { y: 26, opacity: 0, scale: 0.96 });
    gsap.set(stampRef.current, { scale: 0, rotate: -30, opacity: 0 });
    gsap.set(
      [nameRef.current, paragraphRef.current, tickerRef.current, buttonsRef.current, stampRef.current],
      { opacity: 1 },
    );
    gsap.set([paragraphRef.current, tickerRef.current], { opacity: 0 });
    gsap.set(stampRef.current, { opacity: 0 });
    return chars;
  }, []);

  const preparedCharsRef = useRef<HTMLElement[]>([]);

  const playIntro = useCallback(() => {
    if (reduced || !nameRef.current || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const chars = preparedCharsRef.current.length ? preparedCharsRef.current : prepareIntro();

    const tl = gsap.timeline({ defaults: { ease: EASE.outQuart }, delay: 0.05 });
    tl.to(chars, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      duration: 1,
      stagger: { each: 0.026, from: 'start' },
    })
      .to(paragraphRef.current, { y: 0, opacity: 1, duration: 0.75, ease: EASE.outCubic }, '-=0.55')
      .to(tickerRef.current, { y: 0, opacity: 1, duration: 0.6, ease: EASE.outCubic }, '-=0.5')
      .to(
        buttonsRef.current?.children ?? [],
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)' },
        '-=0.45'
      )
      .to(stampRef.current, { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, '-=0.6');

    const nameEl = nameRef.current;
    const enterHandler = () => {
      gsap.to(chars, {
        keyframes: [{ yPercent: -9, duration: 0.22 }, { yPercent: 0, duration: 0.5 }],
        ease: EASE.outQuad,
        stagger: { each: 0.016, from: 'center' },
        overwrite: 'auto',
      });
    };
    nameEl.addEventListener('mouseenter', enterHandler);
    removeHoverRef.current = () => nameEl.removeEventListener('mouseenter', enterHandler);
  }, [reduced, prepareIntro]);

  useEffect(() => {
    if (reduced || !nameRef.current) {
      const els = [nameRef.current, paragraphRef.current, tickerRef.current, buttonsRef.current, stampRef.current].filter(Boolean);
      if (els.length) gsap.set(els, { clearProps: 'opacity,transform' });
      return;
    }

    preparedCharsRef.current = prepareIntro();

    if (typeof window !== 'undefined' && window.__preloaderDone === true) {
      playIntro();
    }

    const failSafe = window.setTimeout(() => playIntro(), 8000);

    return () => {
      window.clearTimeout(failSafe);
      removeHoverRef.current?.();
      removeHoverRef.current = null;
      splitsRef.current.forEach((sp) => sp.revert());
      splitsRef.current = [];
      preparedCharsRef.current = [];
      hasPlayedRef.current = false;
    };
  }, [reduced, prepareIntro, playIntro]);

  useEffect(() => {
    const handlePreloaderComplete = () => {
      playIntro();
    };
    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    return () => window.removeEventListener('preloaderComplete', handlePreloaderComplete);
  }, [playIntro]);

  useEffect(() => {
    if (reduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      spotlightRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
      spotlightRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
      gsap.to(spotlightRef.current, { opacity: 1, duration: 0.5, overwrite: 'auto' });
    };
    const handleMouseLeave = () => {
      gsap.to(spotlightRef.current, { opacity: 0, duration: 0.8, overwrite: 'auto' });
    };
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !innerContentRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(innerContentRef.current, { y: '-15vh', ease: 'none' }),
      });
      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(section, { offset: 0, duration: 1.2 });
    } else {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="min-h-[100dvh] md:min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 pt-28 pb-8 md:pt-20 md:pb-0 bg-cream flex items-center relative overflow-hidden"
    >
      <HeroAurora />

      {!reduced && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-[1] opacity-0"
          style={{
            background: 'radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(255, 77, 46, 0.10), transparent 85%)',
            willChange: 'opacity',
          }}
        />
      )}

      <div ref={innerContentRef} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="relative text-center">
          <h1
            ref={nameRef}
            aria-label={site.name}
            className="hero-hide select-none leading-none cursor-default mb-6 md:mb-4"
          >
            <span aria-hidden="true" className="block">
              <span
                data-hero-line
                className="block font-display font-semibold text-hero tracking-[-0.055em]"
              >
                Aitezaz
              </span>
              <span
                data-hero-line
                className="serif-accent block text-hero-sm leading-[0.85] md:ml-[14vw]"
              >
                <ReactiveSerif text="Sikandar" />
              </span>
            </span>
          </h1>

          <div ref={stampRef} className="hero-hide absolute -top-6 right-0 lg:right-4 xl:right-10 hidden sm:block">
            <StampBadge onClick={() => handleScroll('contact')} />
          </div>
        </div>

        <div className="flex justify-center items-center py-1 md:py-3 px-4 sm:px-6 w-full">
          <div className="max-w-2xl w-full text-center mx-auto">
            <p
              ref={paragraphRef}
              className="hero-hide text-balance text-ink [text-shadow:0_0_16px_rgba(243,238,229,0.95)] font-sans sm:text-xl md:text-2xl leading-snug mb-8 md:mb-10 text-center mx-auto"
            >
              Full-stack engineer building fast, scalable, and reliable web applications.
            </p>

            <div ref={tickerRef} className="hero-hide w-full flex justify-center">
              <RoleTicker />
            </div>

            <div ref={buttonsRef} className="hero-hide flex flex-row justify-center items-center gap-2.5 sm:gap-4 flex-wrap w-full max-w-full mx-auto px-2">
              <AnimatedButton
                onClick={() => handleScroll('projects')}
                topText="PROJECTS"
                bottomText="VIEW WORK →"
                variant="primary"
              />
              <AnimatedButton
                onClick={() => handleScroll('contact')}
                topText="CONTACT"
                bottomText="GET IN TOUCH →"
                variant="light"
              />
              <AnimatedButton
                as="a"
                href="/01_aitezaz_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                topText="RESUME"
                bottomText="DOWNLOAD →"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
