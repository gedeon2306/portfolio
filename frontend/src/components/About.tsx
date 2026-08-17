import { FiDownload } from "react-icons/fi";
import { useScrollReveal } from "./useScrollReveal";
import { highlightText } from "./highlightText";
import { useToast } from "../context/ToastContext";
import "../css/About.css";
import { VscDebugStart } from "react-icons/vsc";

const MOTS_A_SURLIGNER = [
  "interfaces intuitives",
  "performantes",
  "rigueur technique",
  "sensibilité design",
  "React",
  "Next.js",
  "Django",
  "expériences numériques d'exception",
  "accessibles",
  "nouveaux défis technologiques",
];

const PARAGRAPH_1 =
  "Développeur Full-Stack passionné par la création d'interfaces intuitives et performantes, je conçois des produits web pensés du premier croquis jusqu'à la mise en production. Mon approche combine rigueur technique et sensibilité design pour offrir des expériences numériques d'exception, où chaque interaction est réfléchie et chaque détail compte. J'aime autant discuter d'architecture backend que de micro-interactions à l'écran.";

const PARAGRAPH_2 =
  "Expertise en React, Next.js et Django, je transforme des concepts complexes en solutions fluides et accessibles, en gardant toujours à l'esprit la performance et la maintenabilité du code. Curieux et méthodique, je documente mon travail, teste ce que je construis et reste en quête de nouveaux défis technologiques, que ce soit sur l'architecture d'un back-office, l'accessibilité d'un formulaire ou la fluidité d'une animation.";

interface Language {
  code: string;
  flagCode: string;
  label: string;
  level: string;
}

const LANGUAGES: Language[] = [
  { code: "FR", flagCode: "fr", label: "Français", level: "Langue maternelle (C2)" },
  { code: "EN", flagCode: "gb", label: "Anglais", level: "Professionnel (B2)" },
  { code: "ES", flagCode: "es", label: "Espagnol", level: "Notions de base (A2)" },
];


export default function About() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const toast = useToast();

  const handleDownloadCV = () => {
    toast.info("Téléchargement du CV", "Votre téléchargement a démarré.");
  };

  return (
    <section id="apropos" className="pf-about">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Profil & Philosophie</span>
          <h2 className="pf-section-title">À propos de moi</h2>
          <p className="pf-section-subtitle">
            Un aperçu de mon parcours, de mon éthique de travail et de ma passion pour le développement soigné.
          </p>
        </div>

        <div ref={revealRef} className="pf-about-block pf-reveal">
          <div className="pf-about-grid">
            <div className="pf-about-visual">
              <div className="pf-about-portrait-card">
                <img
                  src="/jihreldev.jpeg"
                  alt="Jihrel Dev"
                  className="pf-about-portrait-img"
                />
              </div>
            </div>

            <div className="pf-about-content">
              <h3>
                Gédéon Jihrel <span className="pf-about-name-highlight">GANGOUE</span>
              </h3>

              <div className="pf-about-paragraphs">
                <p>{highlightText(PARAGRAPH_1, MOTS_A_SURLIGNER)}</p>
                <p>{highlightText(PARAGRAPH_2, MOTS_A_SURLIGNER)}</p>
              </div>

              <div className="pf-about-actions">
                <a
                  href="/assets/cv-Jihreldev.pdf"
                  className="btn btn-primary"
                  download="CV-JihrelDev.pdf"
                  onClick={handleDownloadCV}
                >
                  <FiDownload size={16} />
                  <span>Télécharger mon CV</span>
                </a>
                <a href="#contact" className="btn btn-outline">
                  <VscDebugStart size={16} />
                  <span>Démarrer un projet</span>
                </a>
              </div>

              <div className="pf-langs-section">
                <h4 className="pf-langs-title">Langues & Communication</h4>
                <div className="pf-langs-grid">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.code} className="pf-lang-card">
                      <img
                        className="pf-lang-flag"
                        src={`https://flagcdn.com/w80/${lang.flagCode}.png`}
                        alt={lang.label}
                        loading="lazy"
                      />
                      <div className="pf-lang-info">
                        <span className="pf-lang-name">{lang.label}</span>
                        <span className="badge badge-accent pf-lang-badge">{lang.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}