import React, { useState, useEffect } from "react";
import AnimatedLink from "./AnimateLink";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Karachi",
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#e8e8e3] px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-[#6b645c] text-base font-sans tracking-wide font-semibold mb-6">
              Menu
            </h3>
            <ul className="flex flex-col gap-4 text-[#6b645c] text-sm font-sans font-medium uppercase tracking-wide">
              <AnimatedLink>Home</AnimatedLink>
              <AnimatedLink>Services</AnimatedLink>
              <AnimatedLink>Works</AnimatedLink>
              <AnimatedLink>About</AnimatedLink>
              <AnimatedLink>Contact</AnimatedLink>
            </ul>
          </div>

          <div>
            <h3 className="text-[#6b645c] text-base font-sans tracking-wide font-semibold mb-6">
              Socials
            </h3>
            <ul className="flex flex-col gap-4 text-[#6b645c] text-sm font-sans font-medium uppercase tracking-wide">
              <AnimatedLink>
                <a
                  href="https://linkedin.com/aitezaz-sikandar"
                  target="_blank"
                  rel="noopener noreferrer">
                  Linkedin
                </a>
              </AnimatedLink>
              <AnimatedLink>
                <a
                  href="https://instagram.com/ur_zaz"
                  target="_blank"
                  rel="noopener noreferrer">
                  Instagram
                </a>
              </AnimatedLink>
              <AnimatedLink>
                <a
                  href="https://github.com/aitezazdev"
                  target="_blank"
                  rel="noopener noreferrer">
                  Github
                </a>
              </AnimatedLink>
            </ul>
          </div>

          <div>
            <h3 className="text-[#6b645c] text-base font-sans tracking-wide font-semibold mb-6">
              Local Time
            </h3>
            <p className="text-[#6b645c] text-sm font-sans font-medium tracking-wide">
              {currentTime}, PST
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={scrollToTop}
            className="w-16 h-16 cursor-pointer rounded-full bg-[#6b645c] shadow flex items-center justify-center hover:bg-[#534e47] transition-all duration-300 group focus:outline-none"
            aria-label="Scroll to top">
            <AnimatedLink>
              <FaArrowUp className="w-5 h-7 text-[#e8e8e3] transform transition-transform duration-300 drop-shadow-sm" />
            </AnimatedLink>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
