"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "./AnimateHeading";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const descriptionRef = useRef(null);
  const contentRef = useRef(null);

  const headingText = "Who Am I";
  const descriptionText =
    "I'm a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.";

  const aboutMeText = `I am a passionate Software Engineer with a knack for building full-stack web applications using modern technologies like MERN Stack and Tailwind CSS. My journey in tech began with a curiosity for solving real-world problems through innovative solutions, which evolved into a love for crafting user-centric digital experiences.

Beyond coding, I thrive in collaborative environments and enjoy tackling challenging problems with creative solutions. I aim to contribute to impactful projects that make a difference in users' lives.`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const descWords = descriptionRef.current.querySelectorAll(".word");
      gsap.fromTo(
        descWords,
        { opacity: 0, y: "100%" },
        {
          opacity: 1,
          y: "0%",
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white">
      <section
        id="About"
        className="min-h-screen bg-[#080807] text-[#d1d1c7] pt-5 px-6 md:px-12 lg:px-20 rounded-t-[3rem] overflow-hidden"
      >
        <div className="mb-10 md:mb-20">
          <AnimatedHeading
            text={headingText}
            className="text-5xl md:text-7xl lg:text-8xl mt-20 mb-4"
          />
          <div
            ref={descriptionRef}
            className=" text-xl text-[#a29e9a] leading-relaxed"
          >
            <div className="overflow-hidden font-sans">
              {descriptionText.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="word inline-block mr-2"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="grid grid-cols-12 gap-6 md:gap-8 pb-20"
        >
          <div className="col-span-12 md:col-span-5 lg:col-span-5">
            <div className="w-full max-w-[350px] md:max-w-[420px] h-[400px] md:h-[500px] bg-[#1a1a18] rounded-2xl flex items-center justify-center border border-[#2a2a28]">
              <span className="text-[#4a4a48] text-lg">Image Space</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6 md:col-start-6 lg:col-start-7 flex flex-col justify-center space-y-8">
            <div className="text-center md:text-left">
              <span className="text-sm md:text-base text-[#6a6a68] uppercase tracking-[0.3em] font-medium">
                (About Me)
              </span>
            </div>

            <div className="space-y-6">
              {aboutMeText.split("\n\n").map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-[#a29e9a] text-base md:text-lg leading-relaxed font-sans"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;