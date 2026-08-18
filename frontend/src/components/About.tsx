import { FiDownload } from "react-icons/fi";
import { useScrollReveal } from "./useScrollReveal";
import { highlightText } from "./highlightText";
import { useToast } from "../context/ToastContext";
import "../css/About.css";
import { VscDebugStart } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { getAboutData } from "../api/Actions";
import type { AboutData } from "../types/Types";
import { formatLanguageLevel, sortLanguagesByOrder } from "../utils/languageUtils";

// Mots à surligner par défaut
const DEFAULT_MOTS_A_SURLIGNER = [
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

// Textes par défaut
const DEFAULT_PARAGRAPH_1 =
  "Développeur Full-Stack passionné par la création d'interfaces intuitives et performantes, je conçois des produits web pensés du premier croquis jusqu'à la mise en production. Mon approche combine rigueur technique et sensibilité design pour offrir des expériences numériques d'exception, où chaque interaction est réfléchie et chaque détail compte. J'aime autant discuter d'architecture backend que de micro-interactions à l'écran.";

const DEFAULT_PARAGRAPH_2 =
  "Expertise en React, Next.js et Django, je transforme des concepts complexes en solutions fluides et accessibles, en gardant toujours à l'esprit la performance et la maintenabilité du code. Curieux et méthodique, je documente mon travail, teste ce que je construis et reste en quête de nouveaux défis technologiques, que ce soit sur l'architecture d'un back-office, l'accessibilité d'un formulaire ou la fluidité d'une animation.";

// Langues par défaut avec niveaux CECRL
const DEFAULT_LANGUAGES = [
  { id: "FR", langue: "Français", niveau: "C2" },
  { id: "EN", langue: "Anglais", niveau: "B2" },
  { id: "ES", langue: "Espagnol", niveau: "A2" },
];

export default function About() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const toast = useToast();
  
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await getAboutData();
        setAboutData(data);
      } catch (err) {
        console.error("Erreur lors du chargement des données About:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Utiliser les données de l'API ou les valeurs par défaut
  const prenom = aboutData?.prenom || "Gédéon Jihrel";
  const nom = aboutData?.nom || "GANGOUE";
  const description1 = aboutData?.description1 || DEFAULT_PARAGRAPH_1;
  const description2 = aboutData?.description2 || DEFAULT_PARAGRAPH_2;
  const photoUrl = aboutData?.photo || "/jihreldev.jpeg";
  const cvUrl = aboutData?.cv || "/assets/cv-Jihreldev.pdf";
  
  // Langues : utiliser celles de l'API ou les défauts, puis trier
  const languesData = aboutData?.langues?.length 
    ? aboutData.langues 
    : DEFAULT_LANGUAGES;
  
  // Trier les langues : Français, Anglais, Espagnol
  const sortedLanguages = sortLanguagesByOrder(languesData);

  const handleDownloadCV = () => {
    toast.info("Téléchargement du CV", "Votre téléchargement a démarré.");
  };

  // Fonction pour obtenir le code du drapeau
  const getFlagCode = (langue: string) => {
    const langLower = langue.toLowerCase();
    if (langLower.includes('français')) return 'fr';
    if (langLower.includes('anglais')) return 'gb';
    if (langLower.includes('espagnol')) return 'es';
    return 'fr';
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
                  src={photoUrl}
                  alt={`${prenom} ${nom}`}
                  className="pf-about-portrait-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/jihreldev.jpeg";
                  }}
                />
              </div>
            </div>

            <div className="pf-about-content">
              <h3>
                {prenom} <span className="pf-about-name-highlight">{nom}</span>
              </h3>

              <div className="pf-about-paragraphs">
                <p>{highlightText(description1, DEFAULT_MOTS_A_SURLIGNER)}</p>
                <p>{highlightText(description2, DEFAULT_MOTS_A_SURLIGNER)}</p>
              </div>

              <div className="pf-about-actions">
                <a
                  href={cvUrl}
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
                  {sortedLanguages.map((lang) => (
                    <div key={lang.id} className="pf-lang-card">
                      {/* Ligne du haut : drapeau + langue */}
                      <div className="pf-lang-top-row">
                        <img
                          className="pf-lang-flag"
                          src={`https://flagcdn.com/w80/${getFlagCode(lang.langue)}.png`}
                          alt={lang.langue}
                          loading="lazy"
                        />
                        <span className="pf-lang-name">{lang.langue}</span>
                      </div>
                      
                      {/* Ligne du bas : niveau - Garde la classe badge-accent existante */}
                      <span className="badge badge-accent pf-lang-badge">
                        {formatLanguageLevel(lang.niveau)}
                      </span>
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