import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCode, FiLayers, FiCpu, FiArrowUpRight } from "react-icons/fi";
import { useScrollReveal } from "./useScrollReveal";
import { TechIcon } from "../utils/techIcons";
import "../css/Hero.css";
import { IoIosContact } from "react-icons/io";

const HIGHLIGHTS = [
  {
    icon: FiCode,
    title: "Stack Moderne & Scalable",
    description:
      "Développement web haute performance avec React, TypeScript, Next.js, Django et Node.js pour des applications fiables et évolutives.",
    tags: ["React", "Next.js", "Django", "TypeScript"],
    link: "#projets",
    linkLabel: "Voir les réalisations",
  },
  {
    icon: FiLayers,
    title: "Design Systems & Craft UI",
    description:
      "Conception d'interfaces soignées avec une attention obsessionnelle aux micro-interactions, à la typographie et à l'accessibilité.",
    tags: ["UI/UX", "Design Tokens", "Micro-animations",],
    link: "#apropos",
    linkLabel: "En savoir plus",
  },
  {
    icon: FiCpu,
    title: "Architecture & Performance",
    description:
      "Optimisation des temps de chargement, APIs RESTful robustes, architectures modulaires et intégration continue propre.",
    tags: ["PostgreSQL", "API REST", "CI/CD & Déploiement", "Docker"],
    link: "#competences",
    linkLabel: "Explorer la stack",
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLDivElement>();

  const handleCollapse = (url = "") => {
    navigate("/", { state: { scrollTo: url } });
  };

  return (
    <section id="top" className="pf-hero">
      <div className="pf-hero-background-glow" aria-hidden="true" />
      <div className="pf-container pf-hero-inner">
        <div className="pf-hero-badge">
          <span className="pf-dot" />
          <span className="pf-badge-text">Disponible pour de nouveaux projets</span>
        </div>

        <h1 className="pf-hero-title">
          Concevoir des <span className="pf-hero-highlight">expériences</span>{" "}
          <span className="pf-hero-highlight">numériques</span> avec précision.
        </h1>

        <p className="pf-hero-subtitle">
          Développeur Full-Stack passionné par l'intersection entre le design d'excellence
          et l'ingénierie logicielle robuste. Je transforme des visions complexes en produits
          rapides, élégants et intuitifs.
        </p>

        <div className="pf-hero-cta">
          <a href="#projets" className="btn btn-primary pf-hero-btn-main">
            <span>Explorer mes projets</span>
            <FiArrowRight size={16} className="btn-arrow" />
          </a>
          <a href="#contact" className="btn btn-secondary pf-hero-btn-sec">
            <span>Me contacter</span>
            <IoIosContact size={16} />
          </a>
        </div>

        <div ref={revealRef} className="pf-hero-cards pf-reveal">
          {HIGHLIGHTS.map((item) => (
            <article key={item.title} className="pf-hero-card">
              <div className="pf-hero-card-icon">
                <item.icon size={18} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              {item.tags && (
                <div className="pf-hero-card-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge badge-neutral">
                      <TechIcon name={tag} size={12} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              {item.linkLabel && (
                <a href={item.link} className="pf-hero-card-link">
                  <span>{item.linkLabel}</span>
                  <FiArrowUpRight size={14} className="link-arrow" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}