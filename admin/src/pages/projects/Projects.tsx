import { useState } from 'react';
import { LuFolder, LuTrash2 } from 'react-icons/lu';
import { FiEye, FiEdit3 } from 'react-icons/fi';
import './Projects.css';

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  updatedAt: string;
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Portfolio V2',
    description: 'Refonte complète du portfolio personnel avec une nouvelle identité.',
    category: 'Web',
    updatedAt: 'Il y a 2 jours',
  },
  {
    id: 'p2',
    name: 'Dashboard Admin',
    description: 'Interface d’administration pour gérer les contenus du site.',
    category: 'Productivité',
    updatedAt: 'Il y a 5 jours',
  },
  {
    id: 'p3',
    name: 'Landing Agency',
    description: 'Landing page moderne pour une agence de design digital.',
    category: 'Marketing',
    updatedAt: 'Il y a 1 semaine',
  },
  {
    id: 'p1',
    name: 'Portfolio V2',
    description: 'Refonte complète du portfolio personnel avec une nouvelle identité.',
    category: 'Web',
    updatedAt: 'Il y a 2 jours',
  },
  {
    id: 'p2',
    name: 'Dashboard Admin',
    description: 'Interface d’administration pour gérer les contenus du site.',
    category: 'Productivité',
    updatedAt: 'Il y a 5 jours',
  },
  {
    id: 'p3',
    name: 'Landing Agency',
    description: 'Landing page moderne pour une agence de design digital.',
    category: 'Marketing',
    updatedAt: 'Il y a 1 semaine',
  },
];

export default function Projects() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="projects-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Gestion des projets</p>
          <h2>Projets</h2>
        </div>
        <button className="btn btn-primary btn-icon-text" type="button">
          Ajouter
        </button>
      </div>

      <section className="projects-grid" aria-label="Liste des projets">
        {initialProjects.map((project) => (
          <article key={project.id} className="project-card">
            {/* Seul ce bouton garde son action d'ouverture/fermeture du menu */}
            <button
              type="button"
              className="project-menu-trigger"
              aria-label={`Options pour ${project.name}`}
              onClick={() =>
                setOpenMenuId((currentId) => (currentId === project.id ? null : project.id))
              }
            >
              <span aria-hidden="true">⋯</span>
            </button>

            {openMenuId === project.id && (
              <div className="project-menu" role="menu">
                <button type="button" className="project-menu-item">
                  <FiEye />
                  Voir
                </button>
                <button type="button" className="project-menu-item">
                  <FiEdit3 />
                  Modifier
                </button>
                <button type="button" className="project-menu-item danger">
                  <LuTrash2 />
                  Supprimer
                </button>
              </div>
            )}

            <button type="button" className="project-folder">
              <div className="folder-tab" />
              <div className="folder-body">
                <LuFolder className="folder-icon" />
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                </div>
              </div>
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}