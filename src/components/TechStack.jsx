"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STACK_SECTIONS = [
  {
    id: "frontend",
    title: "FRONTEND",
    technologies: [
      { name: "JavaScript", icon: "/Services/js.png" },
      { name: "React", icon: "/Services/react.png" },
      { name: "Next.js", icon: "/Services/next.webp" },
      { name: "Tailwind CSS", icon: "/Services/tailwind.png" },
      { name: "Bootstrap", icon: "/Services/bootstrap.svg" },
      { name: "Redux", icon: "/Services/redux.png" },
      { name: "GSAP", icon: "/Services/gsap.png" },
    ],
  },
  {
    id: "backend",
    title: "BACKEND",
    technologies: [
      { name: "Node.js", icon: "/Services/node.png" },
      { name: "Express.js", icon: "/Services/express.png" },
      { name: "Firebase", icon: "/Services/firebase.svg" },
    ],
  },
  {
    id: "database",
    title: "DATABASE",
    technologies: [
      { name: "MongoDB", icon: "/Services/mongodb.svg" },
      { name: "MySQL", icon: "/Services/mysql.svg" },
    ],
  },
  {
    id: "tools",
    title: "TOOLS",
    technologies: [
      { name: "Git", icon: "/Services/git.png" },
      { name: "AWS", icon: "/Services/aws.webp" },
      { name: "Docker", icon: "/Services/docker.svg" },
      { name: "Postman", icon: "/Services/postman-icon.svg" },
      { name: "Figma", icon: "/Services/figma.png" },
    ],
  },
];

const TechStack = () => {
  const sectionRefs = useRef([]);
  const titleRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const items = section.querySelectorAll(".tech-item");
      const title = titleRefs.current[index];

      gsap.fromTo(
        title,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top 75%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top 75%",
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleMouseEnter = (e) => {
    const img = e.currentTarget.querySelector("img");

    gsap.to(img, {
      rotation: 360,
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e) => {
    const img = e.currentTarget.querySelector("img");

    gsap.to(img, {
      rotation: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <section
      id="TechStack"
      className="bg-[#0a0a09] text-[#d1d1c7] pb-56 px-6 md:px-12 lg:px-20 overflow-hidden">
      <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-20">
        MY STACK /
      </h2>

      <div className="space-y-24">
        {STACK_SECTIONS.map((stack, index) => (
          <div
            key={stack.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="md:w-1/3">
              <h3
                ref={(el) => (titleRefs.current[index] = el)}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#bfbdb8] tracking-tight">
                {stack.title}
              </h3>
            </div>

            <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stack.technologies.map((tech, i) => (
                <div
                  key={i}
                  className="tech-item flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#1a1a18]/40"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 relative">
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm md:text-base font-mono font-medium text-[#d1d1c7]">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
