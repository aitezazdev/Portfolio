"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NavLink = ({ children, onClick }) => (
  <li 
    className="relative overflow-hidden h-6 group cursor-pointer"
    onClick={onClick}
  >
    <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
      {children}
    </span>
    <span className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
      {children}
    </span>
  </li>
);

const MobileNavLink = ({ children, onClick }) => (
  <li 
    className="cursor-pointer"
    onClick={onClick}
  >
    {children}
  </li>
);

const Navbar = () => {
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    if (!nav || !hamburger) return;

    gsap.set(nav, { y: 0, opacity: 1 });
    gsap.set(hamburger, { opacity: 0, scale: 0 });

    ScrollTrigger.create({
      trigger: "body",
      start: "50px top",
      end: "bottom bottom",
      onEnter: () => {
        gsap.to(nav, {
          y: "-100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      },
      onLeaveBack: () => {
        gsap.to(nav, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        });
      },
    });

    const servicesSection = document.querySelector('[class*="bg-black"]');
    
    if (servicesSection) {
      gsap.timeline({
        scrollTrigger: {
          trigger: servicesSection,
          start: "top top",
          end: "top -200px",
          toggleActions: "play none none reset",
        },
      }).fromTo(
        hamburger,
        { opacity: 0, scale: 0, transformOrigin: "center" },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="flex fixed w-full justify-between items-center px-12 py-4 mb-16 bg-[#e8e8e3] z-50"
      >
        <strong className="text-[#6b645c] text-base font-sans tracking-wide font-medium cursor-pointer">
          Web Developer
        </strong>
        <ul className="flex gap-5 text-[#6b645c] text-sm font-sans font-medium uppercase tracking-wide">
          <NavLink>Services</NavLink>
          <NavLink>Work</NavLink>
          <NavLink>About</NavLink>
          <NavLink>Contact</NavLink>
        </ul>
      </nav>

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className="fixed top-6 right-8 z-50 w-12 h-12 rounded-full bg-[#e8e8e3] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-[#6b645c]" />
        ) : (
          <Menu className="w-6 h-6 text-[#6b645c]" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          isMenuOpen ? "backdrop-blur-sm bg-black/40" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-[#e8e8e3]/95 backdrop-blur-lg shadow-2xl transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <ul className="flex flex-col items-center gap-8 text-[#6b645c] text-3xl font-sans font-medium uppercase tracking-wide">
              <MobileNavLink onClick={toggleMenu}>Services</MobileNavLink>
              <MobileNavLink onClick={toggleMenu}>Work</MobileNavLink>
              <MobileNavLink onClick={toggleMenu}>About</MobileNavLink>
              <MobileNavLink onClick={toggleMenu}>Contact</MobileNavLink>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;