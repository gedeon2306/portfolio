import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiGithub, FiExternalLink, FiArrowUpRight, FiLayers, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useScrollReveal } from "./useScrollReveal";
import { useToast } from "../context/ToastContext";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import "../css/Projects.css";

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: "proj-1",
    category: "Full-Stack",
    title: "Plateforme E-Commerce & Gestion des Stocks",
    description:
      "Solution moderne de commerce électronique avec panier temps réel, paiement Stripe, dashboard vendeur et architecture microservices.",
    tags: ["React 19", "Node.js", "MongoDB", "Stripe API", "TailwindCSS"],
    image: "/assets/projects/ecommerce.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    id: "proj-2",
    category: "Full-Stack",
    title: "Dashboard Analytics & Visualisation Temps Réel",
    description:
      "Tableau de bord haute performance avec visualisations interactives D3.js, websockets bidirectionnels et agrégation de métriques avancées.",
    tags: ["React", "TypeScript", "D3.js", "WebSockets", "Django"],
    image: "/assets/projects/analytics.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    id: "proj-3",
    category: "Full-Stack",
    title: "Application Collaborative de Gestion de Tâches",
    description:
      "Espace de travail agile avec synchronisation instantanée, assignation de tickets, notifications push et historique d'activité complet.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "TailwindCSS"],
    image: "/assets/projects/taskmgmt.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-4",
    category: "Mobile",
    title: "Application Mobile Fitness & Suivi d'Entraînement",
    description:
      "Application cross-platform avec suivi GPS, calcul calorique dynamique, graphiques de progression et synchronisation cloud offline-first.",
    tags: ["React Native", "Redux Toolkit", "Firebase", "Expo"],
    image: "/assets/projects/mobile.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-5",
    category: "Frontend",
    title: "Plateforme de Streaming Vidéo & Médias",
    description:
      "Interface fluide de lecture multimédia avec système de recommandation personnalisé, sous-titrage dynamique et mode sombre automatique.",
    tags: ["React", "TypeScript", "Video.js", "GraphQL"],
    image: "/assets/projects/streaming.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-6",
    category: "SaaS & Outils",
    title: "Générateur & Système de Design Tokens",
    description:
      "Outil pour designers et développeurs permettant d'exporter des thèmes et variables CSS / JSON synchronisés en temps réel.",
    tags: ["TypeScript", "Vite", "CSS Variables", "Design Tokens"],
    image: "/assets/projects/designtokens.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
];

const INITIAL_COUNT = 3;

export default function Projects() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const toast = useToast();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const displayedProjects = PROJECTS.slice(0, visibleCount);
  const hasMore = visibleCount < PROJECTS.length;
  const canCollapse = visibleCount > INITIAL_COUNT && PROJECTS.length > INITIAL_COUNT;

  const handleActionClick = (name: string, type: "repo" | "demo") => {
    if (type === "repo") {
      toast.info("Code Source", `Redirection vers le dépôt de "${name}"...`);
    } else {
      toast.success("Démo en direct", `Ouverture de la démo de "${name}"...`);
    }
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/projects");
  };

  return (
    <section id="projets" className="pf-projects">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Portfolio & Réalisations</span>
          <h2 className="pf-section-title">Projets Récents</h2>
          <p className="pf-section-subtitle">
            Une sélection d'applications complètes conçues avec une exigence stricte de qualité de code, de performance et de design.
          </p>
        </div>

        <div ref={revealRef} className="pf-projects-grid pf-reveal">
          {displayedProjects.map((project) => (
            <article key={project.id} className="pf-project-card">
              <div className="pf-project-thumb">
                <img
                  src={project.image}
                  alt={project.title}
                  className="pf-project-thumb-image"
                />
                <div className="pf-project-thumb-bg">
                  <FiLayers className="pf-project-watermark" />
                </div>
                {project.featured && (
                  <span className="badge badge-accent pf-project-badge-top">
                    En vedette
                  </span>
                )}
              </div>

              <div className="pf-project-body">
                <span className="pf-project-category font-mono">{project.category}</span>
                <h3 className="pf-project-title">{project.title}</h3>
                <p className="pf-project-desc">{project.description}</p>

                <div className="pf-project-tags">
                  {project.tags.map((tag) => {
                    const meta = getTechMeta(tag);
                    return (
                      <span key={tag} className="badge badge-neutral pf-tech-badge">
                        <TechIcon name={tag} size={12} />
                        <span>{meta.label}</span>
                      </span>
                    );
                  })}
                </div>

                <div className="pf-project-footer">
                  <div className="pf-project-links">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-icon-btn pf-project-icon-btn"
                        aria-label="Voir le code source"
                        title="Code source GitHub"
                        onClick={() => handleActionClick(project.title, "repo")}
                      >
                        <FiGithub size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pf-icon-btn pf-project-icon-btn"
                        aria-label="Voir la démo en direct"
                        title="Démo live"
                        onClick={() => handleActionClick(project.title, "demo")}
                      >
                        <FiExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <a
                    href={project.liveUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="pf-project-explore"
                    onClick={() => handleActionClick(project.title, "demo")}
                  >
                    <span>Explorer</span>
                    <FiArrowUpRight size={14} className="link-arrow" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pf-projects-actions">
          {(hasMore || canCollapse) && (
            <>
              {hasMore ? (
                <button
                  type="button"
                  className="btn btn-secondary pf-projects-action-btn"
                  onClick={() => setVisibleCount((v) => v + 3)}
                >
                  <span>Afficher plus de projets</span>
                  <FiChevronDown size={18} className="pf-chevron-icon" />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary pf-projects-action-btn"
                  onClick={() => setVisibleCount(INITIAL_COUNT)}
                >
                  <span>Réduire la liste</span>
                  <FiChevronDown size={18} className="pf-chevron-icon pf-chevron-up" />
                </button>
              )}
            </>
          )}
          <Link
            to="/projects"
            className="btn btn-primary pf-projects-action-btn"
            onClick={handleViewAll}
          >
            <span>Voir tous les projets</span>
            <FiChevronRight size={18} className="pf-chevron-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}