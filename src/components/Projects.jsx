"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "./AnimateHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const containerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
        if (data.length > 0 && window.innerWidth >= 768) {
          setSelectedProject(0);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    }
    fetchProjects();
  }, []);

  useGSAP(
    () => {
      if (window.innerWidth < 768) {
        setSelectedProject(null);
        return;
      }

      const handleMouseMove = (e) => {
        if (!containerRef.current || !imageContainerRef.current) return;
        if (window.innerWidth < 768) {
          setSelectedProject(null);
          return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageContainerRef.current.getBoundingClientRect();
        const offsetTop = e.clientY - containerRect.y;

        if (
          containerRect.y > e.clientY ||
          containerRect.bottom < e.clientY ||
          containerRect.x > e.clientX ||
          containerRect.right < e.clientX
        ) {
          return gsap.to(imageContainerRef.current, {
            duration: 0.3,
            opacity: 0,
          });
        }

        gsap.to(imageContainerRef.current, {
          y: offsetTop - imageRect.height / 2,
          duration: 1,
          opacity: 1,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef, dependencies: [projects] }
  );

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top 80%",
          toggleActions: "restart none none reverse",
          scrub: 1,
        },
      });

      tl.from(containerRef.current, {
        y: 150,
        opacity: 0,
      });
    },
    { scope: containerRef }
  );

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) {
      setSelectedProject(null);
      return;
    }
    setSelectedProject(index);
  };

  const handleProjectClick = (slug) => {
    gsap.set(".page-transition", { yPercent: 100 });
    gsap.set(".page-transition--inner", { yPercent: 100 });

    const tl = gsap.timeline();
    tl.to(".page-transition", {
      yPercent: 0,
      duration: 0.3,
    });

    tl.then(() => {
      router.push(`/projects/${slug}`);
    });
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full bg-[#e8e8e3] text-[#1a1a1a] overflow-hidden px-6 sm:px-8 md:px-12 py-12 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block mb-10 md:mb-20">
          <AnimatedHeading
            text="Selected Projects"
            className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl mt-8 md:mt-20 mb-3 md:mb-4"
          />
        </div>

        <div className="md:hidden mb-10 md:mb-20">
          <AnimatedHeading
            text="Projects"
            className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl mt-8 md:mt-20 mb-3 md:mb-4"
          />
        </div>

        <div className="group/projects relative" ref={containerRef}>
          {selectedProject !== null && (
            <div
              className="hidden md:block absolute right-20 top-0 z-[1] pointer-events-none w-[220px] sm:w-[280px] xl:w-[350px] opacity-0"
              ref={imageContainerRef}>
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm shadow-xl">
                {projects.map((project, index) => (
                  <Image
                    key={project.id}
                    src={project.hoverImage || project.images[0]}
                    alt={project.title}
                    width={300}
                    height={400}
                    className={`absolute inset-0 transition-all duration-500 w-full h-full object-cover object-top ${
                      index !== selectedProject ? "opacity-0" : ""
                    }`}
                    unoptimized
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-item group leading-none py-4 md:py-8 border-b border-gray-300 first:pt-0 last:pb-0 last:border-none md:group-hover/projects:opacity-30 md:hover:!opacity-100 transition-all duration-500 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleProjectClick(project.slug)}>
                {selectedProject === null && (
                  <div className="relative w-full mb-4 md:mb-8 overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={project.hoverImage || project.images[0]}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full object-cover object-top sm:object-top md:object-cover aspect-[3/2] bg-gray-100"
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex gap-3 md:gap-8 items-start">
                  <div className="font-mono text-gray-400 text-sm sm:text-base md:text-base lg:text-lg pt-1 md:pt-2 min-w-[2rem] md:min-w-[3rem]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold flex items-center gap-2 md:gap-4 transition-all duration-700 bg-gradient-to-r from-green-600 via-emerald-600 to-[#1a1a1a] from-[50%] to-[50%] bg-[length:200%] bg-right bg-clip-text text-transparent group-hover:bg-left mb-3 md:mb-4">
                      {project.title}
                      <span className="text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="md:w-7 md:h-7 lg:w-9 lg:h-9">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <path d="M10 14 21 3"></path>
                          <path d="M15 3h6v6"></path>
                        </svg>
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-full text-gray-700 text-xs sm:text-sm font-medium hover:border-green-500 hover:text-green-600 transition-all duration-300">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-300 rounded-full text-gray-500 text-xs sm:text-sm font-medium">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="page-transition fixed inset-0 bg-white z-50 pointer-events-none"
        style={{ transform: "translateY(100%)" }}>
        <div
          className="page-transition--inner h-full w-full"
          style={{ transform: "translateY(100%)" }}></div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_30%_50%,#00000015,transparent_70%)]" />
    </section>
  );
}
