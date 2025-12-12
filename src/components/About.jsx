import AnimateDescription from "./AnimateDescription";
import AnimatedHeading from "./AnimateHeading";

const About = () => {
  const headingText = "Who Am I";
  const descriptionText =
    "I'm a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.";

  const aboutMeText = `I am a passionate Software Engineer with a knack for building full-stack web applications using modern technologies like MERN Stack and Tailwind CSS. My journey in tech began with a curiosity for solving real-world problems through innovative solutions, which evolved into a love for crafting user-centric digital experiences.

Beyond coding, I thrive in collaborative environments and enjoy tackling challenging problems with creative solutions. I aim to contribute to impactful projects that make a difference in users' lives.`;

  return (
    <div className="bg-[#e8e8e3]">
      <section
        id="about"
        className="min-h-screen bg-[#080807] text-[#d1d1c7] pt-5 pb-5 px-6 md:px-12 lg:px-20 rounded-t-4xl"
      >
        <div className="mb-10 md:mb-20">
          <AnimatedHeading
            text={headingText}
            className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl mt-20 mb-4"
          />

          <AnimateDescription
            text={descriptionText}
            className="text-base sm:text-lg text-[#a29e9a] font-sans"
          />
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8 pb-20">
          <div className="col-span-12 md:col-span-5 lg:col-span-5">
            <div className="w-full max-w-[350px] md:max-w-[380px] h-[360px] md:h-[450px] bg-[#1a1a18] rounded-2xl flex items-center justify-center border border-[#2a2a28]">
              <span className="text-[#4a4a48] text-base md:text-lg">Image Space</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6 md:col-start-6 lg:col-start-7 flex flex-col justify-center space-y-8">
            <span className="text-sm sm:text-base md:text-base text-[#6a6a68] uppercase tracking-[0.3em] font-medium text-center md:text-left">
              (About Me)
            </span>

            <div className="space-y-6">
              {aboutMeText.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="text-[#a29e9a] text-base sm:text-lg md:text-lg leading-relaxed font-sans"
                >
                  {p}
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
