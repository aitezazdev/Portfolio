"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HomeBanner from "@/components/HomeBanner";
import Projects from "@/components/Projects";
import ReuniteBlack from "@/components/ReuniteBlack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
const homeRef = useRef(null);
const reuniteRef = useRef(null);
const techStackRef = useRef(null);

useEffect(() => {
const home = homeRef.current;
const reunite = reuniteRef.current;
const techStack = techStackRef.current;
const projects = document.querySelector("section");

if (!home || !reunite || !techStack || !projects) return;

gsap.set(reunite, { zIndex: 2 });
gsap.set(home, { zIndex: 1, y: 0, opacity: 1, pointerEvents: "auto" });

gsap.timeline({
  scrollTrigger: {
    trigger: reunite,
    start: "top bottom",
    end: "top 33%",
    scrub: 1.2,
    onLeave: () => { home.style.pointerEvents = "none"; },
    onEnterBack: () => { home.style.pointerEvents = "auto"; },
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
}).to(techStack, {
  opacity: 1,
  y: 0,
  duration: 1,
});

return () => ScrollTrigger.getAll().forEach((t) => t.kill());

}, []);

return ( <main className="relative"> <section ref={homeRef} className="sticky top-0 left-0 w-full h-screen"> <HomeBanner /> </section>

  <div className="relative bg-black">
    <div
      ref={reuniteRef}
      className="relative z-10 bg-[#080807] min-h-screen overflow-hidden"
    >
      <ReuniteBlack techStackRef={techStackRef} />
    </div>
  </div>

  <section className="relative z-20 bg-white">
    <Projects />
  </section>

  <section className="relative bg-black">
    <Contact />
  </section>

  <Footer />
</main>

);
}
