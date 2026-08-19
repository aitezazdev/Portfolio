/**
 * @license
 * Copyright (c) 2026 Aitezaz Sikandar. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * Project: Portfolio
 * Author: Aitezaz Sikandar (aitezazdev)
 * Website: https://aitezaz.xyz
 */

'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import HomeBanner from '@/components/sections/HomeBanner';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import MarqueeStrip from '@/components/sections/MarqueeStrip';
import CurvedSectionDivider from '@/components/ui/CurvedSectionDivider';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
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

      const updatePointerEvents = (self: ScrollTrigger) => {
        if (self.progress >= 0.85) {
          home.style.pointerEvents = 'none';
        } else {
          home.style.pointerEvents = 'auto';
        }
      };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: reunite,
            start: 'top bottom',
            end: 'top 10%',
            scrub: 1.2,
            onUpdate: updatePointerEvents,
            onLeave: () => {
              home.style.pointerEvents = 'none';
            },
            onEnterBack: () => {
              home.style.pointerEvents = 'auto';
            },
            onRefresh: updatePointerEvents,
          },
        })
        .to(home, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          ease: 'power2.out',
        });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    try {
      const target = sessionStorage.getItem('nav_target_section');
      if (target) {
        sessionStorage.removeItem('nav_target_section');
        const timer = setTimeout(() => {
          const el = document.getElementById(target);
          if (el) {
            const lenis = (window as any).__lenis;
            if (lenis) {
              lenis.scrollTo(el, {
                offset: 0,
                duration: 1.4,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            } else {
              const targetTop = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
              window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);
  return (
    <>
      <Navbar />
      <main className="relative">
        <section ref={homeRef} className="sticky top-0 left-0 w-full min-h-[100dvh] md:h-screen">
          <HomeBanner />
        </section>
        <div id="about-section-wrapper" className="relative bg-black">
          <div ref={reuniteRef} className="relative z-10 bg-ink min-h-screen overflow-hidden">
            <About techStackRef={techStackRef} />
          </div>
        </div>
        <section className="relative z-20 bg-cream">
          <Projects />
        </section>
        <MarqueeStrip />
        <CurvedSectionDivider curveColor="#E8E4DE" bottomColor="#0F0E0C" />
        <div className="relative z-25 bg-ink overflow-hidden">
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
