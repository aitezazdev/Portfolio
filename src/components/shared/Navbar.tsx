'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTransitionState } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import AnimatedLink from '@/components/ui/AnimateLink';
import { useHandleLinkClick } from '@/lib/navigation';
import Link from 'next/link';
import Lenis from '@studio-freight/lenis';
import { Copyright } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

interface AnimatedHamburgerProps {
  isOpen: boolean;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({ isOpen }) => {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const hasInitRef = useRef<boolean>(false);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!l1 || !l2) return;

    if (!hasInitRef.current) {
      hasInitRef.current = true;
      if (isOpen) {
        gsap.set(l1, { y: 0, rotation: 45 });
        gsap.set(l2, { y: 0, rotation: -45 });
      } else {
        gsap.set(l1, { y: -5, rotation: 0 });
        gsap.set(l2, { y: 5, rotation: 0 });
      }
      return;
    }

    if (isOpen) {
      gsap.to(l1, { y: 0, rotation: 45, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 0, rotation: -45, duration: 0.35, ease: 'power3.inOut' });
    } else {
      gsap.to(l1, { y: -5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  }, [isOpen]);

  return (
    <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
      <span ref={line1Ref} className="absolute w-full h-[2px] bg-white rounded-full" style={{ transformOrigin: 'center' }} />
      <span ref={line2Ref} className="absolute w-full h-[2px] bg-white rounded-full" style={{ transformOrigin: 'center' }} />
    </div>
  );
};

interface NavbarBrandProps {
  logoRef?: React.RefObject<any>;
  handleLinkClick: (href: string) => void;
}

const NavbarBrand: React.FC<NavbarBrandProps> = ({ logoRef, handleLinkClick }) => {
  return (
    <Magnetic strength={0.3}>
      <Link
        ref={logoRef as any}
        href="/#top"
        onClick={(e) => {
          e.preventDefault();
          handleLinkClick('/#top');
        }}
        className="group flex items-center cursor-pointer select-none py-1 text-warm"
        aria-label="Aitezaz Sikandar Home"
      >
        <div className="transition-transform duration-500 ease-in-expo group-hover:rotate-[360deg] flex items-center justify-center">
          <Copyright className="w-[18px] h-[18px]" />
        </div>
        <div className="relative ms-2 flex items-center whitespace-nowrap text-warm text-lg font-sans tracking-wide font-medium leading-none">
          <span>aitezaz</span>
          <span className="relative inline-flex items-center overflow-hidden transition-all duration-500 ease-in-expo w-[32px] group-hover:w-[86px]">
            <span className="transition-transform duration-500 ease-in-expo group-hover:-translate-x-full inline-block">
              dev
            </span>
            <span className="absolute left-0 ps-1.5 transition-transform duration-500 ease-in-expo translate-x-full group-hover:translate-x-0 inline-block">
              sikandar
            </span>
          </span>
        </div>
      </Link>
    </Magnetic>
  );
};

interface LinkItem {
  name: string;
  href: string;
  menuOnly?: boolean;
}

const menuSlideVariants: Variants = {
  initial: {
    x: 'calc(100% + 100px)',
  },
  enter: {
    x: '0%',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: 'calc(100% + 100px)',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

const linkSlideVariants: Variants = {
  initial: {
    x: 80,
    opacity: 0,
  },
  enter: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    opacity: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

const lineTopVariants: Variants = {
  initial: { scaleX: 0 },
  enter: { scaleX: 1, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 } },
  exit: { scaleX: 0, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
};

const lineBotVariants: Variants = {
  initial: { scaleX: 0 },
  enter: { scaleX: 1, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 } },
  exit: { scaleX: 0, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
};

const metaVariants: Variants = {
  initial: { y: 20, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.25 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

const curveVariants: Variants = {
  initial: {
    d: 'M100 0 L200 0 L200 100 L100 100 Q-100 50 100 0',
  },
  enter: {
    d: 'M100 0 L200 0 L200 100 L100 100 Q100 50 100 0',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    d: 'M100 0 L200 0 L200 100 L100 100 Q-100 50 100 0',
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

function MenuCurve() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute top-0 -left-[99px] h-full w-[100px] pointer-events-none fill-surface stroke-none overflow-visible will-change-transform"
    >
      <motion.path
        variants={curveVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        fill="#0d0d0c"
      />
    </svg>
  );
}

interface FullscreenMenuProps {
  onClose: () => void;
  handleLinkClick: (href: string) => void;
  links: LinkItem[];
}

const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ onClose, handleLinkClick, links }) => {
  const magnetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleMagneticMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  };

  const handleMagneticMouseLeave = (index: number) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9980] bg-black/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={onClose}
      />

      <motion.div
        variants={menuSlideVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="fixed top-0 right-0 h-screen w-full md:w-[55%] z-[9981] bg-surface flex flex-col pointer-events-auto will-change-transform transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuCurve />

        <div className="relative w-full h-full flex flex-col overflow-hidden">
          <motion.div
            variants={lineTopVariants}
            style={{ transformOrigin: 'left' }}
            className="absolute top-[72px] left-0 right-0 h-px bg-border-subtler"
          />
          <motion.div
            variants={lineBotVariants}
            style={{ transformOrigin: 'right' }}
            className="absolute bottom-[170px] md:bottom-[100px] left-0 right-0 h-px bg-border-subtler"
          />

          <div className="flex justify-between items-center px-10 h-20 border-b border-elevated-dark">
            <span className="text-gray-mid font-mono text-xs tracking-widest uppercase">Navigation</span>
          </div>

          <nav className="absolute top-[80px] bottom-[170px] md:bottom-[100px] left-0 right-0 flex flex-col justify-center px-10 md:px-16 gap-2">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={linkSlideVariants}
                className="overflow-hidden py-2"
              >
                <div
                  ref={(el) => { magnetRefs.current[i] = el; }}
                  onMouseMove={(e) => handleMagneticMouseMove(e, i)}
                  onMouseLeave={() => handleMagneticMouseLeave(i)}
                  className="inline-block"
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="group flex items-center gap-4 md:gap-6 text-left animate-link-row"
                  >
                    <span className="text-gray-mid font-mono text-xs md:text-sm transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[3.2rem] sm:text-[4rem] md:text-[5rem] font-black uppercase leading-none tracking-tight text-cream hover:text-accent transition-colors duration-300 flex overflow-hidden">
                      {link.name}
                    </span>
                    <span className="text-accent text-3xl md:text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      →
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </nav>

          <motion.div
            variants={metaVariants}
            className="absolute bottom-0 left-0 right-0 h-[170px] md:h-[100px] pl-20 pr-10 md:px-16 pt-6 pb-6 md:pb-10 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-end"
          >
            <div className="space-y-1 text-left">
              <p className="text-gray-mid font-mono text-xs uppercase tracking-widest mb-2">Get in Touch</p>
              <Magnetic strength={0.3}>
                <a
                  href="mailto:aitezazsikandar@gmail.com"
                  className="text-muted hover:text-white text-sm transition-colors duration-200"
                >
                  aitezazsikandar@gmail.com
                </a>
              </Magnetic>
            </div>

            <div className="flex gap-6 justify-start">
              {[
                { label: 'GitHub', href: 'https://github.com/aitezazdev' },
                { label: 'Source Code', href: 'https://github.com/aitezazdev/Portfolio' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/aitezaz-sikandar' },
              ].map((s) => (
                <Magnetic key={s.label} strength={0.3}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-mid hover:text-cream text-xs font-mono uppercase tracking-widest transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    {s.label}
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};


interface NavbarProps {
  hamburgerOnly?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hamburgerOnly = false }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;
  const lenis = lenisRef?.current;
  const { stage } = useTransitionState();
  const isTransitioning = stage === 'entering' || stage === 'leaving';

  useEffect(() => {
    if (hamburgerOnly) return;
    const isDone = typeof window !== 'undefined' && window.__preloaderDone === true;
    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;
    const mobileNav = mobileNavRef.current;

    if (isDone) {
      if (logo) gsap.set(logo, { y: 0, opacity: 1 });
      if (linksContainer) {
        const links = linksContainer.querySelectorAll('li');
        gsap.set(links, { y: 0, opacity: 1 });
      }
      if (mobileNav) gsap.set(mobileNav, { y: 0, opacity: 1 });
      setHasAnimated(true);
      return;
    }

    if (logo) gsap.set(logo, { y: -30, opacity: 0 });
    if (linksContainer) {
      const links = linksContainer.querySelectorAll('li');
      gsap.set(links, { y: -30, opacity: 0 });
    }
    if (mobileNav) gsap.set(mobileNav, { y: -30, opacity: 0 });

    const handlePreloaderComplete = () => {
      if (logo) {
        gsap.to(logo, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
      }
      if (linksContainer) {
        const links = linksContainer.querySelectorAll('li');
        gsap.to(links, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.15,
        });
      }
      if (mobileNav) {
        gsap.to(mobileNav, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
      }
      setHasAnimated(true);
    };

    window.addEventListener('preloaderComplete', handlePreloaderComplete);
    return () => window.removeEventListener('preloaderComplete', handlePreloaderComplete);
  }, [hamburgerOnly]);

  useEffect(() => {
    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    if (!hamburger) return;

    if (hamburgerOnly) {
      gsap.set(hamburger, { opacity: 1, scale: 1, pointerEvents: 'auto' });
      return;
    }

    const updateVisibility = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        gsap.set(hamburger, { opacity: 1, scale: 1, pointerEvents: 'auto' });
        if (mobileNav) gsap.set(mobileNav, { y: 0, opacity: 1 });
        return;
      }

      if (isMenuOpen) {
        gsap.to(hamburger, {
          opacity: 1,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          overwrite: 'auto',
        });
        return;
      }

      const aboutWrapper = document.getElementById('about-section-wrapper');
      let isPastHero = false;
      if (aboutWrapper) {
        const rect = aboutWrapper.getBoundingClientRect();
        isPastHero = rect.top <= 80;
      } else {
        const scrollY = window.scrollY || window.pageYOffset;
        isPastHero = scrollY > window.innerHeight * 0.8;
      }

      if (isPastHero) {
        if (nav) {
          gsap.to(nav, {
            y: -120,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        gsap.to(hamburger, {
          opacity: 1,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        if (nav) {
          gsap.to(nav, {
            y: 0,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        gsap.to(hamburger, {
          opacity: 0,
          scale: 0,
          pointerEvents: 'none',
          duration: 0.18,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }
    };

    updateVisibility();

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });

    if (lenis) {
      lenis.on('scroll', updateVisibility);
    }

    const scrollTrigger = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: () => updateVisibility(),
    });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      if (lenis) {
        lenis.off('scroll', updateVisibility);
      }
      scrollTrigger.kill();
    };
  }, [hamburgerOnly, isMenuOpen, hasAnimated, isTransitioning, lenis]);

  useEffect(() => {
    if (lenis) {
      if (isMenuOpen) {
        lenis.stop();
      } else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    }
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    document.body.classList.toggle('menu-open', isMenuOpen);
  }, [isMenuOpen, lenis]);

  useEffect(() => {
    if (isTransitioning && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isTransitioning, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = useHandleLinkClick(setIsMenuOpen);

  const links = [
    { name: 'Home', href: '/#top', menuOnly: true },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
  ];

  const navStyle: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    pointerEvents: isTransitioning ? 'none' : 'auto',
    transition: 'opacity 0.5s ease-in-out',
  };

  return (
    <>
      {!hamburgerOnly && (
        <nav
          ref={navRef}
          className="hidden md:block fixed w-full py-6 z-50 bg-cream"
          style={navStyle}
        >
          <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
            <NavbarBrand logoRef={logoRef} handleLinkClick={handleLinkClick} />
            <ul
              ref={linksContainerRef}
              className="flex gap-6 text-warm text-base font-sans font-medium uppercase tracking-wider"
            >
              {links.filter((l) => !l.menuOnly).map((link) => (
                <AnimatedLink key={link.href}>
                  <a
                    href={link.href}
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
        </nav>
      )}

      {!hamburgerOnly && (
        <nav
          ref={mobileNavRef}
          className="mobile-navbar md:hidden fixed w-full z-50 bg-cream/90 backdrop-blur-md border-b border-warm/10"
          style={navStyle}
        >
          <div className="flex justify-between items-center px-6 sm:px-8 h-20 w-full">
            <NavbarBrand handleLinkClick={handleLinkClick} />
            <div className="w-10 h-10" />
          </div>
        </nav>
      )}

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`fixed top-5 md:top-6 right-6 z-[9982] w-10 h-10 md:w-12 md:h-12 rounded-full
          bg-elevated ${!hamburgerOnly ? 'md:bg-gray-btn' : ''}
          flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="fullscreen-menu"
      >
        <AnimatedHamburger isOpen={isMenuOpen} />
      </button>

      <AnimatePresence mode="wait">
        {isMenuOpen && !isTransitioning && (
          <FullscreenMenu
            onClose={() => setIsMenuOpen(false)}
            handleLinkClick={handleLinkClick}
            links={links}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
