import { useState, type KeyboardEvent } from 'react';
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
  LuStar,
  LuGlobe,
  LuGlobeLock,
  LuCode
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import './Projects.css';

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: boolean; // true = publié, false = brouillon
  updatedAt: string;
  important: boolean;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  doc?: string;
  technologies: string[];
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Portfolio V2',
    description: 'Refonte complète du portfolio personnel avec une identité visuelle moderne et animations Emiel Kowalski.',
    category: 'Web',
    status: true,
    updatedAt: 'Il y a 2 jours',
    important: true,
    githubUrl: 'https://github.com/gedeon2306/portfolio',
    demoUrl: 'https://gedeondupont.dev',
    technologies: ['React', 'TypeScript', 'Vite'],
  },
  {
    id: 'p2',
    name: 'Dashboard Admin Console',
    description: 'Interface d’administration complète pour la gestion des contenus, compétences et analytiques.',
    category: 'Productivité',
    status: true,
    updatedAt: 'Il y a 5 jours',
    important: true,
    githubUrl: 'https://github.com/gedeon2306/admin-dashboard',
    technologies: ['React', 'Django REST', 'PostgreSQL'],
  },
  {
    id: 'p3',
    name: 'Landing Agency Digital',
    description: 'Landing page haute conversion pour une agence de création numérique avec design dark glass.',
    category: 'Marketing',
    status: false,
    updatedAt: 'Il y a 1 semaine',
    important: false,
    technologies: ['Next.js', 'Tailwind CSS'],
  },
  {
    id: 'p4',
    name: 'Mobile Health Tracker',
    description: 'Application mobile de suivi de santé et performances sportives temps réel.',
    category: 'Mobile',
    status: true,
    updatedAt: 'Il y a 2 semaines',
    important: false,
    technologies: ['React Native', 'Expo'],
  },
  {
    id: 'p5',
    name: 'API REST Django Portfolio',
    description: 'Backend sécurisé Django REST Framework avec gestion JWT et stockage des données.',
    category: 'Backend',
    status: true,
    updatedAt: 'Il y a 3 semaines',
    important: true,
    technologies: ['Django', 'DRF', 'JWT'],
  },
];

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('Web');
  const [formStatus, setFormStatus] = useState<boolean>(true);
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formUrl, setFormUrl] = useState('');
  const [formCodeSource, setFormCodeSource] = useState('');
  const [formDoc, setFormDoc] = useState<File | null>(null);
  const [formImportant, setFormImportant] = useState(false);
  const [formTechnologies, setFormTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const categories = ['all', 'Web', 'Mobile', 'Productivité', 'Marketing', 'Backend'];

  const availableSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Vite',
    'Django', 'Django REST', 'PostgreSQL', 'Node.js',
    'Tailwind CSS', 'React Native', 'Expo', 'JWT',
  ];

  const addTechnology = () => {
    if (!techInput) return;
    if (formTechnologies.includes(techInput)) {
      toast.error('Déjà ajoutée', `"${techInput}" est déjà dans la liste.`);
      return;
    }
    setFormTechnologies((prev) => [...prev, techInput]);
    setTechInput('');
  };

  const removeTechnology = (tech: string) => {
    setFormTechnologies((prev) => prev.filter((t) => t !== tech));
  };

  const handleTechInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && p.status) ||
        (selectedStatus === 'draft' && !p.status);
      const matchesImportance =
        selectedImportance === 'all' ||
        (selectedImportance === 'important' && p.important) ||
        (selectedImportance === 'normal' && !p.important);
      return matchesSearch && matchesCategory && matchesStatus && matchesImportance;
    })
    // Tri : projets importants d'abord, puis publiés avant brouillons
    .sort((a, b) => {
      if (a.important !== b.important) return a.important ? -1 : 1;
      if (a.status !== b.status) return a.status ? -1 : 1;
      return 0;
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
      important: formImportant,
      image: formImage ? URL.createObjectURL(formImage) : undefined,
      githubUrl: formCodeSource || undefined,
      demoUrl: formUrl || undefined,
      doc: formDoc ? URL.createObjectURL(formDoc) : undefined,
      technologies: formTechnologies,
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsCreateModalOpen(false);
    setFormName('');
    setFormDesc('');
    setFormCat('Web');
    setFormStatus(true);
    setFormImage(null);
    setFormUrl('');
    setFormCodeSource('');
    setFormDoc(null);
    setFormImportant(false);
    setFormTechnologies([]);
    setTechInput('');
    toast.success('Projet créé !', `Le projet "${newProject.name}" a été ajouté.`);
  };

  const handleDeleteProject = () => {
    if (!deleteConfirmProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteConfirmProject.id));
    toast.info('Projet supprimé', `"${deleteConfirmProject.name}" a été retiré.`);
    setDeleteConfirmProject(null);
  };

  const toggleImportant = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const next = !target.important;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, important: next } : p))
    );
    toast.info(next ? 'Projet mis en avant' : 'Projet retiré de la une');
  };

  const toggleStatus = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const next = !target.status;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: next } : p))
    );
    toast.info(next ? 'Projet publié' : 'Projet passé en brouillon');
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

        {/* Filtre par Importance */}
        <select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          className="field-select"
        >
          <option value="all">Toutes importances</option>
          <option value="important">Importants</option>
          <option value="normal">Normaux</option>
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
                  <span className="badge badge-neutral">
                    {project.status ? '● Publié' : '○ Brouillon'}
                  </span>
                </div>

                <div className="project-quick-actions">
                  <button
                    type="button"
                    className={`status-btn ${project.status ? 'active' : ''}`}
                    onClick={() => toggleStatus(project.id)}
                    title={project.status ? 'Repasser en brouillon' : 'Publier'}
                  >
                    {project.status ? <LuGlobe /> : <LuGlobeLock />}
                  </button>
                  <button
                    type="button"
                    className={`star-btn ${project.important ? 'active' : ''}`}
                    onClick={() => toggleImportant(project.id)}
                    title={project.important ? 'Mis en avant' : 'Mettre en avant'}
                  >
                    <LuStar />
                  </button>
                </div>
              </div>

              <div className="project-body">
                <h3>{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="project-tech-list">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                )}
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
          <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
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

              <div className="field-row-triple">
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
                    value={formStatus ? 'published' : 'draft'}
                    onChange={(e) => setFormStatus(e.target.value === 'published')}
                    className="field-select"
                  >
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="pimportant">Importance</label>
                  <select
                    id="pimportant"
                    value={formImportant ? 'important' : 'normal'}
                    onChange={(e) => setFormImportant(e.target.value === 'important')}
                    className="field-select"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
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

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="pimage">Image (PNG/JPG) — optionnel</label>
                  <input
                    id="pimage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                  />
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
              </div>

              <div className="field">
                <label htmlFor="ptech">Technologies</label>
                <div className="tech-input-row">
                  <select
                    id="ptech"
                    className="field-select"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                  >
                    <option value="">Choisir une technologie...</option>
                    {availableSkills
                      .filter((skill) => !formTechnologies.includes(skill))
                      .map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addTechnology}
                  >
                    <LuPlus className="btn-icon" /> Ajouter
                  </button>
                </div>
                {formTechnologies.length > 0 && (
                  <div className="tech-chips">
                    {formTechnologies.map((tech) => (
                      <span key={tech} className="tech-chip">
                        <LuCode className="tech-chip-icon" />
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          title={`Retirer ${tech}`}
                        >
                          <LuX />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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