'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTransitionState } from 'next-transition-router';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AmbientGeometry from '@/components/canvas/AmbientGeometry';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const RoleTicker = () => {
  const roles = [
    'Full Stack Developer',
    'React & Next.js Engineer',
    'MERN Stack Specialist',
    'Open to Work Worldwide',
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const wrapper = containerRef.current;
      if (!wrapper) return;
      const currentWord = wrapper.querySelector('.ticker-word-current');
      const nextWord = wrapper.querySelector('.ticker-word-next');
      if (currentWord && nextWord) {
        gsap.set(nextWord, {
          yPercent: 100,
        });
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
            gsap.set(currentWord, {
              yPercent: 0,
            });
          },
        });
      }
    }, 2600);
    return () => clearInterval(interval);
  }, [roles.length]);
  const nextIdx = (currentIdx + 1) % roles.length;
  return (
    <div className="h-6 overflow-hidden mb-8 flex justify-center items-center select-none">
      <div
        ref={containerRef}
        className="relative h-6 w-80 text-center font-mono text-sm uppercase tracking-widest text-[#6b645c]"
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
  const nameRef = useRef(null);
  const paragraphRef = useRef(null);
  const tickerRef = useRef(null);
  const buttonsRef = useRef(null);
  const sectionRef = useRef(null);
  const innerContentRef = useRef(null);
  const spotlightRef = useRef(null);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const { isReady } = useTransitionState();
  const splitText = (text) =>
    text.split('').map((char, idx) => (
      <span
        key={idx}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{
          display: 'inline-block',
        }}
      >
        <span className="letter-original block">{char === ' ' ? '\u00A0' : char}</span>
        <span className="letter-duplicate block absolute top-full left-0 w-full">
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ));
  useEffect(() => {
    if (sectionRef.current) {
      gsap.set(sectionRef.current, {
        opacity: 0,
      });
    }
    if (nameRef.current) {
      gsap.set(nameRef.current.querySelectorAll('.letter-wrapper'), {
        y: '100%',
        opacity: 0,
      });
    }
    if (paragraphRef.current) {
      gsap.set(paragraphRef.current, {
        y: 40,
        opacity: 0,
      });
    }
    if (tickerRef.current) {
      gsap.set(tickerRef.current, {
        y: 40,
        opacity: 0,
      });
    }
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, {
        y: 40,
        opacity: 0,
      });
    }
  }, []);
  useEffect(() => {
    const hasShownPreloader = sessionStorage.getItem('preloader-shown');
    if (hasShownPreloader) {
      setPreloaderComplete(true);
    } else {
      const handlePreloaderComplete = () => {
        setPreloaderComplete(true);
      };
      window.addEventListener('preloaderComplete', handlePreloaderComplete);
      return () => {
        window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      };
    }
  }, []);
  useEffect(() => {
    if (!preloaderComplete || !isReady) return;
    if (!nameRef.current) return;
    const timer = setTimeout(() => {
      gsap.to(sectionRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      const letters = nameRef.current.querySelectorAll('.letter-wrapper');
      gsap.to(letters, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.3,
      });
      const tl = gsap.timeline({
        delay: 1.1,
        ease: 'power3.out',
      });
      if (paragraphRef.current) {
        tl.to(
          paragraphRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.4',
        );
      }
      if (tickerRef.current) {
        tl.to(
          tickerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.4',
        );
      }
      if (buttonsRef.current) {
        tl.to(
          buttonsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.4',
        );
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, isReady]);
  useEffect(() => {
    if (!nameRef.current || !preloaderComplete || !isReady) return;
    const letters = nameRef.current.querySelectorAll('.letter-wrapper');
    const handleMouseEnter = () => {
      letters.forEach((wrapper, idx) => {
        const original = wrapper.querySelector('.letter-original');
        const duplicate = wrapper.querySelector('.letter-duplicate');
        gsap
          .timeline({
            delay: idx * 0.04,
          })
          .to(
            original,
            {
              y: '-100%',
              duration: 0.5,
              ease: 'power3.out',
            },
            0,
          )
          .to(
            duplicate,
            {
              y: '-100%',
              duration: 0.5,
              ease: 'power3.out',
            },
            0,
          );
      });
    };
    const handleMouseLeave = () => {
      letters.forEach((wrapper, idx) => {
        const original = wrapper.querySelector('.letter-original');
        const duplicate = wrapper.querySelector('.letter-duplicate');
        gsap
          .timeline({
            delay: idx * 0.04,
          })
          .to(
            original,
            {
              y: '0%',
              duration: 0.5,
              ease: 'power3.out',
            },
            0,
          )
          .to(
            duplicate,
            {
              y: '0%',
              duration: 0.5,
              ease: 'power3.out',
            },
            0,
          );
      });
    };
    const nameElement = nameRef.current;
    nameElement.addEventListener('mouseenter', handleMouseEnter);
    nameElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      nameElement.removeEventListener('mouseenter', handleMouseEnter);
      nameElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [preloaderComplete, isReady]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(spotlightRef.current, {
        opacity: 1,
        duration: 0.5,
        overwrite: 'auto',
      });
      spotlightRef.current.style.setProperty('--x', `${x}px`);
      spotlightRef.current.style.setProperty('--y', `${y}px`);
    };
    const handleMouseLeave = () => {
      if (!spotlightRef.current) return;
      gsap.to(spotlightRef.current, {
        opacity: 0,
        duration: 0.8,
        overwrite: 'auto',
      });
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
  }, []);
  useGSAP(
    () => {
      if (!sectionRef.current || !innerContentRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(innerContentRef.current, {
          y: '-15vh',
          ease: 'none',
        }),
      });
      return () => {
        trigger.kill();
      };
    },
    {
      scope: sectionRef,
    },
  );
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(section, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      section.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  return (
    <section
      ref={sectionRef}
      className="min-h-screen px-6 sm:px-8 md:px-12 pt-36 md:pt-20 bg-[#e8e8e3] flex items-center relative overflow-hidden"
      style={{
        opacity: 0,
      }}
    >
      <AmbientGeometry />

      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-[1] opacity-0"
        style={{
          background:
            'radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(16, 185, 129, 0.08), transparent 85%)',
          willChange: 'opacity',
        }}
      />

      <div ref={innerContentRef} className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center md:hidden">
          <h1
            ref={nameRef}
            className="font-display text-6xl sm:text-6xl select-none font-semibold leading-none uppercase cursor-pointer overflow-hidden mb-3"
          >
            <div>{splitText('Aitezaz')}</div>
            <div>{splitText('Sikandar')}</div>
          </h1>
        </div>

        <div className="hidden md:block text-center">
          <h1
            ref={nameRef}
            className="font-display text-7xl lg:text-8xl xl:text-[9rem] select-none font-bold leading-none uppercase cursor-pointer overflow-hidden mb-5"
          >
            {splitText('Aitezaz Sikandar')}
          </h1>
        </div>

        <div className="flex justify-center items-center py-1 md:py-3 px-4 sm:px-6">
          <div className="max-w-xl text-center">
            <p
              ref={paragraphRef}
              className="text-[#615c56] font-sans text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10"
            >
              Open to job opportunities worldwide. Passionate about building polished, intuitive,
              and thoughtful digital experiences that leave a mark.
            </p>

            <div ref={tickerRef}>
              <RoleTicker />
            </div>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row justify-center gap-4">
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
                onClick={() => window.open('/resume.pdf', '_blank')}
                topText="RESUME"
                bottomText="DOWNLOAD PDF →"
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
