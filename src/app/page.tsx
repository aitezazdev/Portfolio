// Made by Aitezaz Sikandar - https://aitezazdev.vercel.app


import HomeBanner from '@/components/sections/HomeBanner';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import MarqueeStrip from '@/components/sections/MarqueeStrip';
import CurvedSectionDivider from '@/components/ui/CurvedSectionDivider';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import HomeScrollOrchestrator from '@/components/home/HomeScrollOrchestrator';

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeScrollOrchestrator
        banner={<HomeBanner />}
        about={<About />}
      >
        <CurvedSectionDivider curveColor="var(--color-ink)" bottomColor="var(--color-cream)" />
        <section className="relative z-20 bg-cream">
          <Projects />
        </section>
        <MarqueeStrip />
        <CurvedSectionDivider curveColor="var(--color-cream)" bottomColor="var(--color-ink)" />
        <div className="relative z-25 bg-ink overflow-hidden">
          <Contact />
          <Footer />
        </div>
      </HomeScrollOrchestrator>
    </>
  );
}
