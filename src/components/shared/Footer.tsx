'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedLink from '@/components/ui/AnimateLink';
import Magnetic from '@/components/ui/Magnetic';
import { FaArrowUp } from 'react-icons/fa';
import { useHandleLinkClick } from '@/lib/navigation';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import { site, socialList, navLinks } from '@/lib/site';
import Lenis from 'lenis';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;

  useEffect(() => {
    setIsMounted(true);
    let interval: NodeJS.Timeout | number | undefined;

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: site.timeZone,
      });
      setCurrentTime(timeString);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          updateTime();
          interval = setInterval(updateTime, 30000);
        } else {
          if (interval) { clearInterval(interval); interval = undefined; }
        }
      },
      { threshold: 0 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleLinkClick = useHandleLinkClick();
  const links = navLinks.filter((l) => !('menuOnly' in l && l.menuOnly));

  const scrollToTop = () => {
    const lenis = lenisRef?.current ?? window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="relative z-30 bg-ink border-t border-border-subtle px-6 sm:px-8 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <p aria-hidden="true" className="mb-6 md:mb-8 select-none font-display font-semibold tracking-[-0.06em] leading-[0.95] whitespace-nowrap text-[clamp(1.5rem,11.4vw,11.5rem)] text-light/90">
          Aitezaz <span className="serif-accent text-accent">Sikandar</span>
        </p>
        <div className="mb-12 md:mb-16 -mt-4 md:-mt-8 flex items-center gap-5 md:gap-8">
          <span aria-hidden="true" className="h-px flex-1 bg-border-subtle translate-y-3 md:translate-y-5" />
          <p lang="ur" dir="rtl" className="nastaliq text-accent text-[clamp(2rem,5.5vw,4.5rem)] select-none">
            اعتزاز سکندر
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          <div>
            <h3 className="text-light/90 text-base sm:text-lg font-sans tracking-wide font-semibold mb-4 md:mb-6">
              Menu
            </h3>
            <ul className="flex flex-col gap-1 sm:gap-3 text-gray-soft text-xs sm:text-sm font-sans font-medium uppercase tracking-wide">
              {links.map((link) => (
                <AnimatedLink key={link.href}>
                  <a
                    href={link.href}
                    className="[@media(pointer:coarse)]:!h-11"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.name}
                  </a>
                </AnimatedLink>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-light/90 text-base sm:text-lg font-sans tracking-wide font-semibold mb-4 md:mb-6">
              Socials
            </h3>
            <ul className="flex flex-col gap-1 sm:gap-3 text-gray-soft text-xs sm:text-sm font-sans font-medium uppercase tracking-wide">
              {socialList.map((s) => (
                <AnimatedLink key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="[@media(pointer:coarse)]:!h-11">
                    {s.label}
                  </a>
                </AnimatedLink>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 mt-6 md:mt-0">
            <h3 className="text-light/90 text-base sm:text-lg font-sans tracking-wide font-semibold mb-2 md:mb-6">
              Local Time
            </h3>
            <p className="text-gray-soft text-sm sm:text-base font-sans font-medium tracking-wide">
              {isMounted && currentTime ? `${currentTime} ${site.timeZoneLabel}` : 'Checking the time...'}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Magnetic strength={0.4}>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-elevated-dark border border-border-subtler flex items-center justify-center text-gray-soft hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
