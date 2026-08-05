import { useState } from 'react';
import {
  LuFolder,
  LuTrash2,
  LuPlus,
  LuSearch,
  LuLayoutGrid,
  LuList,
  LuExternalLink,
  LuGithub,
  LuX,
  LuStar
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import './Projects.css';

type ProjectStatus = 'published' | 'draft' | 'archived';

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  updatedAt: string;
  featured: boolean;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  doc?: string;
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Portfolio V2',
    description: 'Refonte complète du portfolio personnel avec une identité visuelle moderne et animations Emiel Kowalski.',
    category: 'Web',
    status: 'published',
    updatedAt: 'Il y a 2 jours',
    featured: true,
    githubUrl: 'https://github.com/gedeon2306/portfolio',
    demoUrl: 'https://gedeondupont.dev',
  },
  {
    id: 'p2',
    name: 'Dashboard Admin Console',
    description: 'Interface d’administration complète pour la gestion des contenus, compétences et analytiques.',
    category: 'Productivité',
    status: 'published',
    updatedAt: 'Il y a 5 jours',
    featured: true,
    githubUrl: 'https://github.com/gedeon2306/admin-dashboard',
  },
  {
    id: 'p3',
    name: 'Landing Agency Digital',
    description: 'Landing page haute conversion pour une agence de création numérique avec design dark glass.',
    category: 'Marketing',
    status: 'draft',
    updatedAt: 'Il y a 1 semaine',
    featured: false,
  },
  {
    id: 'p4',
    name: 'Mobile Health Tracker',
    description: 'Application mobile de suivi de santé et performances sportives temps réel.',
    category: 'Mobile',
    status: 'published',
    updatedAt: 'Il y a 2 semaines',
    featured: false,
  },
  {
    id: 'p5',
    name: 'API REST Django Portfolio',
    description: 'Backend sécurisé Django REST Framework avec gestion JWT et stockage des données.',
    category: 'Backend',
    status: 'published',
    updatedAt: 'Il y a 3 semaines',
    featured: true,
  },
];

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('Web');
  const [formStatus, setFormStatus] = useState<ProjectStatus>('published');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formUrl, setFormUrl] = useState('');
  const [formCodeSource, setFormCodeSource] = useState('');
  const [formDoc, setFormDoc] = useState<File | null>(null);
  const [formImportant, setFormImportant] = useState(false);

  const categories = ['all', 'Web', 'Mobile', 'Productivité', 'Marketing', 'Backend'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateProject = () => {
    if (!formName.trim() || !formDesc.trim()) {
      toast.error('Champs manquants', 'Veuillez saisir un titre et une description.');
      return;
    }

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      category: formCat,
      status: formStatus,
      updatedAt: 'À l’instant',
      featured: formImportant,
      image: formImage ? URL.createObjectURL(formImage) : undefined,
      githubUrl: formCodeSource || undefined,
      demoUrl: formUrl || undefined,
      doc: formDoc ? URL.createObjectURL(formDoc) : undefined,
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsCreateModalOpen(false);
    setFormName('');
    setFormDesc('');
    setFormCat('Web');
    setFormStatus('published');
    setFormImage(null);
    setFormUrl('');
    setFormCodeSource('');
    setFormDoc(null);
    setFormImportant(false);
    toast.success('Projet créé !', `Le projet "${newProject.name}" a été ajouté.`);
  };

  const handleDeleteProject = () => {
    if (!deleteConfirmProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteConfirmProject.id));
    toast.info('Projet supprimé', `"${deleteConfirmProject.name}" a été retiré.`);
    setDeleteConfirmProject(null);
  };

  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = !p.featured;
        toast.info(next ? 'Projet mis en avant' : 'Projet retiré de la une');
        return { ...p, featured: next };
      })
    );
  };

  return (
    <div className="projects-page">
      {/* Header section */}
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Réalisations & Portfolio</p>
          <h2>Gestion des Projets</h2>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <LuPlus className="btn-icon" /> Nouveau Projet
          </button>
        </div>
      </div>

      {/* Barre d'outils de filtres et recherche */}
      <div className="projects-toolbar">
        <div className="search-input-wrap flex-1">
          <LuSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un projet par titre ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtre par catégorie */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="field-select"
        >
          <option value="all">Toutes les catégories</option>
          {categories.filter((c) => c !== 'all').map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Filtre par Statut */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="field-select"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>

        {/* Toggle Vue Grille / Liste */}
        <div className="view-toggle-group">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vue Grille"
          >
            <LuLayoutGrid />
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vue Liste"
          >
            <LuList />
          </button>
        </div>
      </div>

      {/* Grille ou Liste de Projets */}
      {filteredProjects.length === 0 ? (
        <div className="panel-card empty-projects-panel">
          <LuFolder className="empty-icon" />
          <h3>Aucun projet trouvé</h3>
          <p>Essayez de modifier vos termes de recherche ou créez un nouveau projet.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <LuPlus className="btn-icon" /> Créer un projet
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'projects-grid' : 'projects-list-view'}>
          {filteredProjects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-header">
                <div className="project-category-row">
                  <span className="badge badge-accent">{project.category}</span>
                  <span className={`badge ${project.status === 'published' ? 'badge-neutral' : 'badge-neutral'}`}>
                    {project.status === 'published' ? '● Publié' : '○ Brouillon'}
                  </span>
                </div>

                <button
                  type="button"
                  className={`star-btn ${project.featured ? 'active' : ''}`}
                  onClick={() => toggleFeatured(project.id)}
                  title={project.featured ? 'Mis en avant' : 'Mettre en avant'}
                >
                  <LuStar />
                </button>
              </div>

              <div className="project-body">
                <h3>{project.name}</h3>
                <p className="project-desc">{project.description}</p>
              </div>

              <div className="project-footer">
                <span className="project-updated text-xs text-tertiary font-mono">
                  {project.updatedAt}
                </span>

                <div className="project-actions">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-icon-only"
                      title="Voir sur GitHub"
                    >
                      <LuGithub />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-icon-only"
                      title="Démonstration Live"
                    >
                      <LuExternalLink />
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon-only"
                    onClick={() => toast.info('Édition', `Formulaire d'édition pour ${project.name}`)}
                    title="Modifier"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon-only danger"
                    onClick={() => setDeleteConfirmProject(project)}
                    title="Supprimer"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Création Projet */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter un Nouveau Projet</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <LuX />
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label htmlFor="pname">Nom du projet</label>
                <input
                  id="pname"
                  type="text"
                  placeholder="Ex: App Web SaaS, Interface Mobile..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="pcat">Catégorie</label>
                  <select
                    id="pcat"
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="field-select"
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Productivité">Productivité</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="pstatus">Statut de publication</label>
                  <select
                    id="pstatus"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                    className="field-select"
                  >
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="pdesc">Description détaillée</label>
                <textarea
                  id="pdesc"
                  placeholder="Résumez l'objectif du projet, les technologies utilisées..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="field">
                <label htmlFor="pimage">Image (PNG/JPG) — optionnel</label>
                <input
                  id="pimage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="purl">URL Démo</label>
                  <input
                    id="purl"
                    type="text"
                    placeholder="https://demo.exemple.com"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="psource">Code source (Git)</label>
                  <input
                    id="psource"
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={formCodeSource}
                    onChange={(e) => setFormCodeSource(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="pdoc">Documentation (PDF, optionnel)</label>
                <input
                  id="pdoc"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFormDoc(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              <div className="field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formImportant}
                    onChange={(e) => setFormImportant(e.target.checked)}
                  />{' '}
                  Mettre en avant ce projet
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateProject}
              >
                Créer le projet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deleteConfirmProject && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmProject(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setDeleteConfirmProject(null)}
              >
                <LuX />
              </button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer définitivement le projet <strong>« {deleteConfirmProject.name} »</strong> ?</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmProject(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProject}
              >
                Supprimer le projet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}