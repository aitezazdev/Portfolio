'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTransitionState } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import AnimatedLink from '@/components/ui/AnimateLink';
import { useHandleLinkClick } from '@/lib/navigation';
gsap.registerPlugin(ScrollTrigger);
const AnimatedHamburger = ({ isOpen, hamburgerOnly }) => {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const hasInitRef = useRef(false);
  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!l1 || !l2) return;
    if (!hasInitRef.current) {
      hasInitRef.current = true;
      if (isOpen) {
        gsap.set(l1, {
          y: 4,
          rotation: 45,
        });
        gsap.set(l2, {
          y: -4,
          rotation: -45,
        });
      }
      return;
    }
    if (isOpen) {
      gsap.to(l1, {
        y: 4,
        rotation: 45,
        duration: 0.35,
        ease: 'power3.inOut',
      });
      gsap.to(l2, {
        y: -4,
        rotation: -45,
        duration: 0.35,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(l1, {
        y: 0,
        rotation: 0,
        duration: 0.35,
        ease: 'power3.inOut',
      });
      gsap.to(l2, {
        y: 0,
        rotation: 0,
        duration: 0.35,
        ease: 'power3.inOut',
      });
    }
  }, [isOpen]);
  return (
    <div className="flex flex-col items-center justify-center gap-[8px] w-5 h-5 md:w-6 md:h-6">
      <span
        ref={line1Ref}
        className="block w-full h-[2px] bg-white rounded-full"
        style={{
          transformOrigin: 'center',
        }}
      />
      <span
        ref={line2Ref}
        className="block w-full h-[2px] bg-white rounded-full"
        style={{
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};
const FullscreenMenu = ({ isOpen, isTransitioning, onClose, handleLinkClick, links }) => {
  const menuRef = useRef(null);
  const panelRef = useRef(null);
  const tlRef = useRef(null);
  const linksRef = useRef([]);
  const metaRef = useRef(null);
  const lineTopRef = useRef(null);
  const lineBotRef = useRef(null);
  const overlayRef = useRef(null);
  const magnetRefs = useRef([]);
  useEffect(() => {
    if (!menuRef.current) return;
    if (isOpen && !isTransitioning) {
      if (tlRef.current) tlRef.current.kill();
      gsap.set(panelRef.current, {
        display: 'flex',
      });
      gsap.set(overlayRef.current, {
        display: 'block',
      });
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.fromTo(
        overlayRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
        },
      );
      tl.fromTo(
        panelRef.current,
        {
          x: '100%',
        },
        {
          x: '0%',
          duration: 0.38,
          ease: 'power4.out',
        },
        '-=0.2',
      );
      tl.fromTo(
        lineTopRef.current,
        {
          scaleX: 0,
          transformOrigin: 'left',
        },
        {
          scaleX: 1,
          duration: 0.3,
          ease: 'power3.out',
        },
        '-=0.2',
      );
      tl.fromTo(
        lineBotRef.current,
        {
          scaleX: 0,
          transformOrigin: 'right',
        },
        {
          scaleX: 1,
          duration: 0.3,
          ease: 'power3.out',
        },
        '-=0.25',
      );
      linksRef.current.forEach((link, i) => {
        if (!link) return;
        const chars = link.querySelectorAll('.char');
        tl.fromTo(
          chars,
          {
            y: '120%',
            opacity: 0,
          },
          {
            y: '0%',
            opacity: 1,
            duration: 0.35,
            stagger: 0.015,
            ease: 'power4.out',
          },
          `-=${i === 0 ? 0.1 : 0.3}`,
        );
      });
      tl.fromTo(
        metaRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.22',
      );
    } else if (!isOpen) {
      if (tlRef.current) tlRef.current.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          if (panelRef.current)
            gsap.set(panelRef.current, {
              display: 'none',
            });
          if (overlayRef.current)
            gsap.set(overlayRef.current, {
              display: 'none',
            });
        },
      });
      tlRef.current = tl;
      tl.to(metaRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
      });
      linksRef.current.forEach((link, i) => {
        if (!link) return;
        const chars = link.querySelectorAll('.char');
        tl.to(
          chars,
          {
            y: '-120%',
            opacity: 0,
            duration: 0.18,
            stagger: 0.01,
            ease: 'power3.in',
          },
          i === 0 ? '-=0.05' : '-=0.15',
        );
      });
      tl.to(
        [lineTopRef.current, lineBotRef.current],
        {
          scaleX: 0,
          duration: 0.18,
          ease: 'power2.in',
        },
        '-=0.1',
      );
      tl.to(
        panelRef.current,
        {
          x: '100%',
          duration: 0.28,
          ease: 'power4.in',
        },
        '-=0.12',
      );
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.18,
        },
        '-=0.18',
      );
    }
  }, [isOpen, isTransitioning]);
  const handleMagneticMouseMove = (e, index) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    gsap.to(el, {
      x: dx,
      y: dy,
      duration: 0.4,
      ease: 'power2.out',
    });
  };
  const handleMagneticMouseLeave = (index) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };
  return (
    <div ref={menuRef}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9980] bg-black/60 backdrop-blur-sm"
        style={{
          display: 'none',
        }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full md:w-[55%] z-[9981] bg-[#0d0d0b] flex flex-col overflow-hidden"
        style={{
          display: 'none',
          transform: 'translateX(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={lineTopRef}
          className="absolute top-[72px] left-0 right-0 h-px bg-[#2a2a28]"
          style={{
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
        <div
          ref={lineBotRef}
          className="absolute bottom-[170px] md:bottom-[100px] left-0 right-0 h-px bg-[#2a2a28]"
          style={{
            transformOrigin: 'right',
            transform: 'scaleX(0)',
          }}
        />

        <div className="flex justify-between items-center px-10 h-20 border-b border-[#1a1a18]">
          <span className="text-[#4a4a48] font-mono text-xs tracking-widest uppercase">
            Navigation
          </span>
        </div>

        <nav className="absolute top-[80px] bottom-[170px] md:bottom-[100px] left-0 right-0 flex flex-col justify-center px-10 md:px-16 gap-2">
          {links.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => (linksRef.current[i] = el)}
              className="overflow-hidden py-2"
            >
              <div
                ref={(el) => (magnetRefs.current[i] = el)}
                onMouseMove={(e) => handleMagneticMouseMove(e, i)}
                onMouseLeave={() => handleMagneticMouseLeave(i)}
                className="inline-block"
              >
                <button
                  onClick={() => handleLinkClick(link.href)}
                  className="group flex items-center gap-4 md:gap-6 text-left animate-link-row"
                >
                  <span className="text-[#5a5a58] font-mono text-xs md:text-sm transition-colors duration-300 group-hover:text-[#10b981]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[3.2rem] sm:text-[4rem] md:text-[5rem] font-black uppercase leading-none tracking-tight text-[#e8e8e3] hover:text-[#10b981] transition-colors duration-300 flex overflow-hidden">
                    {link.name.split('').map((char, ci) => (
                      <span
                        key={ci}
                        className="char inline-block"
                        style={{
                          transform: 'translateY(120%)',
                          opacity: 0,
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </span>
                  <span className="text-[#10b981] text-3xl md:text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </nav>

        <div
          ref={metaRef}
          className="absolute bottom-0 left-0 right-0 h-[170px] md:h-[100px] px-10 md:px-16 pt-6 pb-6 md:pb-10 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-end"
          style={{
            opacity: 0,
          }}
        >
          <div className="space-y-1">
            <p className="text-[#4a4a48] font-mono text-xs uppercase tracking-widest mb-2">
              Get in Touch
            </p>
            <a
              href="mailto:aitezazsikandar@gmail.com"
              className="text-[#a29e9a] hover:text-white text-sm transition-colors duration-200"
            >
              aitezazsikandar@gmail.com
            </a>
          </div>

          <div className="flex gap-6">
            {[
              {
                label: 'GitHub',
                href: 'https://github.com/aitezazsk',
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/aitezazsikandar',
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4a4a48] hover:text-[#e8e8e3] text-xs font-mono uppercase tracking-widest transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const MobileNavLink = ({ children, onClick }) => (
  <li className="cursor-pointer text-xl" onClick={onClick}>
    {children}
  </li>
);
const Navbar = ({ hamburgerOnly = false }) => {
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const logoRef = useRef(null);
  const linksContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldHideNav, setShouldHideNav] = useState(false);
  const lenisRef = useLenis();
  const lenis = lenisRef?.current;
  const { stage, isReady } = useTransitionState();
  const isTransitioning = stage === 'entering' || stage === 'leaving';
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
    if (hamburgerOnly) return;
    const checkScrollPosition = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 80) {
        setShouldHideNav(true);
      } else {
        setShouldHideNav(false);
      }
    };
    checkScrollPosition();
    const timer = setTimeout(checkScrollPosition, 50);
    return () => clearTimeout(timer);
  }, [hamburgerOnly, isReady]);
  useEffect(() => {
    if (hamburgerOnly) {
      if (hamburgerRef.current) {
        gsap.set(hamburgerRef.current, {
          opacity: 1,
          scale: 1,
        });
      }
      return;
    }
    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;
    if (!nav || !hamburger) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollProgress = Math.min(scrollY / 80, 1);
    gsap.set(nav, {
      y: -120 * scrollProgress,
      opacity: 1,
    });
    if (mobileNav)
      gsap.set(mobileNav, {
        y: -190 * scrollProgress,
        opacity: 1,
      });
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      gsap.set(hamburger, {
        opacity: 1,
        scale: 1,
      });
    } else {
      const aboutWrapper = document.getElementById('about-section-wrapper');
      if (aboutWrapper) {
        const aboutTop = aboutWrapper.getBoundingClientRect().top + scrollY;
        const shouldShowHamburger = scrollY >= aboutTop;
        gsap.set(hamburger, {
          opacity: shouldShowHamburger ? 1 : 0,
          scale: shouldShowHamburger ? 1 : 0,
        });
      } else {
        gsap.set(hamburger, {
          opacity: 0,
          scale: 0,
        });
      }
    }
    if (logo) {
      gsap.set(logo, {
        x: shouldHideNav ? 0 : -50,
        opacity: shouldHideNav ? 1 : 0,
      });
    }
    if (linksContainer) {
      const links = linksContainer.querySelectorAll('li');
      gsap.set(links, {
        y: shouldHideNav ? 0 : -20,
        opacity: shouldHideNav ? 1 : 0,
      });
    }
  }, [hamburgerOnly, shouldHideNav]);
  useEffect(() => {
    if (hamburgerOnly) return;
    if (!preloaderComplete || !isReady || isTransitioning) return;
    if (hasAnimated) return;
    if (shouldHideNav) {
      setHasAnimated(true);
      return;
    }
    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;
    const animationTimer = setTimeout(() => {
      if (logo) {
        gsap.to(logo, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
        });
      }
      if (linksContainer) {
        const links = linksContainer.querySelectorAll('li');
        gsap.to(links, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'power2.out',
          delay: 0.5,
        });
      }
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(animationTimer);
  }, [preloaderComplete, isReady, hasAnimated, hamburgerOnly, isTransitioning, shouldHideNav]);
  useEffect(() => {
    if (hamburgerOnly) return;
    if (!hasAnimated || isTransitioning) return;
    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    if (!nav || !hamburger) return;
    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=80',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(nav, {
          y: -120 * progress,
          duration: 0,
        });
        if (mobileNav)
          gsap.to(mobileNav, {
            y: -190 * progress,
            duration: 0,
          });
      },
    });
    const isMobile = window.innerWidth < 768;
    const aboutWrapper = document.getElementById('about-section-wrapper');
    let aboutTrigger = null;
    if (aboutWrapper && !isMobile) {
      aboutTrigger = ScrollTrigger.create({
        trigger: aboutWrapper,
        start: 'top top',
        end: 'top -200px',
        onEnter: () => {
          gsap.to(hamburger, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          });
        },
        onLeaveBack: () => {
          gsap.to(hamburger, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: 'power2.in',
          });
        },
      });
    } else if (isMobile) {
      gsap.set(hamburger, {
        opacity: 1,
        scale: 1,
      });
    }
    return () => {
      scrollTrigger.kill();
      if (aboutTrigger) aboutTrigger.kill();
    };
  }, [hasAnimated, hamburgerOnly, isTransitioning]);
  useEffect(() => {
    if (!lenis) return;
    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
      ScrollTrigger.refresh();
    }
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen, lenis]);
  useEffect(() => {
    if (isTransitioning && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isTransitioning, isMenuOpen]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = useHandleLinkClick(setIsMenuOpen);
  const links = [
    {
      name: 'About',
      href: '/#about',
    },
    {
      name: 'Services',
      href: '/#services',
    },
    {
      name: 'Work',
      href: '/#projects',
    },
    {
      name: 'Contact',
      href: '/#contact',
    },
  ];
  const navStyle = {
    opacity: isTransitioning ? 0 : 1,
    pointerEvents: isTransitioning ? 'none' : 'auto',
    transition: 'opacity 0.5s ease-in-out',
  };
  return (
    <>
      {!hamburgerOnly && (
        <nav
          ref={navRef}
          className="hidden md:flex fixed w-full justify-between items-center px-12 py-4 mb-16 bg-[#e8e8e3] z-50"
          style={navStyle}
        >
          <strong
            ref={logoRef}
            className="text-[#6b645c] text-lg font-sans tracking-wide font-medium cursor-pointer"
          >
            Web Developer
          </strong>
          <ul
            ref={linksContainerRef}
            className="flex gap-5 text-[#6b645c] text-base font-sans font-medium uppercase tracking-wide"
          >
            {links.map((link) => (
              <AnimatedLink
                key={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
              >
                <a href={link.href}>{link.name}</a>
              </AnimatedLink>
            ))}
          </ul>
        </nav>
      )}

      {!hamburgerOnly && (
        <nav
          ref={mobileNavRef}
          className="mobile-navbar md:hidden fixed w-full z-50 bg-[#e8e8e3]"
          style={navStyle}
        >
          <div className="flex justify-between items-start px-4 py-4">
            <div className="flex flex-col">
              <strong className="text-[#6b645c] text-lg font-sans tracking-wide font-medium">
                Web Developer
              </strong>
            </div>
            <div className="flex flex-col items-end gap-3">
              <ul className="flex flex-col items-end gap-1 text-[#6b645c] text-sm font-sans">
                {links.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.name}
                  </MobileNavLink>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-[9982] w-10 h-10 md:w-12 md:h-12 rounded-full 
  bg-[#393632] ${!hamburgerOnly ? 'md:bg-[#524f4c]' : ''} 
  flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300`}
        style={
          hamburgerOnly
            ? {
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: isTransitioning ? 0 : 0,
                scale: isTransitioning ? 0 : 0,
                pointerEvents: isTransitioning ? 'none' : 'auto',
                transition: 'opacity 0.5s ease-in-out',
              }
        }
        aria-label="Toggle menu"
      >
        <AnimatedHamburger isOpen={isMenuOpen} hamburgerOnly={hamburgerOnly} />
      </button>

      <FullscreenMenu
        isOpen={isMenuOpen && !isTransitioning}
        isTransitioning={isTransitioning}
        onClose={() => setIsMenuOpen(false)}
        handleLinkClick={handleLinkClick}
        links={links}
      />
    </>
  );
};
export default Navbar;
