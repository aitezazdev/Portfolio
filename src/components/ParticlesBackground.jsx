"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      className="absolute inset-0 w-full h-full"
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: { value: "transparent" }
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 50,
            density: { enable: true, value_area: 800 }
          },
          color: { value: "#615c56" },
          shape: {
            type: "circle" 
          },
          opacity: {
            value: 0.4,
            random: false,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: 2,
            random: { enable: true, minimumValue: 1 }
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "bounce" }
          },
          links: {
            enable: true,
            distance: 150,
            color: "#615c56",
            opacity: 0.2,
            width: 1
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: false }
          },
          modes: {
            grab: {
              distance: 140,
              links: { opacity: 0.5 }
            }
          }
        },
        detectRetina: true
      }}
    />
  );
}