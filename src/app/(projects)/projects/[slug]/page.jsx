"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function ProjectPage({ params }) {
  const { slug } = use(params);
  const [project, setProject] = useState(null);
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/projects");
  };

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!project) return <div className="p-10 text-white">Loading...</div>;

  return (
    <section className="min-h-screen px-6 md:px-32 lg:px-48 py-10 bg-[#0d0d0d] text-white">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-lg mb-12 hover:opacity-80 transition">
        <span className="text-2xl">←</span> Back
      </button>

      <h2 className="text-5xl font-display md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight">
        {project.title}
      </h2>

      <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 font-sans leading-relaxed mb-14">
        {project.description}
      </p>

      <div className="flex flex-col gap-8 mb-16">
        {project.images?.map((img, i) => (
          <a key={i} href={img} target="_blank" rel="noopener noreferrer">
            <img
              src={img}
              alt={project.title}
              className="w-full max-h-[500px] rounded-xl shadow-xl hover:opacity-90 transition object-cover"
            />
          </a>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {project.tech?.map((t) => (
          <span
            key={t}
            className="px-4 py-2 bg-white/10 border border-white/20 text-sm rounded-full">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
