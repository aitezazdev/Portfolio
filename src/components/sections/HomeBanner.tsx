'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useTransitionState } from 'next-transition-router';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AmbientGeometry from '@/components/canvas/AmbientGeometry';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { safeSessionStorage } from '@/utils/storage';

const RoleTicker = () => {
  const roles = [
    'Full Stack Developer',
    'React & Next.js Engineer',
    'MERN Stack Developer',
    'Open to Work Worldwide',
  ];
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
        gsap.to(currentWord, {
          yPercent: -100,
          duration: 0.4,
          ease: 'power3.out',
        });
        gsap.to(nextWord, {
          yPercent: 0,
          duration: 0.4,
          ease: 'power3.out',
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
        className="relative h-6 w-80 text-center font-mono text-sm uppercase tracking-widest text-warm"
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

const HomeBanner = () => {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [preloaderComplete, setPreloaderComplete] = useState<boolean>(false);
  const { isReady } = useTransitionState();
  const reduced = useReducedMotion();

  const splitText = (text: string) =>
    text.split('').map((char, idx) => (
      <span
        key={idx}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{ display: 'inline-block', ['--idx' as any]: idx }}
      >
        <span className="letter-original block">{char === ' ' ? ' ' : char}</span>
        <span aria-hidden="true" className="letter-duplicate block absolute top-full left-0 w-full select-none">
          {char === ' ' ? ' ' : char}
        </span>
      </span>
    ));

  // Initial hidden states
  useEffect(() => {
    if (reduced) {
      gsap.set(sectionRef.current, { opacity: 1 });
      return;
    }
    if (sectionRef.current) gsap.set(sectionRef.current, { opacity: 0 });
    if (nameRef.current) {
      gsap.set(nameRef.current.querySelectorAll('.letter-wrapper'), { y: '100%', opacity: 0 });
    }
    [paragraphRef, tickerRef, buttonsRef].forEach((ref) => {
      if (ref.current) gsap.set(ref.current, { y: 40, opacity: 0 });
    });
  }, [reduced]);

  useEffect(() => {
    const hasShownPreloader = safeSessionStorage.getItem('preloader-shown');
    if (hasShownPreloader) {
      setPreloaderComplete(true);
    } else {
      const handler = () => setPreloaderComplete(true);
      window.addEventListener('preloaderComplete', handler);
      return () => window.removeEventListener('preloaderComplete', handler);
    }
  }, []);

  useEffect(() => {
    if (!preloaderComplete || !isReady) return;
    if (reduced) {
      gsap.set(sectionRef.current, { opacity: 1 });
      return;
    }

    const timer = setTimeout(() => {
      gsap.to(sectionRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      const letters = nameRef.current?.querySelectorAll('.letter-wrapper');
      if (letters?.length) {
        gsap.to(letters, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
      const tl = gsap.timeline({ delay: 1.1, ease: 'power3.out' });
      [paragraphRef, tickerRef, buttonsRef].forEach((ref) => {
        if (ref.current) {
          tl.to(ref.current, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4');
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, isReady, reduced]);

  const handleMouseEnter = () => {
    if (reduced || !nameRef.current) return;
    const isDesktop = window.innerWidth >= 768;
    const selector = isDesktop ? '.hidden.md\\:block .letter-wrapper' : '.block.md\\:hidden .letter-wrapper';
    nameRef.current.querySelectorAll(selector).forEach((wrapper, idx) => {
      const original = wrapper.querySelector('.letter-original');
      const duplicate = wrapper.querySelector('.letter-duplicate');
      if (original && duplicate) {
        gsap.to(original, { y: '-100%', duration: 0.45, ease: 'power2.out', delay: idx * 0.03, overwrite: 'auto' });
        gsap.to(duplicate, { y: '-100%', duration: 0.45, ease: 'power2.out', delay: idx * 0.03, overwrite: 'auto' });
      }
    });
  };

  const handleMouseLeave = () => {
    if (reduced || !nameRef.current) return;
    const isDesktop = window.innerWidth >= 768;
    const selector = isDesktop ? '.hidden.md\\:block .letter-wrapper' : '.block.md\\:hidden .letter-wrapper';
    nameRef.current.querySelectorAll(selector).forEach((wrapper, idx) => {
      const original = wrapper.querySelector('.letter-original');
      const duplicate = wrapper.querySelector('.letter-duplicate');
      if (original && duplicate) {
        gsap.to(original, { y: '0%', duration: 0.45, ease: 'power2.out', delay: idx * 0.03, overwrite: 'auto' });
        gsap.to(duplicate, { y: '0%', duration: 0.45, ease: 'power2.out', delay: idx * 0.03, overwrite: 'auto' });
      }
    });
  };

  // Mouse spotlight
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
      className="min-h-screen px-6 sm:px-8 md:px-12 pt-28 pb-8 md:pt-20 md:pb-0 bg-cream flex items-center relative overflow-hidden"
      style={{ opacity: reduced ? 1 : 0 }}
    >
      <AmbientGeometry />

      {!reduced && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-[1] opacity-0"
          style={{
            background: 'radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(16, 185, 129, 0.08), transparent 85%)',
            willChange: 'opacity',
          }}
        />
      )}

      <div ref={innerContentRef} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center">
          <h1
            ref={nameRef}
            aria-label="Aitezaz Sikandar"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="name-heading font-display text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] select-none font-bold leading-none uppercase cursor-pointer overflow-hidden mb-5"
          >
            <span aria-hidden="true" className="block md:hidden">
              <span className="block">{splitText('Aitezaz')}</span>
              <span className="block">{splitText('Sikandar')}</span>
            </span>
            <span aria-hidden="true" className="hidden md:block">
              {splitText('Aitezaz Sikandar')}
            </span>
          </h1>
        </div>

        <div className="flex justify-center items-center py-1 md:py-3 px-4 sm:px-6">
          <div className="max-w-xl text-center">
            <p
              ref={paragraphRef}
              className="text-muted font-sans text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10"
            >
              Open to job opportunities worldwide. Passionate about building polished, intuitive,
              and thoughtful digital experiences that leave a mark.
            </p>

            <div ref={tickerRef}>
              <RoleTicker />
            </div>

            <div ref={buttonsRef} className="flex flex-row justify-center items-center gap-2 sm:gap-4 flex-wrap max-w-full px-2">
              <AnimatedButton
                onClick={() => handleScroll('projects')}
                topText="PROJECTS"
                bottomText="VIEW WORK →"
                variant="dark"
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
