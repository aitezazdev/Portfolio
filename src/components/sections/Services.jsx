'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
gsap.registerPlugin(ScrollTrigger);
const Services = () => {
  const sectionRef = useRef(null);
  const servicesRef = useRef([]);
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const allSections = servicesRef.current.filter(Boolean);
      const pinOffset = 50;
      allSections.forEach((section, index) => {
        const offset = pinOffset + index * 100;
        ScrollTrigger.create({
          trigger: section,
          start: `top ${offset}px`,
          endTrigger: allSections[allSections.length - 1],
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  const headingText = 'What I Do';
  const descriptionText =
    "I specialize in building full-stack web applications that are fast, reliable, and user-friendly. With a solid foundation in both frontend and backend technologies, I help bring ideas to life whether it's for a business, a startup, or a product team.";
  const services = [
    {
      id: '01',
      title: 'Full Stack Development',
      description:
        'End-to-end development of modern web applications — from frontend interfaces to backend APIs. I build complete, maintainable, and scalable systems using the MERN stack and modern tooling.',
      items: [
        'MERN Stack (MongoDB, Express.js, React, Node.js)',
        'REST APIs & Integration',
        'Authentication & Authorization',
      ],
    },
    {
      id: '02',
      title: 'Frontend Development',
      description:
        'Crafting responsive, accessible, and elegant interfaces that deliver exceptional user experiences. I focus on clarity, performance, and seamless interaction across devices.',
      items: [
        'React, Next.js, TailwindCSS, GSAP',
        'Optimized Rendering & Animations',
        'Figma to Code Implementation',
      ],
    },
    {
      id: '03',
      title: 'Optimization & Performance',
      description:
        'Optimizing codebases, APIs, and assets for speed, scalability, and maintainability. I ensure your applications run efficiently with best practices in caching, SEO, and deployment.',
      items: [
        'Performance Tuning & Code Refactoring',
        'SEO & Accessibility Optimization',
        'Deployment (Vercel, AWS, Docker)',
      ],
    },
  ];
  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen bg-[#080807] text-[#d1d1c7] pt-5 md:pt-5 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-20">
          <AnimatedHeading
            text={headingText}
            className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl mt-6 md:mt-20 mb-3 md:mb-4"
          />

          <div className="grid md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-start-6 md:col-span-7 flex flex-col md:flex-row gap-3 md:gap-10">
              <span className="text-[#878481] uppercase text-sm md:text-base font-medium whitespace-nowrap">
                (Services)
              </span>

              <AnimateDescription
                text={descriptionText}
                className="max-w-2xl text-base sm:text-lg md:text-xl text-[#a29e9a] font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="relative pb-8 md:pb-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (servicesRef.current[index] = el)}
              className="bg-[#080807] pb-20 md:pb-64"
              style={{
                zIndex: index + 1,
              }}
            >
              <div className="grid md:grid-cols-12 gap-4 items-center pt-4 md:pt-8 border-t border-[#393632]">
                <h3 className="font-display md:col-span-9 md:col-start-2 text-[#d1d1c7] font-bold text-2xl sm:text-2xl md:text-4xl lg:text-5xl">
                  {service.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-12 gap-4 md:gap-8 pt-4 md:pt-6">
                <div className="md:col-span-7 md:col-start-6 space-y-4 md:space-y-6">
                  <p className="text-[#a29e9a] text-base sm:text-base md:text-lg lg:text-lg leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <div className="divide-y divide-[#393632]">
                    {service.items.map((item, i) => (
                      <div key={i} className="py-3 flex items-center gap-3 md:gap-4">
                        <span className="text-gray-500 text-xs md:text-sm font-mono">0{i + 1}</span>
                        <span className="text-base sm:text-base md:text-lg lg:text-xl font-bold font-sans">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;
