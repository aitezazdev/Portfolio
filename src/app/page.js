"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HomeBanner from "@/components/HomeBanner";
import Projects from "@/components/Projects";
import ReuniteBlack from "@/components/ReuniteBlack";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const homeRef = useRef(null);
  const reuniteRef = useRef(null);
  const techStackRef = useRef(null);
  const edgeLeft = useRef(null);
  const edgeRight = useRef(null);

  useEffect(() => {
    const home = homeRef.current;
    const reunite = reuniteRef.current;
    const techStack = techStackRef.current;
    const projects = document.querySelector("section");

    if (!home || !reunite || !techStack || !projects) return;

    gsap.set(reunite, { zIndex: 2 });
    gsap.set(home, { zIndex: 1, y: 0, opacity: 1 });
    gsap.set([edgeLeft.current, edgeRight.current], { opacity: 0, width: "0px" });

    gsap.timeline({
      scrollTrigger: {
        trigger: reunite,
        start: "top bottom",
        end: "top 33%",
        scrub: 1.2,
      },
    }).to(home, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      ease: "power2.out",
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: techStack,
        start: "top 60%",
        end: () => {
          const rect = projects.getBoundingClientRect();
          const scrollTop = window.scrollY || window.pageYOffset;
          const endPoint = rect.top + scrollTop - window.innerHeight * 0.2;
          return endPoint + "px";
        },
        scrub: true,
      },
    })
      .to(edgeLeft.current, { width: "30px", opacity: 1, ease: "none" })
      .to(edgeRight.current, { width: "30px", opacity: 1, ease: "none" }, "<");

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="relative">
      <div ref={homeRef} className="sticky top-0 left-0 w-full h-screen">
        <HomeBanner />
      </div>

      <div className="relative bg-black">
        <div
          ref={reuniteRef}
          className="relative z-10 bg-[#080807] min-h-screen overflow-hidden"
        >
          <div
            ref={edgeLeft}
            className="fixed left-0 top-0 h-full bg-white pointer-events-none"
          />
          <div
            ref={edgeRight}
            className="fixed right-0 top-0 h-full bg-white pointer-events-none"
          />

          <ReuniteBlack techStackRef={techStackRef} />
        </div>
      </div>

      <section className="relative z-20 bg-white text-black">
        <Projects />
      </section>
    </main>
  );
}
