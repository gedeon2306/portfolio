import { useState, useMemo, useEffect } from "react";
import { 
  FiArrowLeft, 
  FiArrowUpRight, 
  FiLayers, 
  FiSearch,
  FiFilter,
  FiX,
  FiGithub,
  FiExternalLink,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/Actions";
import { extractYear, getAvailableYears } from "../utils/dateUtils";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import "../css/ProjectsPage.css";

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

export default function ProjectsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const projects = projectsData?.projets || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const availableYears = useMemo(() => {
    return getAvailableYears(projects);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.titre.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(term))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((project) => project.categorie === selectedCategory);
    }

    if (selectedYear) {
      filtered = filtered.filter((project) => extractYear(project.date) === selectedYear);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedYear, projects]);

  const handleActionClick = (name: string, type: "repo" | "demo") => {
    if (type === "repo") {
      toast.info("Code Source", `Redirection vers le dépôt de "${name}"...`);
    } else {
      toast.success("Démo en direct", `Ouverture de la démo de "${name}"...`);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: "projets" } });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedYear("");
  };

  const getCategoryLabel = (value: string) => {
    const category = PROJECT_CATEGORIES.find((c) => c.value === value);
    return category ? category.label : value;
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedYear;

  if (error) {
    console.error("Erreur lors du chargement des projets:", error);
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pf-projects-page">
          <div className="pf-container">
            <div className="pf-projects-page-header">
              <Link to="/" className="pf-back-button" onClick={handleBack}>
                <FiArrowLeft size={20} />
                <span>Retour au portfolio</span>
              </Link>
            </div>
            <div className="pf-projects-loading">
              <div className="pf-spinner" />
              <p>Chargement des projets...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pf-projects-page">
        <div className="pf-container">
          <div className="pf-projects-page-header">
            <Link to="/" className="pf-back-button" onClick={handleBack}>
              <FiArrowLeft size={20} />
              <span>Retour au portfolio</span>
            </Link>

            <div className="pf-projects-page-title-section">
              <span className="pf-eyebrow">Portfolio & Réalisations</span>
              <h1 className="pf-projects-page-title">Tous mes Projets</h1>
              <p className="pf-projects-page-subtitle">
                Une sélection complète d'applications conçues avec une exigence stricte de qualité de code, de performance et de design.
                {" "}{projects.length} projets réalisés.
              </p>
            </div>
          </div>

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
                <button className="pf-search-clear" onClick={() => setSearchTerm("")}>
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
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button className="pf-clear-filters-btn" onClick={clearFilters}>
                  <FiX size={16} />
                  <span>Effacer les filtres</span>
                </button>
              )}
            </div>
          </div>

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
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="pf-projects-grid-full">
                {filteredProjects.map((project) => (
                  <article key={project.id} className="pf-project-card">
                    <div className="pf-project-thumb">
                      <img
                        src={project.image || "/assets/projects/default.svg"}
                        alt={project.titre}
                        className="pf-project-thumb-image"
                      />
                      <div className="pf-project-thumb-bg">
                        <FiLayers className="pf-project-watermark" />
                      </div>
                      {project.important && (
                        <span className="badge badge-accent pf-project-badge-top">
                          En vedette
                        </span>
                      )}
                    </div>

                    <div className="pf-project-body">
                      <span className="pf-project-category font-mono">
                        {getCategoryLabel(project.categorie)}
                      </span>
                      <h3 className="pf-project-title">{project.titre}</h3>
                      <p className="pf-project-desc">{project.description}</p>

                      <div className="pf-project-tags">
                        {project.technologies.map((tech) => {
                          const meta = getTechMeta(tech);
                          return (
                            <span key={tech} className="badge badge-neutral pf-tech-badge">
                              <TechIcon name={tech} size={12} />
                              <span>{meta.label}</span>
                            </span>
                          );
                        })}
                      </div>

                      <div className="pf-project-footer">
                        <div className="pf-project-links">
                          {project.codeSource && (
                            <a
                              href={project.codeSource}
                              target="_blank"
                              rel="noreferrer"
                              className="pf-icon-btn pf-project-icon-btn"
                              aria-label="Voir le code source"
                              title="Code source GitHub"
                              onClick={() => handleActionClick(project.titre, "repo")}
                            >
                              <FiGithub size={16} />
                            </a>
                          )}
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="pf-icon-btn pf-project-icon-btn"
                              aria-label="Voir la démo en direct"
                              title="Démo live"
                              onClick={() => handleActionClick(project.titre, "demo")}
                            >
                              <FiExternalLink size={16} />
                            </a>
                          )}
                        </div>

                        <a
                          href={project.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="pf-project-explore"
                          onClick={() => handleActionClick(project.titre, "demo")}
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