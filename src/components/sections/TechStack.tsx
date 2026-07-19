'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';

const STACK_SECTIONS = [
  {
    id: 'frontend',
    title: 'FRONTEND',
    technologies: [
      { name: 'JavaScript', icon: '/Services/js.png' },
      { name: 'React', icon: '/Services/react.png' },
      { name: 'Next.js', icon: '/Services/next.webp' },
      { name: 'Tailwind CSS', icon: '/Services/tailwind.png' },
      { name: 'Bootstrap', icon: '/Services/bootstrap.svg' },
      { name: 'Redux', icon: '/Services/redux.png' },
      { name: 'GSAP', icon: '/Services/gsap.png' },
    ],
  },
  {
    id: 'backend',
    title: 'BACKEND',
    technologies: [
      { name: 'Node.js', icon: '/Services/node.png' },
      { name: 'Express.js', icon: '/Services/express.png' },
      { name: 'Firebase', icon: '/Services/firebase.svg' },
    ],
  },
  {
    id: 'database',
    title: 'DATABASE',
    technologies: [
      { name: 'MongoDB', icon: '/Services/mongodb.svg' },
      { name: 'MySQL', icon: '/Services/mysql.svg' },
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    technologies: [
      { name: 'Git', icon: '/Services/git.png' },
      { name: 'AWS', icon: '/Services/aws.webp' },
      { name: 'Docker', icon: '/Services/docker.svg' },
      { name: 'Postman', icon: '/Services/postman-icon.svg' },
      { name: 'Figma', icon: '/Services/figma.png' },
    ],
  },
];

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const headingText = 'My Tech Stack';
  const descriptionText =
    'A selection of technologies I use to design, build, and deploy full-stack web applications.';

  useGSAP(
    () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const items = section.querySelectorAll('.tech-item');
        const title = titleRefs.current[index];

        gsap.fromTo(
          title,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, stagger: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
      });
    },
    { scope: containerRef },
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    gsap.to(img, { rotation: 360, scale: 1.1, duration: 0.6, ease: 'power2.out' });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    gsap.to(img, { rotation: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' });
  };

  return (
    <section
      ref={containerRef}
      id="TechStack"
      className="bg-ink text-light py-24 md:py-32 rounded-b-4xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-14 hidden md:block">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
          />
          <AnimateDescription
            text={descriptionText}
            className="text-base sm:text-lg md:text-xl text-muted font-sans leading-relaxed"
          />
        </div>

        <div className="mb-10 md:hidden">
          <AnimatedHeading
            text="My Stack"
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
          />
        </div>

        <div className="space-y-24">
          {STACK_SECTIONS.map((stack, index) => (
            <div
              key={stack.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            >
              <h3
                ref={(el) => { titleRefs.current[index] = el; }}
                className="md:w-1/3 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#bfbdb8] tracking-tight font-display uppercase"
              >
                {stack.title}
              </h3>

              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {stack.technologies.map((tech, i) => (
                  <div
                    key={i}
                    className="tech-item flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-elevated-dark/40"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-10 h-10 flex items-center justify-center relative">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm sm:text-base md:text-base lg:text-lg font-mono font-medium text-light">
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
