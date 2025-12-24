'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { Link } from 'next-transition-router';
// import Navbar from "@/components/Navbar";
import AnimatedHeading from '@/components/AnimateHeading';
import AnimateDescription from '@/components/AnimateDescription';
import AnimatedLink from '@/components/AnimateLink';
import { FaArrowUp } from 'react-icons/fa';
import Loading from './loading';
import { Scroll } from 'lucide-react';
import ScrollToTopOnEnter from '@/utils/ScrollToTopOnEnter';

export default function ProjectPage({ params }) {
  const { slug } = use(params);
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((res) => res.json())
      .then((data) => setProject(data));
  }, [slug]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!project) return <Loading />;

  return (
    <>
      {/* <Navbar hamburgerOnly={true} /> */}
      <ScrollToTopOnEnter />
      <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10">
        <Link href={sessionStorage.getItem('previous-project-url') || '/'}
          className="flex items-center gap-2 text-lg mb-12 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">←</span> Back
        </Link>

        <AnimatedHeading
          text={project.title}
          className="text-6xl md:text-7xl font-extrabold mb-6"
        />

        <div className="mb-8 mt-10">
          <strong className="opacity-100 text-xl font-bold">Tech Stack</strong>
          <AnimateDescription
            text={project.tech?.join(', ')}
            className="text-base sm:text-lg text-[#a29e9a] font-sans"
          />
        </div>

        <div className="leading-relaxed mb-14">
          <strong className="opacity-100 text-xl font-bold">Description</strong>
          <AnimateDescription
            text={project.description}
            className="text-base sm:text-lg text-[#a29e9a] font-sans"
          />
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

        <div className="relative flex justify-center items-center mt-auto py-8">
          <div className="text-center">
            <p className="text-[#a29e9a] text-lg">Have a project in mind?</p>
            <a
              href="mailto:aitezazsikandar@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-[#bab6b3] hover:text-[#d4d2d0] transition"
            >
              aitezazsikandar@gmail.com
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="absolute right-0 w-10 h-10 sm:w-10 sm:h-10 cursor-pointer rounded-full bg-[#6b645c] shadow flex items-center justify-center hover:bg-[#534e47] transition-all duration-300 focus:outline-none group"
          >
            <AnimatedLink className="flex items-center justify-center group-hover:animate">
              <FaArrowUp className="w-4 h-4 sm:w-4 sm:h-4 text-[#e8e8e3]" />
            </AnimatedLink>
          </button>
        </div>
      </section>
    </>
  );
}
