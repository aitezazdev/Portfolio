"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  // Mouse move animation for image following cursor
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

        // Hide image if cursor is outside container
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

  // Scroll trigger animation
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
    <section className="relative min-h-screen w-full bg-[#080807] text-white overflow-hidden px-4 sm:px-8 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-300 uppercase tracking-wider mb-4">
            Selected Projects
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-transparent"></div>
        </div>

        <div className="group/projects relative" ref={containerRef}>
          {/* Floating Image Container */}
          {selectedProject !== null && (
            <div
              className="hidden md:block absolute right-8 top-0 z-[1] pointer-events-none w-[280px] xl:w-[420px] opacity-0"
              ref={imageContainerRef}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-2xl border border-gray-800">
                {projects.map((project, index) => (
                  <Image
                    key={project.id}
                    src={project.hoverImage || project.images[0]}
                    alt={project.title}
                    width={420}
                    height={315}
                    className={`absolute inset-0 transition-all duration-500 w-full h-full object-contain bg-gray-900 ${
                      index !== selectedProject ? "opacity-0" : ""
                    }`}
                    unoptimized
                  />
                ))}
              </div>
            </div>
          )}

          {/* Project List */}
          <div className="flex flex-col">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-item group leading-none py-8 md:py-10 border-b border-gray-800 first:pt-0 last:pb-0 last:border-none md:group-hover/projects:opacity-30 md:hover:!opacity-100 transition-all duration-500 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleProjectClick(project.slug)}
              >
                {selectedProject === null && (
                  <div className="relative w-full mb-8 overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={project.hoverImage || project.images[0]}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full object-contain aspect-[3/2] bg-gray-900"
                      unoptimized
                    />
                  </div>
                )}

                <div className="flex gap-4 md:gap-8 items-start">
                  <div className="font-mono text-gray-600 text-base md:text-lg pt-2 min-w-[3rem]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold flex items-center gap-4 transition-all duration-700 bg-gradient-to-r from-green-400 via-emerald-300 to-white from-[50%] to-[50%] bg-[length:200%] bg-right bg-clip-text text-transparent group-hover:bg-left mb-4">
                      {project.title}
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="md:w-9 md:h-9"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <path d="M10 14 21 3"></path>
                          <path d="M15 3h6v6"></path>
                        </svg>
                      </span>
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-green-400 font-semibold text-sm">{project.year}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="text-gray-500 text-sm font-medium">View Project</span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-gray-300 text-xs md:text-sm font-medium hover:border-green-400 hover:text-green-400 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-gray-500 text-xs md:text-sm font-medium">
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

      {/* Page Transition Elements */}
      <div className="page-transition fixed inset-0 bg-black z-50 pointer-events-none" style={{ transform: "translateY(100%)" }}>
        <div className="page-transition--inner h-full w-full" style={{ transform: "translateY(100%)" }}></div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_30%_50%,#ffffff10,transparent_70%)]" />
    </section>
  );
}