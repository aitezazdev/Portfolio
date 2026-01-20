'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import { useTransitionState } from 'next-transition-router';
import { useLenis } from './SmoothScrollProvider';
import AnimatedLink from './AnimateLink';
import { useHandleLinkClick } from '../../navigation';

gsap.registerPlugin(ScrollTrigger);

const MobileNavLink = ({ children, onClick }) => (
  <li className="cursor-pointer text-xl" onClick={onClick}>
    {children}
  </li>
);

const Navbar = ({ hamburgerOnly = false }) => {
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const mobileMenuRef = useRef(null);
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
        gsap.set(hamburgerRef.current, { opacity: 1, scale: 1 });
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

    gsap.set(nav, { y: -120 * scrollProgress, opacity: 1 });
    if (mobileNav) gsap.set(mobileNav, { y: -190 * scrollProgress, opacity: 1 });

    const servicesSection = document.querySelector('[class*="bg-black"]');
    if (servicesSection) {
      const servicesTop = servicesSection.getBoundingClientRect().top + scrollY;
      const shouldShowHamburger = scrollY >= servicesTop - 200;
      gsap.set(hamburger, {
        opacity: shouldShowHamburger ? 1 : 0,
        scale: shouldShowHamburger ? 1 : 0,
      });
    } else {
      gsap.set(hamburger, { opacity: 0, scale: 0 });
    }

    if (logo) {
      gsap.set(logo, { x: shouldHideNav ? 0 : -50, opacity: shouldHideNav ? 1 : 0 });
    }

    if (linksContainer) {
      const links = linksContainer.querySelectorAll('li');
      gsap.set(links, { y: shouldHideNav ? 0 : -20, opacity: shouldHideNav ? 1 : 0 });
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
        gsap.to(nav, { y: -120 * progress, duration: 0 });
        if (mobileNav) gsap.to(mobileNav, { y: -190 * progress, duration: 0 });
      },
    });

    const servicesSection = document.querySelector('[class*="bg-black"]');
    let servicesTrigger = null;

    if (servicesSection) {
      servicesTrigger = ScrollTrigger.create({
        trigger: servicesSection,
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
    }

    return () => {
      scrollTrigger.kill();
      if (servicesTrigger) servicesTrigger.kill();
    };
  }, [hasAnimated, hamburgerOnly, isTransitioning]);

  useEffect(() => {
    const mobileMenu = mobileMenuRef.current;
    if (!mobileMenu) return;

    if (isMenuOpen) {
      const menuItems = mobileMenu.querySelectorAll('li');
      gsap.fromTo(
        menuItems,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
        },
      );
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!lenis) return;
    if (isMenuOpen) lenis.stop();
    else lenis.start();
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
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
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
        className={`fixed top-6 right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full 
  bg-[#393632] ${!hamburgerOnly ? 'md:bg-[#524f4c]' : ''} 
  flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300`}
        style={
          hamburgerOnly
            ? { opacity: 1, scale: 1 }
            : {
                opacity: isTransitioning ? 0 : undefined,
                pointerEvents: isTransitioning ? 'none' : 'auto',
                transition: 'opacity 0.5s ease-in-out',
              }
        }
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
        ) : (
          <Menu className="w-6 h-6 md:w-7 md:h-7 text-white" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen && !isTransitioning
            ? 'backdrop-blur-sm bg-black/40'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-[#e8e8e3]/10 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out ${
            isMenuOpen && !isTransitioning ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <ul
              ref={mobileMenuRef}
              className="flex flex-col items-center gap-8 text-[#ffffff] text-5xl font-sans font-medium uppercase tracking-wide"
            >
              {links.map((link) => (
                <li key={link.href} className="text-xl">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className="cursor-pointer block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
