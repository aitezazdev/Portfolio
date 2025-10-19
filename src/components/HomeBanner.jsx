"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import AnimatedButton from "./AnimatedButton";

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

const HomeBanner = () => {
  const nameRef = useRef(null);

  useEffect(() => {
    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll(".letter-wrapper");

      gsap.set(letters, { y: "100%", opacity: 0 });

      gsap.to(letters, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.3,
      });

      const handleMouseEnter = () => {
        letters.forEach((wrapper, index) => {
          const original = wrapper.querySelector(".letter-original");
          const duplicate = wrapper.querySelector(".letter-duplicate");

          const tl = gsap.timeline({ delay: index * 0.04 });

          tl.to(original, {
            y: "-100%",
            duration: 0.5,
            ease: "power3.out",
          }, 0).to(duplicate, {
            y: "-100%",
            duration: 0.5,
            ease: "power3.out",
          }, 0);
        });
      };

      const handleMouseLeave = () => {
        letters.forEach((wrapper, index) => {
          const original = wrapper.querySelector(".letter-original");
          const duplicate = wrapper.querySelector(".letter-duplicate");

          const tl = gsap.timeline({ delay: index * 0.04 });

          tl.to(original, {
            y: "0%",
            duration: 0.5,
            ease: "power3.out",
          }, 0).to(duplicate, {
            y: "0%",
            duration: 0.5,
            ease: "power3.out",
          }, 0);
        });
      };

      nameRef.current.addEventListener("mouseenter", handleMouseEnter);
      nameRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (nameRef.current) {
          nameRef.current.removeEventListener("mouseenter", handleMouseEnter);
          nameRef.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }
  }, []);

  const splitText = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{ display: "inline-block" }}
      >
        <span className="letter-original block">{char === " " ? "\u00A0" : char}</span>
        <span className="letter-duplicate block absolute top-full left-0 w-full">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#e8e8e3] px-12 py-6">
      <nav className="flex justify-between items-center mb-32">
        <strong className="text-2xl text-[#6b645c] font-bold tracking-tight cursor-pointer">Zaz.</strong>
        <ul className="flex gap-5 text-[#6b645c] text-base font-medium">
          <NavLink>Services</NavLink>
          <NavLink>Work</NavLink>
          <NavLink>About</NavLink>
          <NavLink>Contact</NavLink>
        </ul>
      </nav>

      <div className="max-w-7xl mx-auto">
        <h1
          ref={nameRef}
          className="text-[9rem] font-bold leading-none tracking-tight mb-5 uppercase whitespace-nowrap cursor-pointer"
        >
          {splitText("Aitezaz Sikandar")}
        </h1>

        <div className="flex justify-center items-center bg-[#e8e8e3] py-3 px-6">
          <div className="max-w-xl text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#393632] mb-4 tracking-tight">
              MERN Stack Developer
            </p>

            <p className="text-[#615c56] text-base sm:text-lg leading-relaxed mb-10">
              Crafting visually stunning and memorable web experiences with code
              and creativity
            </p>

            <div className="flex justify-center gap-4">
              <AnimatedButton
                topText="PROJECTS"
                bottomText="VIEW WORK →"
                variant="dark"
              />
              <AnimatedButton
                topText="CONTACT"
                bottomText="GET IN TOUCH →"
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
