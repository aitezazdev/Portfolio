'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const allSections = servicesRef.current.filter(Boolean) as HTMLDivElement[];
      const pinOffset = 50;
      allSections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top ${pinOffset + index * 120}px`,
          endTrigger: allSections[allSections.length - 1],
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });
      });
    }, sectionRef);
    return () => mm.revert();
  }, []);

  const headingWords = [
    { t: 'How' },
    { t: 'I' },
    { t: 'work', serif: true },
  ];
  const descriptionText =
    "I can take a project from an empty folder to a live website, and look after the frontend, the backend, the database and the deployment along the way.";

  const services = [
    {
      id: '01',
      title: 'Full Stack Development',
      aside: 'From an empty folder to a live site.',
      description:
        'I build the whole application myself. React or Next.js for what people see, Node and Express for the logic behind it, and MongoDB to hold the data. Logins and APIs are part of the job too.',
      items: [
        'MERN apps, start to finish',
        'REST APIs and real-time with Socket.io',
        'Login with JWT, refresh tokens and role-based access',
      ],
    },
    {
      id: '02',
      title: 'Frontend Engineering',
      aside: 'Quick, and kind to small screens.',
      description:
        'I make pages that feel quick and still work well on a small phone. I also think about the moments people forget, like an empty list, a slow connection, or someone using only a keyboard.',
      items: [
        'React, Next.js, Tailwind and GSAP',
        'Optimistic updates, so clicks feel instant',
        'Figma designs turned into working code',
      ],
    },
    {
      id: '03',
      title: 'Reliability & Performance',
      aside: 'Built to keep going when something fails.',
      description:
        "I care about apps staying up. If a service fails, there should be a backup plan. I add caching where it helps and set up deployment so it runs without me watching it.",
      items: [
        'Fallbacks and circuit breakers for flaky services',
        'SEO and accessibility checks',
        'Docker, GitHub Actions, Vercel and AWS EC2',
      ],
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen bg-ink text-light pt-20 pb-10 md:pt-32 md:pb-20 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <AnimatedHeading
            words={headingWords}
            className="text-[clamp(2.5rem,7vw,6.5rem)] mb-4"
          />

          <div className="grid md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-start-6 md:col-span-7 flex flex-col md:flex-row gap-3 md:gap-10">

              <ScrollWordReveal
                text={descriptionText}
                offset={['start 0.95', 'end 0.65']}
                className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-soft font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="relative pb-0 md:pb-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                servicesRef.current[index] = el;
              }}
              className="mb-6 md:mb-24 rounded-[2rem] md:rounded-[2.5rem] bg-surface-card border border-surface-border p-6 sm:p-8 md:px-12 md:pt-8 md:pb-12 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
              style={{ zIndex: index + 1 }}
            >
              <div className="grid md:grid-cols-12 gap-4 items-center pb-4 md:pb-0 md:h-14">
                <h3
                  className="font-display md:col-span-10 text-light font-semibold tracking-[-0.035em] text-2xl md:text-4xl lg:text-5xl leading-none"
                  
                >
                  {service.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-12 gap-4 md:gap-8 pt-4 md:pt-10">
                <p aria-hidden="true" className="hidden md:block md:col-span-4 serif-accent text-accent text-3xl lg:text-[2.6rem] leading-[1.1] pr-6">
                  {service.aside}
                </p>
                <div className="md:col-span-7 md:col-start-6 space-y-4 md:space-y-6">
                  <ScrollWordReveal
                    text={service.description}
                    offset={['start 0.95', 'end 0.7']}
                    className="text-gray-soft text-base sm:text-base md:text-lg leading-relaxed font-sans"
                  />

                  <div className="divide-y divide-border-subtle">
                    {service.items.map((item, i) => (
                      <div key={i} className="py-3 flex items-center gap-3 md:gap-4">
                        <span aria-hidden="true" className="text-accent text-[9px] shrink-0">
                          ◆
                        </span>
                        <span className="text-base md:text-lg font-medium font-sans text-light">
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
