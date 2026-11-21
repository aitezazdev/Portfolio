'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  icon: string;
  level?: string;
  description?: string;
}

export interface StackCategory {
  id: string;
  title: string;
  label?: string;
  description?: string;
  technologies: TechItem[];
}

export const STACK_SECTIONS: StackCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    technologies: [
      { name: 'JavaScript', category: 'frontend', icon: '/Services/js.png' },
      { name: 'TypeScript', category: 'frontend', icon: '/Services/typescript.svg' },
      { name: 'React', category: 'frontend', icon: '/Services/react.png' },
      { name: 'Next.js', category: 'frontend', icon: '/Services/next.webp' },
      { name: 'Redux Toolkit', category: 'frontend', icon: '/Services/reduxtoolkit.svg' },
      { name: 'Tailwind CSS', category: 'frontend', icon: '/Services/tailwind.png' },
      { name: 'Bootstrap', category: 'frontend', icon: '/Services/bootstrap.svg' },
      { name: 'GSAP', category: 'frontend', icon: '/Services/gsap.png' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & real-time',
    technologies: [
      { name: 'Node.js', category: 'backend', icon: '/Services/node.png' },
      { name: 'Express.js', category: 'backend', icon: '/Services/express.png' },
      { name: 'Socket.io', category: 'backend', icon: '/Services/socketio.svg' },
      { name: 'Firebase', category: 'backend', icon: '/Services/firebase.svg' },
    ],
  },
  {
    id: 'database',
    title: 'Database & ORM',
    technologies: [
      { name: 'MongoDB', category: 'database', icon: '/Services/mongodb.svg' },
      { name: 'Mongoose', category: 'database', icon: '/Services/mongoose.svg' },
      { name: 'MySQL', category: 'database', icon: '/Services/mysql.svg' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & cloud',
    technologies: [
      { name: 'Docker', category: 'devops', icon: '/Services/docker.svg' },
      { name: 'GitHub Actions', category: 'devops', icon: '/Services/githubactions.svg' },
      { name: 'AWS', category: 'devops', icon: '/Services/aws.webp' },
      { name: 'Nginx', category: 'devops', icon: '/Services/nginx.svg' },
      { name: 'Linux', category: 'devops', icon: '/Services/linux.svg' },
    ],
  },
  {
    id: 'tools',
    title: 'AI, testing & tools',
    technologies: [
      { name: 'Gemini AI', category: 'tools', icon: '/Services/geminiai.svg' },
      { name: 'Jest', category: 'tools', icon: '/Services/jest.svg' },
      { name: 'Zod', category: 'tools', icon: '/Services/zod.svg' },
      { name: 'Stripe', category: 'tools', icon: '/Services/stripe.svg' },
      { name: 'Cloudinary', category: 'tools', icon: '/Services/cloudinary.svg' },
      { name: 'Git', category: 'tools', icon: '/Services/git.png' },
      { name: 'Postman', category: 'tools', icon: '/Services/postman-icon.svg' },
      { name: 'Figma', category: 'tools', icon: '/Services/figma.png' },
    ],
  },
];

const BENTO_SPAN: Record<string, string> = {
  frontend: 'md:col-span-12 lg:col-span-7',
  backend: 'md:col-span-6 lg:col-span-5',
  database: 'md:col-span-6 lg:col-span-5',
  devops: 'md:col-span-12 lg:col-span-7',
  tools: 'md:col-span-12',
};

const TechStack = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const reduced = useReducedMotion();

  const headingWords = [
    { t: 'What' },
    { t: 'I' },
    { t: 'reach', serif: true },
    { t: 'for' },
  ];
  const descriptionText =
    "These are the tools I use most often.";

  const filterOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & Real-Time' },
    { id: 'database', label: 'Database & ORM' },
    { id: 'devops', label: 'DevOps & Cloud' },
    { id: 'tools', label: 'AI, Testing & Tools' },
  ];

  const visibleSections =
    activeFilter === 'all'
      ? STACK_SECTIONS
      : STACK_SECTIONS.filter((sec) => sec.id === activeFilter);

  useGSAP(
    () => {
      if (reduced) return;
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const items = section.querySelectorAll('.tech-item');
        const title = titleRefs.current[index];

        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                end: 'top 70%',
                scrub: 0.5,
              },
            },
          );
        }

        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                end: 'top 70%',
                scrub: 0.5,
              },
            },
          );
        }
      });
    },
    { scope: containerRef, dependencies: [activeFilter, reduced] },
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [activeFilter]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        !window.matchMedia('(hover: hover)').matches)
    ) {
      return;
    }
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    gsap.to(img, { y: -3, scale: 1.12, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        !window.matchMedia('(hover: hover)').matches)
    ) {
      return;
    }
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    gsap.to(img, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <section
      ref={containerRef}
      id="tech-stack"
      className="bg-ink text-light pt-12 pb-16 md:pt-32 md:pb-20 rounded-b-4xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <AnimatedHeading
            words={headingWords}
            className="text-[clamp(2.5rem,7vw,6.5rem)] mb-4"
          />
          <ScrollWordReveal
            text={descriptionText}
            offset={['start 0.95', 'end 0.7']}
            className="text-base sm:text-lg md:text-xl text-gray-soft font-sans leading-relaxed"
          />
        </div>

        <div role="group" aria-label="Filter technologies by category" className="mb-12 flex flex-wrap gap-2 sm:gap-3 items-center">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(option.id)}
                className={`text-xs sm:text-sm font-mono tracking-wider px-3.5 py-2.5 sm:py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-cream text-ink border-cream font-semibold shadow-md'
                    : 'bg-elevated-dark/60 text-gray-soft border-white/10 hover:border-accent/40 hover:text-cream'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {visibleSections.map((stack, index) => (
            <div
              key={stack.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className={`relative overflow-hidden rounded-[1.75rem] md:rounded-[2rem] border border-surface-border bg-surface-card p-4 min-[400px]:p-5 sm:p-7 md:p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] ${
                activeFilter === 'all' ? BENTO_SPAN[stack.id] ?? 'md:col-span-6' : 'md:col-span-12'
              }`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative mb-6 flex items-end justify-between gap-4">
                <h3
                  ref={(el) => {
                    titleRefs.current[index] = el;
                  }}
                  className="text-2xl sm:text-3xl font-semibold text-cream tracking-[-0.035em] font-display leading-none"
                >
                  {stack.title}
                </h3>
                <span className="font-mono text-[11px] text-warm-light tracking-widest whitespace-nowrap">
                  {String(stack.technologies.length).padStart(2, '0')} tools
                </span>
              </div>

              <div className={`relative grid grid-cols-2 gap-2.5 ${activeFilter === 'all' && stack.id !== 'frontend' && stack.id !== 'devops' && stack.id !== 'tools' ? 'min-[540px]:grid-cols-3 md:grid-cols-2' : 'min-[540px]:grid-cols-3 xl:grid-cols-4'}`}>
                {stack.technologies.map((tech, i) => (
                  <div
                    key={i}
                    className="tech-item group flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-surface-float border border-white/[0.05] hover:border-accent/40 bg-surface/60"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-9 h-9 flex items-center justify-center relative flex-shrink-0">
                      <Image
                        src={tech.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="w-full h-full object-contain grayscale-[0.55] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
                      />
                    </div>
                    <p className="text-[13px] font-medium text-cream break-words leading-tight">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
