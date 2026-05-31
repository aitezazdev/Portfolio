'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const AnimateDescription = ({ text, className = '' }) => {
  const descRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = descRef.current.querySelectorAll('.word');
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: '100%',
        },
        {
          opacity: 1,
          y: '0%',
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={descRef} className={`overflow-hidden leading-relaxed ${className}`}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="word inline-block mr-2"
          style={{
            opacity: 0,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};
export default AnimateDescription;
