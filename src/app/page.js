"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeBanner from "@/components/HomeBanner";
import Services from "@/components/Services";
import Projects from "@/components/Projects";

export default function Home() {
  const homeRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const home = homeRef.current;
    const services = servicesRef.current;

    if (!home || !services) return;

    gsap.set(services, { zIndex: 2 });
    gsap.set(home, { zIndex: 1, y: 0, opacity: 1 });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: services,
          start: "top bottom",
          end: "top 33%",
          scrub: 1.2,
        },
      })
      .to(home, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        ease: "power2.out",
      });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <main className="relative">
      <div ref={homeRef} className="sticky top-0 left-0 w-full h-screen">
        <HomeBanner />
      </div>

      <div ref={servicesRef} className="relative z-10 bg-black">
        <Services />
      </div>

      <section className="relative z-20 bg-white text-black">
        <Projects />
      </section>
    </main>
  );
}
