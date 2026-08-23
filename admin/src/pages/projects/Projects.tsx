import { useState, useEffect } from 'react';
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
  LuCode,
  LuImage,
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import {
  fetchProjects,
  createProject,
  updateProject,
  patchProject,
  deleteProject,
  fetchProjectTechnologies,
} from '../../api/Actions';
import type { Project, Technology } from '../../types/Types';
import './Projects.css';

type ProjectFormData = {
  id?: string;
  titre: string;
  description: string;
  categorie: string;
  status: boolean;
  important: boolean;
  url: string;
  code_source: string;
  technologies: string[];
};

const initialFormData: ProjectFormData = {
  titre: '',
  description: '',
  categorie: 'Web',
  status: true,
  important: false,
  url: '',
  code_source: '',
  technologies: [],
};

// Normalise un projet reçu de l'API (gère les alias de champs et les formats hérités)
const normalizeProject = (project: any): Project => {
  // Les technologies peuvent être des objets { id, libelle, pourcentage } ou de simples strings
  let technologies: Technology[] = [];
  if (Array.isArray(project.technologies)) {
    technologies = project.technologies.map((tech: any) => {
      if (typeof tech === 'string') {
        return { id: tech, libelle: tech, pourcentage: 0 };
      }
      return {
        id: tech.id || tech.libelle,
        libelle: tech.libelle || tech,
        pourcentage: tech.pourcentage || 0,
      };
    });
  }

  return {
    id: project.id,
    titre: project.titre || project.name || '',
    categorie: project.categorie || project.category || '',
    status: project.status ?? false,
    important: project.important ?? false,
    description: project.description || '',
    image: project.image || null,
    url: project.url || project.demoUrl || null,
    code_source: project.code_source || project.githubUrl || null,
    created_at: project.created_at || project.createdAt || new Date().toISOString(),
    updated_at: project.updated_at || project.updatedAt || new Date().toISOString(),
    technologies: technologies,
  };
};

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formDoc, setFormDoc] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Catégories valides pour le backend
  const categories = [
    'Web',
    'Mobile',
    'Desktop',
    'Data base',
    'IA',
    'DevOps',
    'UI/UX',
    'Réseaux',
    'Cybersécurité',
    'API',
    'Productivité',
    'Marketing',
    'Backend',
    'Autre',
  ];

  // Chargement des données
  const fetchProjectsData = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: {
        page: number;
        page_size: number;
        search?: string;
        category?: string;
        status?: string;
        important?: string;
      } = {
        page,
        page_size: pageSize,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedImportance !== 'all') params.important = selectedImportance;

      const response = await fetchProjects(params);
      
      // Normaliser les projets
      const normalizedProjects = response.results.map(normalizeProject);
      setProjects(normalizedProjects);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
      setCurrentPage(page);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de charger les projets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const techs = await fetchProjectTechnologies();
      setAvailableSkills(techs);
    } catch (error) {
      console.error('Erreur chargement technologies:', error);
    }
  };

  useEffect(() => {
    fetchProjectsData(1);
    fetchTechnologies();
  }, []);

  // Recharger quand les filtres changent
  useEffect(() => {
    fetchProjectsData(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedImportance]);

  const addTechnology = () => {
    if (!techInput.trim()) return;
    if (formData.technologies.includes(techInput.trim())) {
      toast.error('Déjà ajoutée', `"${techInput}" est déjà dans la liste.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, techInput.trim()],
    }));
    setTechInput('');
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormImage(null);
    setFormDoc(null);
    setTechInput('');
    setEditingProject(null);
  };

  const handleCreateProject = async () => {
    if (!formData.titre.trim() || !formData.description.trim()) {
      toast.error('Champs manquants', 'Veuillez saisir un titre et une description.');
      return;
    }

    setIsFormSubmitting(true);
    try {
      await createProject({
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        categorie: formData.categorie,
        status: formData.status,
        important: formData.important,
        url: formData.url && formData.url.trim() !== '' ? formData.url.trim() : undefined,
        code_source: formData.code_source && formData.code_source.trim() !== '' ? formData.code_source.trim() : undefined,
        technologies: formData.technologies,
        image: formImage || undefined,
        doc: formDoc || undefined,
      });

      toast.success('Projet créé !', `Le projet "${formData.titre}" a été ajouté.`);
      setIsCreateModalOpen(false);
      resetForm();
      fetchProjectsData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de créer le projet');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      id: project.id,
      titre: project.titre,
      description: project.description,
      categorie: project.categorie,
      status: project.status,
      important: project.important,
      url: project.url || '',
      code_source: project.code_source || '',
      technologies: (project.technologies as Technology[]).map((t) => t.libelle),
    });
    setFormImage(null);
    setFormDoc(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    if (!formData.titre.trim() || !formData.description.trim()) {
      toast.error('Champs manquants', 'Veuillez saisir un titre et une description.');
      return;
    }

    setIsFormSubmitting(true);
    try {
      await updateProject(editingProject.id, {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        categorie: formData.categorie,
        status: formData.status,
        important: formData.important,
        url: formData.url && formData.url.trim() !== '' ? formData.url.trim() : undefined,
        code_source: formData.code_source && formData.code_source.trim() !== '' ? formData.code_source.trim() : undefined,
        technologies: formData.technologies,
        image: formImage || undefined,
        doc: formDoc || undefined,
      });

      toast.success('Projet mis à jour', `"${formData.titre}" a été modifié.`);
      setIsEditModalOpen(false);
      resetForm();
      fetchProjectsData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de mettre à jour le projet');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteConfirmProject) return;
    try {
      await deleteProject(deleteConfirmProject.id);
      toast.info('Projet supprimé', `"${deleteConfirmProject.titre}" a été retiré.`);
      setDeleteConfirmProject(null);
      fetchProjectsData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de supprimer le projet');
    }
  };

  const toggleImportant = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const next = !target.important;
    try {
      await patchProject(id, { important: next });
      toast.info(next ? 'Projet mis en avant' : 'Projet retiré de la une');
      fetchProjectsData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de mettre à jour');
    }
  };

  const toggleStatus = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const next = !target.status;
    try {
      await patchProject(id, { status: next });
      toast.info(next ? 'Projet publié' : 'Projet passé en brouillon');
      fetchProjectsData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de mettre à jour');
    }
  };

  // Formate une date ISO en date lisible (fr-FR), avec repli si invalide
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date inconnue';
      }
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Date inconnue';
    }
  };

  // Retire une technologie existante du projet en cours d'édition
  const removeExistingTechnology = (techLibelle: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== techLibelle),
    }));
    toast.success('Technologie retirée', `"${techLibelle}" a été retirée du projet.`);
  };

  const renderProjectCard = (project: Project) => {
    // Normaliser les technologies pour l'affichage
    const techDisplay = project.technologies.map((tech) => {
      if (typeof tech === 'string') {
        return { id: tech, libelle: tech, pourcentage: 0 };
      }
      return tech;
    });

    return (
      <article key={project.id} className="project-card">
        <div className="project-card-header">
          <div className="project-category-row">
            <span className="badge badge-accent">{project.categorie || 'Non catégorisé'}</span>
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

        {/* Image du projet */}
        {project.image && (
          <div className="project-image-wrapper">
            <img 
              src={project.image} 
              alt={project.titre} 
              className="project-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="project-body">
          <h3>{project.titre}</h3>
          <p className="project-desc">{project.description || 'Aucune description'}</p>
          {techDisplay.length > 0 && (
            <div className="project-tech-list">
              {techDisplay.map((tech) => (
                <span key={tech.id} className="tech-badge">
                  <LuCode className="tech-icon" />
                  {tech.libelle}
                  {tech.pourcentage > 0 && (
                    <span className="tech-percentage"> ({tech.pourcentage}%)</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="project-footer">
          <span className="project-updated text-xs text-tertiary font-mono">
            {formatDate(project.updated_at)}
          </span>

          <div className="project-actions">
            {project.code_source && (
              <a
                href={project.code_source}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-icon-only"
                title="Voir sur GitHub"
              >
                <LuGithub />
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
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
              onClick={() => openEditModal(project)}
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
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="field-select"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="field-select"
        >
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>

        <select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          className="field-select"
        >
          <option value="all">Toutes importances</option>
          <option value="important">Importants</option>
          <option value="normal">Normaux</option>
        </select>

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

      {/* Contenu principal */}
      {isLoading ? (
        <div className="panel-card loading-panel">
          <Spinner color="#6366f1" />
          <p>Chargement des projets...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="panel-card empty-projects-panel">
          <LuFolder className="empty-icon" />
          <h3>Aucun projet trouvé</h3>
          <p>Essayez de modifier vos termes de recherche ou créez un nouveau projet.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
          >
            <LuPlus className="btn-icon" /> Créer un projet
          </button>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid' ? 'projects-grid' : 'projects-list-view'}>
            {projects.map(renderProjectCard)}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => fetchProjectsData(page)}
          />
        </>
      )}

      {/* Modal Création Projet */}
      {isCreateModalOpen && (
        <ProjectModal
          title="Ajouter un Nouveau Projet"
          submitLabel="Créer le projet"
          isSubmitting={isFormSubmitting}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          onSubmit={handleCreateProject}
          formData={formData}
          setFormData={setFormData}
          formImage={formImage}
          setFormImage={setFormImage}
          formDoc={formDoc}
          setFormDoc={setFormDoc}
          techInput={techInput}
          setTechInput={setTechInput}
          addTechnology={addTechnology}
          removeTechnology={removeTechnology}
          availableSkills={availableSkills}
          categories={categories}
          isEdit={false}
          currentTechnologies={[]}
        />
      )}

      {/* Modal Édition Projet */}
      {isEditModalOpen && editingProject && (
        <ProjectModal
          key={editingProject.id}
          title={`Modifier : ${editingProject.titre}`}
          submitLabel="Mettre à jour"
          isSubmitting={isFormSubmitting}
          onClose={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
          onSubmit={handleUpdateProject}
          formData={formData}
          setFormData={setFormData}
          formImage={formImage}
          setFormImage={setFormImage}
          formDoc={formDoc}
          setFormDoc={setFormDoc}
          techInput={techInput}
          setTechInput={setTechInput}
          addTechnology={addTechnology}
          removeTechnology={removeTechnology}
          availableSkills={availableSkills}
          categories={categories}
          isEdit={true}
          currentImage={editingProject.image}
          currentTechnologies={editingProject.technologies.map((t) =>
            typeof t === 'string' ? { id: t, libelle: t, pourcentage: 0 } : t
          )}
          onRemoveExistingTechnology={removeExistingTechnology}
        />
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
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement le projet{' '}
                <strong>« {deleteConfirmProject.titre} »</strong> ?
              </p>
              {deleteConfirmProject.image && (
                <div className="delete-image-preview">
                  <img src={deleteConfirmProject.image} alt="" />
                </div>
              )}
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

// Composant Modal réutilisable pour Création et Édition
interface ProjectModalProps {
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData | ((prev: ProjectFormData) => ProjectFormData)) => void;
  formImage: File | null;
  setFormImage: (file: File | null) => void;
  formDoc: File | null;
  setFormDoc: (file: File | null) => void;
  techInput: string;
  setTechInput: (value: string) => void;
  addTechnology: () => void;
  removeTechnology: (tech: string) => void;
  availableSkills: string[];
  categories: string[];
  isEdit?: boolean;
  currentImage?: string | null;
  currentTechnologies?: Technology[];
  onRemoveExistingTechnology?: (techLibelle: string) => void;
}

function ProjectModal({
  title,
  submitLabel,
  isSubmitting,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formImage,
  setFormImage,
  formDoc,
  setFormDoc,
  techInput,
  setTechInput,
  addTechnology,
  removeTechnology,
  availableSkills,
  categories,
  isEdit = false,
  currentImage,
}: ProjectModalProps) {
  const updateField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Compétences disponibles dans la liste déroulante (déjà sélectionnées exclues)
  const availableTechOptions = availableSkills.filter(
    (skill) => !formData.technologies.includes(skill)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="btn btn-ghost btn-icon-only"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <LuX />
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label htmlFor="pname">Nom du projet *</label>
            <input
              id="pname"
              type="text"
              placeholder="Ex: App Web SaaS, Interface Mobile..."
              value={formData.titre}
              onChange={(e) => updateField('titre', e.target.value)}
              autoFocus
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="field-row-triple">
            <div className="field">
              <label htmlFor="pcat">Catégorie *</label>
              <select
                id="pcat"
                value={formData.categorie}
                onChange={(e) => updateField('categorie', e.target.value)}
                className="field-select"
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="pstatus">Statut de publication</label>
              <select
                id="pstatus"
                value={formData.status ? 'published' : 'draft'}
                onChange={(e) => updateField('status', e.target.value === 'published')}
                className="field-select"
                disabled={isSubmitting}
              >
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="pimportant">Importance</label>
              <select
                id="pimportant"
                value={formData.important ? 'important' : 'normal'}
                onChange={(e) => updateField('important', e.target.value === 'important')}
                className="field-select"
                disabled={isSubmitting}
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="pdesc">Description détaillée *</label>
            <textarea
              id="pdesc"
              placeholder="Résumez l'objectif du projet, les technologies utilisées..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="field-row-dual">
            <div className="field">
              <label htmlFor="purl">URL Démo (optionnel)</label>
              <input
                id="purl"
                type="url"
                placeholder="https://demo.exemple.com"
                value={formData.url}
                onChange={(e) => updateField('url', e.target.value)}
                disabled={isSubmitting}
              />
              <p className="field-hint text-xs text-tertiary">
                Laissez vide si vous n'avez pas de démo en ligne
              </p>
            </div>

            <div className="field">
              <label htmlFor="psource">Code source (Git) (optionnel)</label>
              <input
                id="psource"
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.code_source}
                onChange={(e) => updateField('code_source', e.target.value)}
                disabled={isSubmitting}
              />
              <p className="field-hint text-xs text-tertiary">
                Laissez vide si le code n'est pas public
              </p>
            </div>
          </div>

          <div className="field-row-dual">
            <div className="field">
              <label htmlFor="pimage">Image (PNG/JPG) — optionnel</label>
              {isEdit && currentImage && !formImage && (
                <div className="current-image-preview">
                  <img src={currentImage} alt="Image actuelle" />
                  <p className="text-xs text-tertiary">Image actuelle</p>
                </div>
              )}
              <input
                id="pimage"
                type="file"
                accept="image/*"
                onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                disabled={isSubmitting}
              />
              {formImage && (
                <p className="file-name text-xs text-tertiary">
                  <LuImage className="file-icon" /> {formImage.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="pdoc">Documentation (PDF, optionnel)</label>
              <input
                id="pdoc"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFormDoc(e.target.files ? e.target.files[0] : null)}
                disabled={isSubmitting}
              />
              {formDoc && (
                <p className="file-name text-xs text-tertiary">
                  📎 {formDoc.name}
                </p>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="ptech">Technologies</label>
            <p className="field-hint text-xs text-tertiary">
              {isEdit
                ? 'Cliquez sur le X pour retirer une technologie existante, ou sélectionnez-en une nouvelle dans la liste'
                : 'Sélectionnez une compétence dans la liste déroulante puis cliquez sur Ajouter'
              }
            </p>

            {/* Sélection d'une technologie dans la liste déroulante des compétences existantes */}
            <div className="tech-input-row">
              <select
                id="ptech"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="field-select flex-1"
                disabled={isSubmitting || availableTechOptions.length === 0}
              >
                <option value="">
                  {availableTechOptions.length === 0
                    ? 'Toutes les compétences sont déjà sélectionnées'
                    : 'Sélectionner une compétence...'}
                </option>
                {availableTechOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addTechnology}
                disabled={isSubmitting || !techInput}
              >
                <LuPlus className="btn-icon" /> Ajouter
              </button>
            </div>

            {/* Technologies sélectionnées pour ce projet */}
            {formData.technologies.length > 0 && (
              <div className="tech-chips">
                <p className="text-xs text-secondary">Technologies sélectionnées :</p>
                {formData.technologies.map((tech) => (
                  <span key={tech} className="tech-chip tech-chip-new">
                    <LuCode className="tech-chip-icon" />
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      title={`Retirer ${tech}`}
                      disabled={isSubmitting}
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
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner color="#ffffff" /> : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}