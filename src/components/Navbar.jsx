"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NavLink = ({ children }) => (
  <li className="relative overflow-hidden h-6 group cursor-pointer">
    <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
      {children}
    </span>
    <span className="block absolute top-full left-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
      {children}
    </span>
  </li>
);

const Navbar = () => {
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const ticking = useRef(false);
  const threshold = 10;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.set(nav, { y: 0, opacity: 1 });

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) < threshold) {
        ticking.current = false;
        return;
      }

      if (
        currentScrollY > lastScrollY.current &&
        !isHidden.current &&
        currentScrollY > 50
      ) {
        gsap.to(nav, {
          y: "-100%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
        isHidden.current = true;
      } else if (currentScrollY < lastScrollY.current && isHidden.current) {
        gsap.to(nav, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
        isHidden.current = false;
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="flex fixed w-full justify-between items-center px-12 py-4 mb-16 bg-[#e8e8e3] z-50">
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
  );
};

export default Navbar;
