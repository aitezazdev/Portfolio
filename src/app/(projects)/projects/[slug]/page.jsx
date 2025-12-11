"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useTransitionRouter } from "next-transition-router";
import gsap from "gsap";
import Navbar from "@/components/Navbar";

export default function ProjectPage({ params }) {
  const { slug } = use(params);
  const [project, setProject] = useState(null);
  const router = useTransitionRouter();

  const handleBack = () => {
    const prev = sessionStorage.getItem("previous-project-url") || "/projects";

    gsap.set(".page-transition", { yPercent: 100 });
    gsap.set(".page-transition--inner", { yPercent: 100 });

    const tl = gsap.timeline();
    tl.to(".page-transition", {
      yPercent: 0,
      duration: 0.3,
    });

    tl.then(() => {
      router.push(prev);
    });
  };

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((res) => res.json())
      .then((data) => setProject(data));
  }, [slug]);

  if (!project) return <div className="p-10 text-white">Loading...</div>;

  return (
    <>
      <Navbar hamburgerOnly={true} />

      <section className="min-h-screen bg-[#0d0d0d] text-white px-6 md:px-48 py-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-lg mb-12 hover:opacity-80 transition-opacity">
          <span className="text-2xl">←</span> Back
        </button>

        <h2 className="text-6xl md:text-7xl font-extrabold mb-6">
          {project.title}
        </h2>

        <div className="mb-8 mt-10">
          <strong className="opacity-100 text-xl font-bold">Tech Stack</strong>
          <p className="text-base sm:text-lg text-[#a29e9a] font-sans">{project.tech?.join(", ")}</p>
        </div>

        <div className="leading-relaxed mb-14">
          <strong className="opacity-100 text-xl font-bold">Description</strong>
          <p className="text-base sm:text-lg text-[#a29e9a] font-sans">{project.description}</p>
        </div>

        <div className="flex flex-col gap-8 mb-16">
          {project.images?.map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full max-h-[500px] rounded-xl shadow-xl object-cover"
              />
            </a>
          ))}
        </div>
      </section>

      <div
        className="page-transition fixed inset-0 bg-white z-50 pointer-events-none"
        style={{ transform: "translateY(100%)" }}>
        <div
          className="page-transition--inner h-full w-full"
          style={{ transform: "translateY(100%)" }}></div>
      </div>
    </>
  );
}
