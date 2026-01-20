import React, { useState, useEffect } from 'react';
import AnimatedLink from './AnimateLink';
import { FaArrowUp } from 'react-icons/fa';
import { useHandleLinkClick } from '../lib/navigation';
import { useLenis } from './SmoothScrollProvider';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState('');
  const lenisRef = useLenis();
  const lenis = lenisRef?.current;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Karachi',
      });
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = useHandleLinkClick();

  const links = [
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
  ];

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#e8e8e3] px-6 sm:px-8 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          <div>
            <h3 className="text-[#6b645c] text-base sm:text-lg font-sans tracking-wide font-semibold mb-4 md:mb-6">
              Menu
            </h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-[#6b645c] text-xs sm:text-sm font-sans font-medium uppercase tracking-wide">
              {links.map((link) => (
                <AnimatedLink key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.name}
                  </a>
                </AnimatedLink>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#6b645c] text-base sm:text-lg font-sans tracking-wide font-semibold mb-4 md:mb-6">
              Socials
            </h3>
            <ul className="flex flex-col gap-3 sm:gap-4 text-[#6b645c] text-xs sm:text-sm font-sans font-medium uppercase tracking-wide">
              <AnimatedLink>
                <a
                  href="https://linkedin.com/in/aitezaz-sikandar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </a>
              </AnimatedLink>
              <AnimatedLink>
                <a href="https://instagram.com/ur_zaz" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </AnimatedLink>
              <AnimatedLink>
                <a href="https://github.com/aitezazdev" target="_blank" rel="noopener noreferrer">
                  Github
                </a>
              </AnimatedLink>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 mt-6 md:mt-0">
            <h3 className="text-[#6b645c] text-base sm:text-lg font-sans tracking-wide font-semibold mb-2 md:mb-6">
              Local Time
            </h3>
            <p className="text-[#6b645c] text-sm sm:text-base font-sans font-medium tracking-wide">
              {currentTime}, PST
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-full bg-[#6b645c] shadow flex items-center justify-center hover:bg-[#534e47] transition-all duration-300 group focus:outline-none"
          >
            <AnimatedLink className="flex items-center justify-center">
              <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#e8e8e3]" />
            </AnimatedLink>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
