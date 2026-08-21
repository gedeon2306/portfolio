import { useState, useRef } from "react";
import { 
  FiGithub,
  FiArrowUpRight, 
  FiLayers, 
  FiChevronDown, 
  FiChevronRight 
} from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useQuery } from "@tanstack/react-query";
import { getProjectsHighlights } from "../api/Actions";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import "../css/Projects.css";
import SkeletonProjects from "./skeletonComponents/SkeletonProjects";

const INITIAL_COUNT = 3;

export default function Projects() {
  const toast = useToast();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects-highlights'],
    queryFn: getProjectsHighlights,
  });

  const projects = projectsData?.projets || [];

  const displayedProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;
  const canCollapse = visibleCount > INITIAL_COUNT && projects.length > INITIAL_COUNT;

  const handleActionClick = (name: string, type: "repo" | "doc" | "demo") => {
    if (type === "repo") {
      toast.info("Code Source", `Redirection vers le dépôt de "${name}"...`);
    } else if(type === "doc") {
      toast.success("Documentation", `Ouverture de la documentation de "${name}"...`);
    } else {
      toast.success("Démo en direct", `Ouverture de la démo de "${name}"...`);
    }
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/projects");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  };
  
  const handleCollapse = () => {
    setVisibleCount(INITIAL_COUNT);
    navigate("/", { state: { scrollTo: "projets" } });
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
        {isLoading || error || projects.length === 0 ? (
          <SkeletonProjects />
        ) : (
          <>
            <div ref={gridRef} className="pf-projects-grid">
              {displayedProjects.map((project) => (
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
                    <span className="pf-project-category font-mono">{project.categorie}</span>
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
                          <>
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
                            <a
                              href={project.codeSource + "/blob/main/README.md"}
                              target="_blank"
                              rel="noreferrer"
                              className="pf-icon-btn pf-project-icon-btn"
                              aria-label="Voir la documentation"
                                title="Documentation"
                                onClick={() => handleActionClick(project.titre, "doc")}
                              >
                                <IoDocumentOutline size={16} />
                            </a>
                          </>
                          )}
                        </div>

                        <a
                          href={project.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="pf-project-explore"
                          aria-label="Voir la démo en direct"
                          title="Démo live"
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

            <div className="pf-projects-actions">
              {hasMore && (
                <button
                  type="button"
                  className="btn btn-secondary pf-projects-action-btn"
                  onClick={handleShowMore}
                >
                  <span>Afficher plus de projets</span>
                  <FiChevronDown size={18} className="pf-chevron-icon" />
                </button>
              )}
              {canCollapse && !hasMore && (
                <button
                  type="button"
                  className="btn btn-secondary pf-projects-action-btn"
                  onClick={handleCollapse}
                >
                  <span>Réduire la liste</span>
                  <FiChevronDown size={18} className="pf-chevron-icon pf-chevron-up" />
                </button>
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
          </>
        )}
      </div>
    </section>
  );
}