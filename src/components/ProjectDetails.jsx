'use client';

import { Link } from 'next-transition-router';
import AnimatedHeading from '@/components/AnimateHeading';
import AnimateDescription from '@/components/AnimateDescription';
import AnimatedLink from '@/components/AnimateLink';
import { FaArrowUp, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import ScrollToTopOnEnter from '@/utils/ScrollToTopOnEnter';

export default function ProjectDetails({ project }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ScrollToTopOnEnter />

      <section className="min-h-screen bg-[#080807] text-white px-6 md:px-48 py-10">
        <Link
          href={sessionStorage.getItem('previous-project-url') || '/'}
          className="inline-flex items-center gap-3 text-[#a29e9a] hover:text-white transition-all duration-300 group mb-12"
        >
          <span className="text-2xl transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="text-lg font-medium">Back</span>
        </Link>

        <div className="mb-6">
          <div className="flex items-start justify-between gap-6 mb-6 md:mb-0">
            <AnimatedHeading
              text={project.title}
              className="text-5xl md:text-7xl font-extrabold flex-1"
            />

            <div className="hidden md:flex gap-4 pt-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                  aria-label="GitHub Repository"
                >
                  <FaGithub className="text-2xl" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                  aria-label="Live Demo"
                >
                  <FaExternalLinkAlt className="text-xl" />
                </a>
              )}
            </div>
          </div>

          <div className="flex md:hidden gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                aria-label="GitHub Repository"
              >
                <FaGithub className="text-xl" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center text-[#a29e9a] hover:text-white hover:border-[#3a3a38] hover:bg-[#252523] transition-all duration-300"
                aria-label="Live Demo"
              >
                <FaExternalLinkAlt className="text-lg" />
              </a>
            )}
          </div>
        </div>

        <div className="mb-8 mt-4">
          <strong className="text-xl font-bold">Tech Stack</strong>
          <AnimateDescription
            text={project.tech?.join(', ')}
            className="text-base sm:text-lg text-[#a29e9a] font-sans"
          />
        </div>

        <div className="mb-8">
          <strong className="text-xl font-bold">Description</strong>
          <AnimateDescription
            text={project.description}
            className="text-base sm:text-lg text-[#a29e9a] font-sans"
          />
        </div>

        {project.myRole?.length > 0 && (
          <div className="mb-14">
            <strong className="text-xl font-bold">My Role</strong>
            <ul className="list-disc list-inside text-[#a29e9a] font-sans mt-2 space-y-2">
              {project.myRole.map((role, i) => (
                <li key={i} className="text-base sm:text-lg">
                  {role}
                </li>
              ))}
            </ul>
          </div>
        )}

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

        <div className="relative flex justify-center py-8">
          <div className="text-center">
            <p className="text-[#a29e9a] text-lg">Have a project in mind?</p>
            <a
              href="mailto:aitezazsikandar@gmail.com"
              className="text-xl font-semibold text-[#bab6b3] hover:text-[#d4d2d0] transition"
            >
              aitezazsikandar@gmail.com
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="absolute right-0 w-10 h-10 rounded-full bg-[#6b645c] shadow flex items-center justify-center hover:bg-[#534e47] transition"
          >
            <AnimatedLink>
              <FaArrowUp className="w-4 h-4 text-[#e8e8e3]" />
            </AnimatedLink>
          </button>
        </div>
      </section>
    </>
  );
}