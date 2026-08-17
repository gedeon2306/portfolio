import { useState, useMemo, useEffect } from "react";
import { 
  FiArrowLeft, 
  FiArrowUpRight, 
  FiLayers, 
  FiSearch,
  FiFilter,
  FiX,
  FiGithub,
  FiExternalLink
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import "../css/ProjectsPage.css";

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

const PROJECT_CATEGORIES = [
  { value: 'Web', label: 'Application Web' },
  { value: 'Mobile', label: 'Application Mobile' },
  { value: 'Desktop', label: 'Application Desktop' },
  { value: 'Data base', label: 'Base de Données' },
  { value: 'IA', label: 'Intelligence Artificielle' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'UI/UX', label: 'UI/UX Design' },
  { value: 'Réseaux', label: 'Réseaux et Télécommunications' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'API', label: 'API' },
  { value: 'Autre', label: 'Autre' },
];

const PROJECTS: Project[] = [
  {
    id: "proj-1",
    category: "Web",
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
    category: "Web",
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
    category: "Web",
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
    category: "Web",
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
    category: "Web",
    title: "Générateur & Système de Design Tokens",
    description:
      "Outil pour designers et développeurs permettant d'exporter des thèmes et variables CSS / JSON synchronisés en temps réel.",
    tags: ["TypeScript", "Vite", "CSS Variables", "Design Tokens"],
    image: "/assets/projects/designtokens.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-7",
    category: "API",
    title: "API RESTful pour Gestion de Contenu",
    description:
      "API haute performance avec authentification JWT, documentation Swagger, rate limiting et caching Redis.",
    tags: ["Node.js", "Express", "PostgreSQL", "Redis", "JWT"],
    image: "/assets/projects/api.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-8",
    category: "IA",
    title: "Système de Recommandation par IA",
    description:
      "Moteur de recommandation basé sur des algorithmes de machine learning avec analyse de comportement utilisateur.",
    tags: ["Python", "TensorFlow", "React", "FastAPI"],
    image: "/assets/projects/ai-recommendation.jpg",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
  },
];

// Générer les années de 2024 à 2026
const YEARS = ["2024", "2025", "2026"];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Scroll en haut de la page au chargement
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filtrer les projets
  const filteredProjects = useMemo(() => {
    let filtered = PROJECTS;

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((project) => project.category === selectedCategory);
    }

    // Filtre par année (simulé avec une date fictive pour l'exemple)
    if (selectedYear) {
      // On simule des années pour les projets
      const yearMap: Record<string, string> = {
        "proj-1": "2024",
        "proj-2": "2024",
        "proj-3": "2025",
        "proj-4": "2025",
        "proj-5": "2024",
        "proj-6": "2026",
        "proj-7": "2025",
        "proj-8": "2026",
      };
      filtered = filtered.filter((project) => yearMap[project.id] === selectedYear);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedYear]);

  const handleActionClick = (name: string, type: "repo" | "demo") => {
    if (type === "repo") {
      toast.info("Code Source", `Redirection vers le dépôt de "${name}"...`);
    } else {
      toast.success("Démo en direct", `Ouverture de la démo de "${name}"...`);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    // Attendre que la page se charge pour scroller vers la section projets
    setTimeout(() => {
      const element = document.getElementById("projets");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedYear("");
  };

  const getCategoryLabel = (value: string) => {
    const category = PROJECT_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedYear;

  return (
    <>
      <Navbar />
      <div className="pf-projects-page">
        <div className="pf-container">
          {/* En-tête avec navigation */}
          <div className="pf-projects-page-header">
            <Link 
              to="/"
              className="pf-back-button"
              onClick={handleBack}
            >
              <FiArrowLeft size={20} />
              <span>Retour au portfolio</span>
            </Link>
            
            <div className="pf-projects-page-title-section">
              <span className="pf-eyebrow">Portfolio & Réalisations</span>
              <h1 className="pf-projects-page-title">Tous mes Projets</h1>
              <p className="pf-projects-page-subtitle">
                L'ensemble de mes projets professionnels et personnels, démontrant mon expertise en développement logiciel.
                {PROJECTS.length} projets réalisés.
              </p>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="pf-projects-search-section">
            <div className="pf-search-bar">
              <FiSearch className="pf-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet par titre, description ou technologie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pf-search-input"
              />
              {searchTerm && (
                <button
                  className="pf-search-clear"
                  onClick={() => setSearchTerm("")}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            <button
              className={`pf-filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={18} />
              <span>Filtres</span>
              {hasActiveFilters && <span className="pf-filter-badge" />}
            </button>
          </div>

          {/* Filtres déroulants */}
          <div className={`pf-filters-panel ${showFilters ? 'open' : ''}`}>
            <div className="pf-filters-grid">
              <div className="pf-filter-group">
                <label className="pf-filter-label">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pf-filter-select"
                >
                  <option value="">Toutes les catégories</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pf-filter-group">
                <label className="pf-filter-label">Année</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="pf-filter-select"
                >
                  <option value="">Toutes les années</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  className="pf-clear-filters-btn"
                  onClick={clearFilters}
                >
                  <FiX size={16} />
                  <span>Effacer les filtres</span>
                </button>
              )}
            </div>
          </div>

          {/* Résultats */}
          <div className="pf-projects-results">
            <div className="pf-projects-results-header">
              <span className="pf-projects-count">
                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
                {hasActiveFilters && ' trouvé(s)'}
              </span>
              {hasActiveFilters && (
                <span className="pf-projects-filters-active">
                  {selectedCategory && (
                    <span className="pf-filter-tag">
                      {getCategoryLabel(selectedCategory)}
                      <button onClick={() => setSelectedCategory("")}>
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  {selectedYear && (
                    <span className="pf-filter-tag">
                      {selectedYear}
                      <button onClick={() => setSelectedYear("")}>
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                </span>
              )}
            </div>

            {filteredProjects.length === 0 ? (
              <div className="pf-projects-empty">
                <FiLayers size={48} className="pf-empty-icon" />
                <h3>Aucun projet trouvé</h3>
                <p>Aucun projet ne correspond à vos critères de recherche.</p>
                <button
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="pf-projects-grid-full">
                {filteredProjects.map((project) => (
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
                      <span className="pf-project-category font-mono">
                        {getCategoryLabel(project.category)}
                      </span>
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}