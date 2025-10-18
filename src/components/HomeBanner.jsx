"use client";

import React from "react";

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

const AnimatedButton = ({ topText, bottomText, variant = "dark" }) => {
  const bgColor = variant === "dark" ? "bg-[#2a2a2a]" : "bg-transparent";
  const textColor = variant === "dark" ? "text-white" : "text-[#2a2a2a]";
  const borderColor = variant === "light" ? "border-2 border-[#2a2a2a]" : "";

  return (
    <button
      className={`relative text-sm outline-none overflow-hidden h-12 px-8 rounded-full ${bgColor} ${textColor} ${borderColor} group cursor-pointer font-medium`}>
      <span className="flex items-center justify-center h-full transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
        {topText}
      </span>
      <span className="flex items-center justify-center h-full absolute inset-0 top-full transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
        {bottomText}
      </span>
    </button>
  );
};

const HomeBanner = () => {
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
        <h1 className="text-[9rem] font-bold leading-none tracking-tight mb-5 uppercase whitespace-nowrap">
          Aitezaz Sikandar
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
