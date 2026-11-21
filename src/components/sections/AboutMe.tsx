'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import ScrollWordReveal from '@/components/ui/ScrollWordReveal';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import FlowField from '@/components/canvas/FlowField';

const CREDENTIALS = [
  {
    year: '2026',
    title: 'MERN Stack Intern',
    organization: 'e-strats, Islamabad',
    type: 'Industry',
  },
  {
    year: '2026',
    title: 'HEC National Skills Competency Test (NSCT)',
    organization: 'HEC, PSEB & P@SHA',
    stat: '95th percentile',
    type: 'Recognition',
  },
  {
    year: '2024-25',
    title: 'Web and Mobile App Development',
    organization: 'Saylani Mass IT Training (SMIT), Peshawar',
    stat: 'Full-Stack MERN, TypeScript, Next.js & Hybrid Apps',
    type: 'Certification',
  },
  {
    year: '2022-26',
    title: 'BS Computer Science',
    organization: 'University of Peshawar',
    stat: '3.65 / 4.00 GPA',
    type: 'Education',
  },
];

const About = () => {
  const headingWords = [
    { t: "Who's" },
    { t: 'behind', serif: true },
    { t: 'the' },
    { t: 'code' },
  ];
  const descriptionText =
    "A developer from Pakistan who likes building things that real people use every day.";
  const aboutMeText = `Hello, I am Aitezaz. I am a web developer from Pakistan. I studied computer science at the University of Peshawar, and alongside it I spent a year at SMIT learning the MERN stack by building things, mostly small at first and then not so small.\n\nMost of what I know came from watching my own projects break and then fixing them. A classroom where every student has to see the same slide at the same moment. A clinic where two patients can never book the same slot. A shop that keeps working even when its database does not. I like problems like these, where someone is waiting on the other side of the screen.\n\nLately I have been working as an intern at e-strats in Islamabad, writing MERN code alongside a team. I am open to work anywhere in the world, so if you have something to build or a team that needs another developer, I would love to hear about it.`;

  const sectionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.about-image-wrapper',
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about-image-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      const rows = gsap.utils.toArray<HTMLElement>('.cred-row');
      rows.forEach((row, i) => {
        const side = row.dataset.side === 'left' ? -1 : 1;
        const dot = row.querySelector('.timeline-dot');
        const connector = row.querySelector('.timeline-connector');
        const content = row.querySelector('.timeline-content');
        gsap.fromTo(
          row,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            delay: i * 0.07,
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              once: true,
            },
          },
        );
        if (content) {
          gsap.fromTo(
            content,
            { x: side * 42, y: 18 },
            {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 87%',
                once: true,
              },
            },
          );
        }
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.45,
              ease: 'back.out(2.5)',
              delay: 0.18,
              scrollTrigger: {
                trigger: row,
                start: 'top 87%',
                once: true,
              },
            },
          );
        }
        if (connector) {
          gsap.fromTo(
            connector,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.55,
              delay: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 87%',
                once: true,
              },
            },
          );
        }
      });

      const experienceWords = gsap.utils.toArray<HTMLElement>('.experience-word > span');
      if (experienceWords.length) {
        gsap.fromTo(
          experienceWords,
          { yPercent: 120, rotate: 3 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 82%',
              once: true,
            },
          },
        );
      }

      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div className="bg-cream">
      <section
        ref={sectionRef}
        id="about"
        className="min-h-screen bg-ink text-light pt-24 pb-20 md:pt-32 md:pb-28 rounded-t-4xl overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mb-10 md:mb-20">
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

          <div className="grid grid-cols-12 gap-6 md:gap-8 pb-16 md:pb-24 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-5 flex items-center justify-center">
              <div className="about-image-wrapper relative group w-full max-w-[350px] md:max-w-[380px] h-[360px] md:h-[480px] bg-elevated-dark rounded-2xl overflow-hidden border border-border-subtler shadow-2xl">
                <FlowField />
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-6 md:col-start-6 lg:col-start-7 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                {aboutMeText.split('\n\n').map((p, i) => (
                  <ScrollWordReveal
                    key={i}
                    text={p}
                    offset={['start 0.92', 'end 0.65']}
                    className="text-base sm:text-lg md:text-lg leading-relaxed font-sans"
                  />
                ))}
              </div>
            </div>
          </div>

          <div ref={tableRef} className="pt-12 md:pt-20 border-t border-white/10">
            <div className="mb-12 text-center md:mb-20">
              <h3 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold tracking-[-0.045em] leading-[0.95] text-light">
                <span className="experience-word inline-block overflow-hidden align-top"><span className="block">The</span></span>{' '}
                <span className="experience-word inline-block overflow-hidden align-top"><span className="serif-accent block normal-case tracking-[-0.05em] text-accent">path</span></span>{' '}
                <span className="experience-word inline-block overflow-hidden align-top"><span className="block">so far.</span></span>
              </h3>
            </div>

            <div className="relative mx-auto max-w-6xl">
              <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-white/15 md:hidden" />
              <svg aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 hidden h-full w-16 -translate-x-1/2 md:block" viewBox="0 0 64 1000" preserveAspectRatio="none">
                <path
                  ref={pathRef}
                  d="M32 0 C25 84 39 164 32 250 C25 334 39 416 32 500 C25 584 39 666 32 750 C25 834 39 916 32 1000"
                  fill="none"
                  stroke="rgba(243, 238, 229, 0.28)"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="flex flex-col gap-12 md:gap-20">
                {CREDENTIALS.map((item, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <article key={item.title} data-side={isLeft ? 'left' : 'right'} className="cred-row reveal-hide relative grid grid-cols-[32px_1fr] gap-x-5 md:grid-cols-[1fr_96px_1fr] md:gap-x-0">
                      <div className="relative order-1 md:col-start-2 md:row-start-1 md:justify-self-center">
                        <span className="timeline-dot relative z-10 block h-[15px] w-[15px] rounded-full border-[3px] border-ink bg-cream" />
                        <span aria-hidden="true" className={`timeline-connector absolute top-[7px] hidden h-px w-14 bg-white/25 md:block ${isLeft ? 'right-full origin-right' : 'left-full origin-left'}`} />
                        <span className={`absolute top-7 hidden md:block whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-warm-light ${isLeft ? 'left-0 md:right-7 md:left-auto md:text-right' : 'left-0 md:left-7'}`}>
                          {item.year}
                        </span>
                      </div>

                      <div className={`timeline-content order-2 pt-8 md:row-start-1 md:pt-8 md:p-8 md:rounded-[2rem] md:border md:border-white/[0.07] md:bg-surface-card/80 md:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.9)] ${isLeft ? 'md:col-start-1 md:mr-12 md:text-right' : 'md:col-start-3 md:ml-12'}`}>
                        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">{item.type}<span className="md:hidden text-warm-light"> · {item.year}</span></span>
                        <h4 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,3.1rem)] font-semibold tracking-[-0.035em] leading-[1] text-cream">
                          {item.title}
                        </h4>
                        <div className={`mt-6 border-t border-white/10 pt-4 ${isLeft ? 'md:ml-auto md:max-w-md' : 'md:max-w-md'}`}>
                          <p className="font-mono text-xs leading-relaxed text-gray-soft">{item.organization}</p>
                          {item.stat && <p className="mt-3 font-sans text-sm leading-relaxed text-warm-light">{item.stat}</p>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
