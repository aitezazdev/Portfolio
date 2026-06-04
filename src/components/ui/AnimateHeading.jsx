import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const AnimatedHeading = ({ text, className = '' }) => {
  const headingRef = useRef(null);
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    let intervalId = null;
    const scrambleText = (targetEl, finalText, duration = 400) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01';
      const steps = Math.floor(duration / 50);
      let step = 0;
      intervalId = setInterval(() => {
        targetEl.textContent = finalText
          .split('')
          .map((char, i) => {
            if (i < (step / steps) * finalText.length) return char;
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        step++;
        if (step > steps) {
          clearInterval(intervalId);
          targetEl.textContent = finalText;
        }
      }, 50);
    };
    gsap.set(el, {
      opacity: 0,
      y: '30px',
    });
    const triggerInstance = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        scrambleText(el, text, 400);
        gsap.to(el, {
          opacity: 1,
          y: '0px',
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      triggerInstance.kill();
    };
  }, [text]);
  return (
    <div className="mb-8">
      <div className="overflow-hidden">
        <h2
          ref={headingRef}
          className={`font-display font-bold uppercase tracking-tighter ${className}`}
          style={{
            opacity: 0,
          }}
        >
          {text}
        </h2>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-transparent mt-1"></div>
    </div>
  );
};
export default AnimatedHeading;
