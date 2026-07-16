/**
 * @license
 * Copyright (c) 2026 Aitezaz Sikandar. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * Project: Portfolio
 * Author: Aitezaz Sikandar (aitezazdev)
 * Website: https://aitezaz.xyz
 */

'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomeBanner from '@/components/sections/HomeBanner';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import MarqueeStrip from '@/components/sections/MarqueeStrip';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const reuniteRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const home = homeRef.current;
    const reunite = reuniteRef.current;
    const techStack = techStackRef.current;
    const projects = document.querySelector('section');
    if (!home || !reunite || !techStack || !projects) return;

    const ctx = gsap.context(() => {

      gsap.set(reunite, {
        zIndex: 2,
      });
      gsap.set(home, {
        zIndex: 1,
        y: 0,
        opacity: 1,
        pointerEvents: 'auto',
      });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: reunite,
            start: 'top bottom',
            end: 'top 10%',
            scrub: 1.2,
            onLeave: () => {
              home.style.pointerEvents = 'none';
            },
            onEnterBack: () => {
              home.style.pointerEvents = 'auto';
            },
          },
        })
        .to(home, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          pointerEvents: 'none',
          ease: 'power2.out',
        });
    });

    return () => ctx.revert();
  }, []);
  return (
    <>
      <Navbar />
      <main className="relative">
        <section ref={homeRef} className="sticky top-0 left-0 w-full h-screen">
          <HomeBanner />
        </section>
        <div id="about-section-wrapper" className="relative bg-black">
          <div ref={reuniteRef} className="relative z-10 bg-[#080807] min-h-screen overflow-hidden">
            <About techStackRef={techStackRef} />
          </div>
        </div>
        <section className="relative z-20 bg-white">
          <Projects />
        </section>
        <MarqueeStrip />
        <section className="relative z-25 bg-black">
          <Contact />
        </section>
        <Footer />
      </main>
    </>
  );
}
