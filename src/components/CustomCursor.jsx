"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const requestRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorTextEl = cursorTextRef.current;

    if (!cursorDot || !cursorOutline) return;

    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      return;
    }

    gsap.set([cursorDot, cursorOutline, cursorTextEl], {
      xPercent: -50,
      yPercent: -50,
    });

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * 0.1;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * 0.1;

      dotPos.current.x = mouse.current.x;
      dotPos.current.y = mouse.current.y;

      gsap.set(cursorDot, {
        x: dotPos.current.x,
        y: dotPos.current.y,
      });

      gsap.set([cursorOutline, cursorTextEl], {
        x: delayedMouse.current.x,
        y: delayedMouse.current.y,
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseEnter = (e) => {
      const target = e.currentTarget;
      const cursorType = target.getAttribute("data-cursor");

      gsap.to(cursorDot, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      if (cursorType === "view") {
        setCursorText("VIEW");
        gsap.to(cursorOutline, {
          scale: 2,
          borderWidth: 1,
          backgroundColor: "rgba(97, 92, 86, 0.1)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(cursorTextEl, {
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
        });
      } else if (cursorType === "drag") {
        setCursorText("DRAG");
        gsap.to(cursorOutline, {
          scale: 4,
          borderWidth: 1,
          backgroundColor: "rgba(97, 92, 86, 0.1)",
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(cursorTextEl, {
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
        });
      } else {
        gsap.to(cursorOutline, {
          scale: 2,
          backgroundColor: "rgba(97, 92, 86, 0.15)",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      setCursorText("");
      
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(cursorOutline, {
        scale: 1,
        borderWidth: 2,
        backgroundColor: "transparent",
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(cursorTextEl, {
        opacity: 0,
        duration: 0.2,
      });
    };

    const addListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor], input[type="submit"], [role="button"]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.style.cursor = "none";
      });

      return interactiveElements;
    };

    const elements = addListeners();

    const observer = new MutationObserver(() => {
      addListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      a, button {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000]"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      <div
        ref={cursorOutlineRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] w-12 h-12 border-2 border-[#615c56] rounded-full flex items-center justify-center"
      />

      <div
        ref={cursorTextRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] opacity-0"
      >
        <span className="text-[#615c56] text-[11px] font-bold tracking-[0.15em] select-none">
          {cursorText}
        </span>
      </div>
    </>
  );
}