import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectLaunchpad from "@/components/ProjectLaunchpad";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Experience from "@/components/Experience";
import GitHubSection from "@/components/GitHub";
import BeyondCode from "@/components/BeyondCode";
import Contact from "@/components/Contact";
import ThemeSlider from "@/components/ThemeSlider";
import SmoothScroll from "@/components/SmoothScroll";
import MouseGradient from "@/components/MouseGradient";
import IntroLoader from "@/components/IntroLoader";
import SkillsMarquee from "@/components/SkillsMarquee";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <IntroLoader />
      <MouseGradient />
      <SmoothScroll />
      <Nav />
      <Hero />
      <ProjectLaunchpad />
      <Services />
      <Stats />
      <SkillsMarquee />
      <Experience />
      <GitHubSection />
      <BeyondCode />
      <Contact />
      <ThemeSlider />
    </main>
  );
}
