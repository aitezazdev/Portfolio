'use client';

import React, { useRef } from 'react';
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
              className="text-base sm:text-lg text-muted font-sans"
            />
          </div>

          <div className="grid grid-cols-12 gap-6 md:gap-8 pb-20 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-5 flex items-center justify-center">
              <div className="about-image-wrapper w-full max-w-[350px] md:max-w-[380px] h-[360px] md:h-[450px] bg-elevated-dark rounded-2xl overflow-hidden border border-border-subtler">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Profile animation"
                  className="w-full h-full object-cover"
                >
                  <source src="/zaz-anim.mp4" type="video/mp4" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/zaz-anim.webp"
                    alt="Profile animation"
                    className="w-full h-full object-cover"
                  />
                </video>
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
                    className="about-bio-para text-muted text-base sm:text-lg md:text-lg leading-relaxed font-sans"
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
