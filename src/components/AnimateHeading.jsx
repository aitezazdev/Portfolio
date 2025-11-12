import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeading = ({ text, className = "" }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = headingRef.current.querySelectorAll(".char");

      gsap.fromTo(
        chars,
        { opacity: 0, y: "100%" },
        {
          opacity: 1,
          y: "0%",
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 90%",
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden mb-8">
      <h2
        ref={headingRef}
        className={`font-display font-bold uppercase tracking-tighter ${className}`}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="char inline-block"
            style={{ opacity: 0 }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
      <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-transparent"></div>
    </div>
  );
};

export default AnimatedHeading;
