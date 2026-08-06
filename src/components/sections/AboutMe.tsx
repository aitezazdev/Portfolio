'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedHeading from '@/components/ui/AnimateHeading';

const About = () => {
  const headingText = 'Who Am I';
  const descriptionText =
    "I'm a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.";
  const aboutMeText = `I am a Software Engineer who specializes in building end-to-end web applications. I love bridges—bridging the gap between front-end aesthetics (using GSAP and Tailwind CSS to create fluid, premium interfaces) and robust back-end systems (orchestrating REST APIs, database schemas, and real-time Socket.io channels).

My tech journey started out of a pure curiosity to understand how software ticks under the hood. Today, that curiosity has translated into a love for clean code, optimistic UI updates, and building user journeys that feel alive and intuitive.

Outside of the editor, I enjoy collaborating on team-focused development, discussing code architecture, and learning new tools. My goal is to build impactful, scalable applications that make a meaningful difference.`;
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // IntersectionObserver for lazy loading video & auto-pause off-screen
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.15 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        '.about-image-wrapper',
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-image-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      gsap.fromTo(
        '.about-bio-para',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-bio-para',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      gsap.fromTo(
        '.about-label',
        { opacity: 0, letterSpacing: '0.5em' },
        {
          opacity: 1,
          letterSpacing: '0.3em',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-label',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <div className="bg-cream">
      <section
        ref={sectionRef}
        id="about"
        className="min-h-screen bg-ink text-light py-24 md:py-32 rounded-t-4xl"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mb-10 md:mb-20">
            <AnimatedHeading
              text={headingText}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
            />
            <AnimateDescription
              text={descriptionText}
              className="text-base sm:text-lg text-gray-soft font-sans"
            />
          </div>

          <div className="grid grid-cols-12 gap-6 md:gap-8 pb-20 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-5 flex items-center justify-center">
              <div
                ref={containerRef}
                className="about-image-wrapper relative group w-full max-w-[350px] md:max-w-[380px] h-[360px] md:h-[480px] bg-elevated-dark rounded-2xl overflow-hidden border border-border-subtler shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              >
                {/* Ambient Status Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-ink/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-light/90 pointer-events-none">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className="uppercase tracking-widest text-[10px]">
                    {isPlaying ? 'Live Scenery' : 'Ambient'}
                  </span>
                </div>

                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/nature-poster.webp"
                  aria-label="Ambient nature scenery"
                  className="w-full h-full object-cover transition-opacity duration-700"
                >
                  <source src="/nature-live.webm" type="video/webm" />
                  <source src="/nature-live.mp4" type="video/mp4" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/nature-poster.webp"
                    alt="Ambient nature scenery"
                    className="w-full h-full object-cover"
                  />
                </video>

                {/* Subtle gradient overlay to match site aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-6 md:col-start-6 lg:col-start-7 flex flex-col justify-center space-y-8">
              <span className="about-label text-sm sm:text-base md:text-base text-warm uppercase tracking-[0.3em] font-medium text-center md:text-left inline-block">
                (About Me)
              </span>
              <div className="space-y-6">
                {aboutMeText.split('\n\n').map((p, i) => (
                  <p
                    key={i}
                    className="about-bio-para text-light/70 text-base sm:text-lg md:text-lg leading-relaxed font-sans"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

