import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeading = ({ text, className = '' }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    const chars = headingRef.current.querySelectorAll('.char');
    
    gsap.fromTo(
      chars,
      { opacity: 0, y: '100%' },
      {
        opacity: 1,
        y: '0%',
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          once: true,
        },
      },
    );
    
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="mb-8">
      <div className="overflow-hidden">
        <h2
          ref={headingRef}
          className={`font-display font-bold uppercase tracking-tighter ${className}`}
        >
          {text.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split('').map((char, charIndex) => (
                <span 
                  key={`${wordIndex}-${charIndex}`} 
                  className="char inline-block" 
                  style={{ opacity: 0 }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-transparent mt-4"></div>
    </div>
  );
};

export default AnimatedHeading;