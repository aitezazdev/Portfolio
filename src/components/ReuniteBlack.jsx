import React from "react";
import About from "./About";
import Services from "./Services";
import TechStack from "./TechStack";

const ReuniteBlack = ({ techStackRef }) => {
  return (
    <>
      <About />
      <Services />

      <div ref={techStackRef}>
        <TechStack />
      </div>
    </>
  );
};

export default ReuniteBlack;
