'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import dynamic from 'next/dynamic';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Magnetic from '@/components/ui/Magnetic';
import { EASE } from '@/lib/motion';
import { site } from '@/lib/site';
import { useReducedMotion } from '@/lib/useReducedMotion';

const AmbientGeometry = dynamic(() => import('@/components/canvas/AmbientGeometry'), {
  ssr: false,
});

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
    <div className="h-6 overflow-hidden mb-8 flex justify-center items-center select-none">
      <div
        ref={containerRef}
        className="relative h-6 w-80 text-center font-mono text-sm uppercase tracking-widest text-accent"
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
        <text className="fill-charcoal font-mono uppercase" style={{ fontSize: '15.5px', letterSpacing: '0.32em' }}>
          <textPath href="#stamp-circle">
            open to work • worldwide • let&apos;s talk •
          </textPath>
        </text>
      </svg>
      <span className="grid place-items-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-accent text-white transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-45">
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
  const reduced = useReducedMotion();

  const playIntro = useCallback(() => {
    if (reduced || !nameRef.current || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const lines = nameRef.current.querySelectorAll<HTMLElement>('[data-hero-line]');
    const chars: HTMLElement[] = [];
    splitsRef.current.forEach((s) => s.revert());
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

    const enterHandler = () => {
      gsap.to(chars, {
        keyframes: [{ yPercent: -9, duration: 0.22 }, { yPercent: 0, duration: 0.5 }],
        ease: EASE.outQuad,
        stagger: { each: 0.016, from: 'center' },
        overwrite: 'auto',
      });
    };
    nameRef.current.addEventListener('mouseenter', enterHandler);
    return () => nameRef.current?.removeEventListener('mouseenter', enterHandler);
  }, [reduced]);

  useEffect(() => {
    if (reduced || !nameRef.current) {
      if (reduced) {
        gsap.set([paragraphRef.current, tickerRef.current], { clearProps: 'all' });
      }
      return;
    }
    if (typeof window !== 'undefined' && window.__preloaderDone === true) {
      const cleanup = playIntro();
      return cleanup;
    }

    const lines = nameRef.current.querySelectorAll<HTMLElement>('[data-hero-line]');
    const chars: HTMLElement[] = [];
    splitsRef.current.forEach((s) => s.revert());
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
  }, [reduced, playIntro]);

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
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(section, { offset: 0, duration: 1.2 });
    } else {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-[100dvh] md:min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 pt-28 pb-8 md:pt-20 md:pb-0 bg-cream flex items-center relative overflow-hidden"
    >
      <AmbientGeometry />

      {!reduced && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-[1] opacity-0"
          style={{
            background: 'radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(196, 93, 62, 0.07), transparent 85%)',
            willChange: 'opacity',
          }}
        />
      )}

      <div ref={innerContentRef} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="relative text-center">
          <h1
            ref={nameRef}
            aria-label={site.name}
            className="select-none leading-none cursor-default mb-6 md:mb-4"
          >
            <span aria-hidden="true" className="block">
              <span
                data-hero-line
                className="block font-display font-black uppercase text-hero tracking-tight"
              >
                AITEZAZ
              </span>
              <span
                data-hero-line
                className="serif-accent block text-hero-sm leading-[0.85] md:ml-[14vw]"
              >
                sikandar
              </span>
            </span>
          </h1>

          <div ref={stampRef} className="absolute -top-6 right-0 lg:right-4 xl:right-10 hidden sm:block opacity-0">
            <StampBadge onClick={() => handleScroll('contact')} />
          </div>
        </div>

        <div className="flex justify-center items-center py-1 md:py-3 px-4 sm:px-6 w-full">
          <div className="max-w-xl w-full text-center mx-auto">
            <p
              ref={paragraphRef}
              className="text-warm font-sans text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 text-center mx-auto"
            >
              Open to job opportunities worldwide. Passionate about building polished, intuitive,
              and thoughtful digital experiences that leave a mark.
            </p>

            <div ref={tickerRef} className="w-full flex justify-center">
              <RoleTicker />
            </div>

            <div ref={buttonsRef} className="flex flex-row justify-center items-center gap-2.5 sm:gap-4 flex-wrap w-full max-w-full mx-auto px-2">
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
                onClick={() => window.open('/01_aitezaz_resume.pdf', '_blank')}
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
