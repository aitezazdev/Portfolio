'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AnimatedButton from './AnimatedButton';
import ParticlesBackground from './ParticlesBackground';

const HomeBanner = () => {
  const nameRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const containerRef = useRef(null);
  const [canAnimate, setCanAnimate] = useState(false);

  const splitText = (text) =>
    text.split('').map((char, idx) => (
      <span
        key={idx}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{ display: 'inline-block' }}
      >
        <span className="letter-original block">{char === ' ' ? '\u00A0' : char}</span>
        <span className="letter-duplicate block absolute top-full left-0 w-full">
          {char === ' ' ? '\u00A0' : char}
        </span>
      </span>
    ));

  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
    }
    if (nameRef.current) {
      gsap.set(nameRef.current.querySelectorAll('.letter-wrapper'), {
        y: '100%',
        opacity: 0,
      });
    }
    if (paragraphRef.current) {
      gsap.set(paragraphRef.current, { y: 40, opacity: 0 });
    }
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, { y: 40, opacity: 0 });
    }
  }, []);

  useEffect(() => {
    const hasShownPreloader = sessionStorage.getItem('preloader-shown');

    if (hasShownPreloader) {
      setTimeout(() => setCanAnimate(true), 50);
    } else {
      const handlePreloaderComplete = () => {
        setTimeout(() => setCanAnimate(true), 100);
      };

      window.addEventListener('preloaderComplete', handlePreloaderComplete);

      return () => {
        window.removeEventListener('preloaderComplete', handlePreloaderComplete);
      };
    }
  }, []);

  useEffect(() => {
    if (!nameRef.current || !canAnimate) return;

    gsap.to(containerRef.current, {
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

    const handleMouseEnter = () => {
      letters.forEach((wrapper, idx) => {
        const original = wrapper.querySelector('.letter-original');
        const duplicate = wrapper.querySelector('.letter-duplicate');
        gsap
          .timeline({ delay: idx * 0.04 })
          .to(original, { y: '-100%', duration: 0.5, ease: 'power3.out' }, 0)
          .to(duplicate, { y: '-100%', duration: 0.5, ease: 'power3.out' }, 0);
      });
    };

    const handleMouseLeave = () => {
      letters.forEach((wrapper, idx) => {
        const original = wrapper.querySelector('.letter-original');
        const duplicate = wrapper.querySelector('.letter-duplicate');
        gsap
          .timeline({ delay: idx * 0.04 })
          .to(original, { y: '0%', duration: 0.5, ease: 'power3.out' }, 0)
          .to(duplicate, { y: '0%', duration: 0.5, ease: 'power3.out' }, 0);
      });
    };

    nameRef.current.addEventListener('mouseenter', handleMouseEnter);
    nameRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (!nameRef.current) return;
      nameRef.current.removeEventListener('mouseenter', handleMouseEnter);
      nameRef.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canAnimate]);

  useEffect(() => {
    if (!canAnimate) return;

    const tl = gsap.timeline({ delay: 1.1, ease: 'power3.out' });

    if (paragraphRef.current) {
      tl.to(paragraphRef.current, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4');
    }

    if (buttonsRef.current) {
      tl.to(buttonsRef.current, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4');
    }
  }, [canAnimate]);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen px-6 sm:px-8 md:px-12 pt-40 md:pt-20 bg-[#e8e8e3] flex items-center"
      style={{ opacity: 0 }}
    >
      <ParticlesBackground />
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center md:hidden">
          <h1
            ref={nameRef}
            className="font-display text-6xl sm:text-6xl select-none font-semibold leading-none uppercase cursor-pointer overflow-hidden mb-6"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
