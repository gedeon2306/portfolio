import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Certificates from "../components/Certificates";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import "../css/tokens.css";

export default function PortfolioPage() {
  return (
    <div className="pf-root">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Certificates />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
