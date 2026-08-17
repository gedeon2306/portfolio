import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Certificates from "./Certificates";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import "../css/tokens.css";

/**
 * Page portfolio complète.
 * Importer et monter ce composant sur la route publique (ex: "/").
 */
export default function Portfolio() {
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
