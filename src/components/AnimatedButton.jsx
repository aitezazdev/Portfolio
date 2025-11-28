"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";

const AnimatedButton = ({
  onClick,
  topText,
  bottomText,
  variant = "dark",
  className = "",
}) => {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  let bgColor,
    textColor,
    borderColor,
    rippleColor,
    hoverBgColor,
    originalBgColor;

  switch (variant) {
    case "light":
      bgColor = "bg-transparent";
      textColor = "text-[#2a2a2a]";
      borderColor = "border-2 border-[#2a2a2a]";
      rippleColor = "rgba(42, 42, 42, 0.1)";
      hoverBgColor = "rgba(42, 42, 42, 0.05)";
      originalBgColor = "transparent";
      break;

    case "primary":
      bgColor = "bg-[#10b981]";
      textColor = "text-white";
      borderColor = "";
      rippleColor = "rgba(255,255,255,0.2)";
      hoverBgColor = "#0f9f6b";
      originalBgColor = "#10b981";
      break;

    case "dark":
    default:
      bgColor = "bg-[#2a2a2a]";
      textColor = "text-white";
      borderColor = "";
      rippleColor = "rgba(255, 255, 255, 0.15)";
      hoverBgColor = "#3b3b3b";
      originalBgColor = "#2a2a2a";
      break;
  }

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

    gsap.set(ripple, { left: x, top: y, scale: 0, opacity: 1 });
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
    <button  onClick={onClick}
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative text-sm outline-none overflow-hidden h-12 px-8 rounded-full ${bgColor} ${textColor} ${borderColor} group cursor-pointer font-medium ${className}`}>

      <span
        ref={rippleRef}
        className="absolute pointer-events-none rounded-full w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: rippleColor, opacity: 0 }}
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
