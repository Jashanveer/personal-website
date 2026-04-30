import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Experience from "@/components/Experience";
import GitHubSection from "@/components/GitHub";
import BeyondCode from "@/components/BeyondCode";
import Contact from "@/components/Contact";
import ThemeSlider from "@/components/ThemeSlider";
import SmoothScroll from "@/components/SmoothScroll";
import MouseGradient from "@/components/MouseGradient";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <MouseGradient />
      <SmoothScroll />
      <Nav />
      <Hero />
      <Projects />
      <Services />
      <Stats />
      <Experience />
      <GitHubSection />
      <BeyondCode />
      <Contact />
      <ThemeSlider />
    </main>
  );
}
