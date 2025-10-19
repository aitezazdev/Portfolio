"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";

const AnimatedButton = ({ topText, bottomText, variant = "dark" }) => {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  const bgColor = variant === "dark" ? "bg-[#2a2a2a]" : "bg-transparent";
  const textColor = variant === "dark" ? "text-white" : "text-[#2a2a2a]";
  const borderColor = variant === "light" ? "border-2 border-[#2a2a2a]" : "";

  const rippleColor =
    variant === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(42, 42, 42, 0.1)";

  const hoverBgColor =
    variant === "dark" ? "#3b3b3b" : "rgba(42, 42, 42, 0.05)";
  const originalBgColor = variant === "dark" ? "#2a2a2a" : "transparent";

  const handleMouseEnter = (e) => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;

    if (!button || !ripple) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    );

    const finalScale = (maxDistance * 2) / 100;

    gsap.set(ripple, {
      left: x,
      top: y,
      scale: 0,
      opacity: 1,
    });

    gsap.to(ripple, {
      scale: finalScale,
      opacity: 0.6,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(button, {
      backgroundColor: hoverBgColor,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;

    if (!button || !ripple) return;

    gsap.to(ripple, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(button, {
      backgroundColor: originalBgColor,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative text-sm outline-none overflow-hidden h-12 px-8 rounded-full ${bgColor} ${textColor} ${borderColor} group cursor-pointer font-medium`}>
        <span
          ref={rippleRef}
          className="absolute pointer-events-none rounded-full w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: rippleColor,
            opacity: 0,
          }}
        />

      <span className="flex items-center justify-center h-full transition-transform duration-400 ease-in-out group-hover:-translate-y-full relative z-10">
        {topText}
      </span>
      <span className="flex items-center justify-center h-full absolute inset-0 top-full transition-transform duration-400 ease-in-out group-hover:-translate-y-full z-10">
        {bottomText}
      </span>
    </button>
  );
};

export default AnimatedButton;