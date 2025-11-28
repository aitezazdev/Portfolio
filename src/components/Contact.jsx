"use client";

import React from "react";
import AnimatedHeading from "./AnimateHeading";
import AnimateDescription from "./AnimateDescription";
import AnimatedButton from "./AnimatedButton";

const Contact = () => {
  const headingText = "Contact";
  const descriptionText =
    "Have a project in mind or just want to say hello? Feel free to reach out.";

  return (
    <section id="contact" className="bg-[#e8e8e3] py-16 md:py-24">
      <div className="w-[93%] mx-auto rounded-xl bg-[#131211] text-[#d1d1c7] px-6 sm:px-10 md:px-12 lg:px-20 py-16">
        <AnimatedHeading
          text={headingText}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
        />

        <div className="max-w-2xl mb-12">
          <AnimateDescription
            text={descriptionText}
            className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 font-sans leading-relaxed"
          />
        </div>

        <form className="max-w-2xl space-y-6 p-6 sm:p-8 rounded-lg mx-auto bg-[#24231f]">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium text-sm sm:text-base">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 text-sm sm:text-base border border-black/20 rounded-md bg-[#312f2d] focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium text-sm sm:text-base">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm sm:text-base border border-black/20 rounded-md bg-[#312f2d] focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-medium text-sm sm:text-base">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message here..."
              className="w-full px-4 py-3 text-sm sm:text-base border border-black/20 rounded-md bg-[#312f2d] resize-none focus:outline-none focus:border-black"
            />
          </div>

          <AnimatedButton
            topText="SEND MESSAGE"
            bottomText="PROCEED →"
            variant="primary"
          />
        </form>
      </div>
    </section>
  );
};

export default Contact;
