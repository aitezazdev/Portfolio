"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedButton from "./AnimatedButton";

const HomeBanner = () => {
  const nameRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);

  const splitText = (text) =>
    text.split("").map((char, idx) => (
      <span
        key={idx}
        className="letter-wrapper inline-block relative overflow-hidden"
        style={{ display: "inline-block" }}>
        <span className="letter-original block">
          {char === " " ? "\u00A0" : char}
        </span>
        <span className="letter-duplicate block absolute top-full left-0 w-full">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));

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
        letters.forEach((wrapper, idx) => {
          const original = wrapper.querySelector(".letter-original");
          const duplicate = wrapper.querySelector(".letter-duplicate");
          const tl = gsap.timeline({ delay: idx * 0.04 });
          tl.to(
            original,
            { y: "-100%", duration: 0.5, ease: "power3.out" },
            0
          ).to(duplicate, { y: "-100%", duration: 0.5, ease: "power3.out" }, 0);
        });
      };

      const handleMouseLeave = () => {
        letters.forEach((wrapper, idx) => {
          const original = wrapper.querySelector(".letter-original");
          const duplicate = wrapper.querySelector(".letter-duplicate");
          const tl = gsap.timeline({ delay: idx * 0.04 });
          tl.to(original, { y: "0%", duration: 0.5, ease: "power3.out" }, 0).to(
            duplicate,
            { y: "0%", duration: 0.5, ease: "power3.out" },
            0
          );
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

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.1, ease: "power3.out" });
    if (paragraphRef.current && buttonsRef.current) {
      tl.fromTo(
        paragraphRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      ).fromTo(
        buttonsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );
    }
  }, []);

  return (
    <div className="min-h-screen px-12 pt-32">
      <div className="max-w-7xl mx-auto">
        <h1
          ref={nameRef}
          className="font-display text-[9rem] text-center select-none font-bold leading-none mb-5 uppercase whitespace-nowrap cursor-pointer overflow-hidden">
          {splitText("Aitezaz Sikandar")}
        </h1>

        <div className="flex justify-center items-center bg-[#e8e8e3] py-3 px-6">
          <div className="max-w-xl text-center">
            {/* <p
              ref={stackRef}
              className="text-2xl sm:text-3xl font-bold text-[#393632] mb-4 tracking-tight"
            >
              MERN Stack Developer
            </p> */}

            <p
              ref={paragraphRef}
              className="text-[#615c56] font-sans text-base sm:text-lg leading-relaxed mb-10">
              Open to job opportunities worldwide. Passionate about building
              polished, intuitive, and thoughtful digital experiences that leave
              a mark.
            </p>

            <div ref={buttonsRef} className="flex justify-center gap-4">
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
