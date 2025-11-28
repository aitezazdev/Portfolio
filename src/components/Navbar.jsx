"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import { useLenis } from "./SmoothScrollProvider";
import AnimatedLink from "./AnimateLink";

gsap.registerPlugin(ScrollTrigger);

const MobileNavLink = ({ children, onClick }) => (
  <li className="cursor-pointer text-xl" onClick={onClick}>
    {children}
  </li>
);

const Navbar = () => {
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenisRef = useLenis();
  const lenis = lenisRef?.current;

  useEffect(() => {
    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    if (!nav || !hamburger) return;

    gsap.set(nav, { y: 0 });
    gsap.set(hamburger, { opacity: 0, scale: 0 });
    if (mobileNav) gsap.set(mobileNav, { y: 0 });

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "+=80",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(nav, {
          y: -120 * progress,
          duration: 0,
        });
        if (mobileNav) {
          gsap.to(mobileNav, {
            y: -180 * progress,
            duration: 0,
          });
        }
      },
    });

    const servicesSection = document.querySelector('[class*="bg-black"]');

    if (servicesSection) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: servicesSection,
            start: "top top",
            end: "top -200px",
            toggleActions: "play none none reset",
          },
        })
        .fromTo(
          hamburger,
          { opacity: 0, scale: 0, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }

    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen, lenis]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="hidden md:flex fixed w-full justify-between items-center px-12 py-4 mb-16 bg-[#e8e8e3] z-50">
        <strong className="text-[#6b645c] text-lg font-sans tracking-wide font-medium cursor-pointer">
          Web Developer
        </strong>
        <ul className="flex gap-5 text-[#6b645c] text-base font-sans font-medium uppercase tracking-wide">
          <AnimatedLink onClick={() => handleScroll("about")}>
            About
          </AnimatedLink>
          <AnimatedLink onClick={() => handleScroll("services")}>
            Services
          </AnimatedLink>
          <AnimatedLink onClick={() => handleScroll("projects")}>
            Work
          </AnimatedLink>
          <AnimatedLink onClick={() => handleScroll("contact")}>
            Contact
          </AnimatedLink>
        </ul>
      </nav>

      <nav
        ref={mobileNavRef}
        className="mobile-navbar md:hidden fixed w-full z-50 bg-[#e8e8e3]">
        <div className="flex justify-between items-start px-6 py-6">
          <div className="flex flex-col">
            <strong className="text-[#6b645c] text-lg font-sans tracking-wide font-medium">
              Web Developer
            </strong>
          </div>

          <div className="flex flex-col items-end gap-3">
            <ul className="flex flex-col items-end gap-2 text-[#6b645c] text-base font-sans font-medium">
              <li
                onClick={() => handleScroll("about")}
                className="cursor-pointer">
                About
              </li>
              <li
                onClick={() => handleScroll("services")}
                className="cursor-pointer">
                Services
              </li>
              <li
                onClick={() => handleScroll("projects")}
                className="cursor-pointer">
                Work
              </li>
              <li
                onClick={() => handleScroll("contact")}
                className="cursor-pointer">
                Contact
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#393632] md:bg-[#e8e8e3] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Toggle menu">
        {isMenuOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7 text-white md:text-[#6b645c]" />
        ) : (
          <Menu className="w-6 h-6 md:w-7 md:h-7 text-white md:text-[#6b645c]" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "backdrop-blur-sm bg-black/40"
            : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMenu}>
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-[#e8e8e3]/10 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <ul className="flex flex-col items-center gap-8 text-[#ffffff] text-5xl font-sans font-medium uppercase tracking-wide">
              <MobileNavLink
                onClick={() => {
                  toggleMenu();
                  handleScroll("about");
                }}>
                About
              </MobileNavLink>
              <MobileNavLink
                onClick={() => {
                  toggleMenu();
                  handleScroll("services");
                }}>
                Services
              </MobileNavLink>
              <MobileNavLink
                onClick={() => {
                  toggleMenu();
                  handleScroll("projects");
                }}>
                Work
              </MobileNavLink>
              <MobileNavLink
                onClick={() => {
                  toggleMenu();
                  handleScroll("contact");
                }}>
                Contact
              </MobileNavLink>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
