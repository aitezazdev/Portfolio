import React from "react";
import AnimatedHeading from "./AnimateHeading";
import AnimatedButton from "./AnimatedButton";

const Contact = () => {
  const headingText = "Contact";
  return (
    <section id="contact" className="bg-[#e8e8e3] my-20">
      <section className="min-h-screen w-[93%] rounded-xl mx-auto bg-[#131211] text-[#d1d1c7] pt-5 pb-20 md:px-12 lg:px-20">
      <AnimatedHeading
        text={headingText}
        className="text-5xl md:text-7xl lg:text-8xl mt-20 mb-4"
      />

      <p className=" text-lg md:text-xl opacity-80 mb-10">
        Have a project in mind or just want to say hello? Feel free to reach
        out.
      </p>

      <form className="max-w-2xl space-y-6 p-6 rounded-lg mx-auto bg-[#24231f]">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-sm">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-black/20 rounded-md bg-[#312f2d] focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-sm">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-black/20 rounded-md bg-[#312f2d] focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-medium text-sm">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            placeholder="Write your message here..."
            className="w-full px-4 py-3 border border-black/20 rounded-md bg-[#312f2d] resize-none focus:outline-none focus:border-black"></textarea>
        </div>

        <AnimatedButton
          topText="SEND MESSAGE"
          bottomText={"PROCEED\u2002→"}
          variant="light"
        />
      </form>
    </section>
    </section>
  );
};

export default Contact;
