import { useState, type KeyboardEvent, useEffect } from 'react';
import {
  LuPlus,
  LuSearch,
  LuTrash2,
  LuExternalLink,
  LuAward,
  LuX,
  LuBadgeCheck,
  LuStar,
  LuGlobe,
  LuGlobeLock,
  LuImage,
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import {
  fetchCertificates,
  createCertificate,
  updateCertificate,
  patchCertificate,
  deleteCertificate,
  fetchCertificateCategories,
} from '../../api/Actions';
import type { Certificate, CertificateFormData, CertificateListResponse } from '../../types/Types';
import './Certificates.css';

const initialFormData: CertificateFormData = {
  titre: '',
  description: '',
  categorie: 'Web',
  organisme: '',
  date: '',
  url: '',
  status: true,
  important: false,
};

export default function Certificates() {
  const toast = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteConfirmCert, setDeleteConfirmCert] = useState<Certificate | null>(null);

  // Form State
  const [formData, setFormData] = useState<CertificateFormData>(initialFormData);
  const [formImage, setFormImage] = useState<File | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Chargement des données
  const fetchCertificatesData = async (page = 1) => {
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

      const response = await fetchCertificates(params);
      setCertificates(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / pageSize));
      setCurrentPage(page);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de charger les certificats');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await fetchCertificateCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      // Fallback sur les catégories par défaut
      setCategories([
        'IA', 'Web', 'Mobile', 'Data Base', 'DevOps', 'UI/UX',
        'Réseaux', 'Cybersécurité', 'Langue', 'Gestion de Projet',
        'Marketing Digital', 'Linux', 'Data', 'Cloud',
        'Langage de Programmation', 'Autre'
      ]);
    }
  };

  useEffect(() => {
    fetchCertificatesData(1);
    fetchCategories();
  }, []);

  // Recharger quand les filtres changent
  useEffect(() => {
    fetchCertificatesData(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedImportance]);

  const resetForm = () => {
    setFormData(initialFormData);
    setFormImage(null);
    setEditingCert(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      id: cert.id,
      titre: cert.titre,
      description: cert.description,
      categorie: cert.categorie,
      organisme: cert.organisme || '',
      date: cert.date || '',
      url: cert.url || '',
      status: cert.status,
      important: cert.important,
    });
    setFormImage(null);
    setIsModalOpen(true);
  };

  const handleSaveCertificate = async () => {
    if (!formData.titre.trim() || !formData.description.trim()) {
      toast.error('Champs manquants', 'Veuillez renseigner le titre et la description de la certification.');
      return;
    }

    setIsFormSubmitting(true);
    try {
      if (editingCert) {
        await updateCertificate(editingCert.id, {
          titre: formData.titre.trim(),
          description: formData.description.trim(),
          categorie: formData.categorie,
          organisme: formData.organisme || undefined,
          date: formData.date || undefined,
          url: formData.url || undefined,
          status: formData.status,
          important: formData.important,
          image: formImage || undefined,
        });
        toast.success('Certificat mis à jour', `La certification "${formData.titre}" a été modifiée.`);
      } else {
        await createCertificate({
          titre: formData.titre.trim(),
          description: formData.description.trim(),
          categorie: formData.categorie,
          organisme: formData.organisme || undefined,
          date: formData.date || undefined,
          url: formData.url || undefined,
          status: formData.status,
          important: formData.important,
          image: formImage || undefined,
        });
        toast.success('Certificat ajouté !', `La certification "${formData.titre}" a été ajoutée.`);
      }

      setIsModalOpen(false);
      resetForm();
      fetchCertificatesData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de sauvegarder le certificat');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!deleteConfirmCert) return;
    try {
      await deleteCertificate(deleteConfirmCert.id);
      toast.info('Certificat supprimé', `"${deleteConfirmCert.titre}" a été retiré.`);
      setDeleteConfirmCert(null);
      fetchCertificatesData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de supprimer le certificat');
    }
  };

  const toggleImportant = async (id: string) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;
    const next = !target.important;
    try {
      await patchCertificate(id, { important: next });
      toast.info(next ? 'Certificat mis en avant' : 'Certificat retiré de la une');
      fetchCertificatesData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de mettre à jour');
    }
  };

  const toggleStatus = async (id: string) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;
    const next = !target.status;
    try {
      await patchCertificate(id, { status: next });
      toast.info(next ? 'Certificat publié' : 'Certificat passé en brouillon');
      fetchCertificatesData(currentPage);
    } catch (error: any) {
      toast.error('Erreur', error.message || 'Impossible de mettre à jour');
    }
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'Date inconnue';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderCertificateCard = (cert: Certificate) => (
    <article key={cert.id} className="certificate-card">
      <div className="certificate-card-top">
        <div className="cert-badge-wrap">
          <div className="cert-badge-icon">
            <LuBadgeCheck />
          </div>
          <span className="cert-org-name">{cert.organisme || 'Certification'}</span>
        </div>

        <div className="cert-quick-actions">
          <button
            type="button"
            className={`status-btn ${cert.status ? 'active' : ''}`}
            onClick={() => toggleStatus(cert.id)}
            title={cert.status ? 'Repasser en brouillon' : 'Publier'}
          >
            {cert.status ? <LuGlobe /> : <LuGlobeLock />}
          </button>
          <button
            type="button"
            className={`star-btn ${cert.important ? 'active' : ''}`}
            onClick={() => toggleImportant(cert.id)}
            title={cert.important ? 'Mis en avant' : 'Mettre en avant'}
          >
            <LuStar />
          </button>
        </div>
      </div>

      <div className="cert-meta-row">
        <span className="badge badge-accent">{cert.categorie}</span>
        <span className="badge badge-neutral">
          {cert.status ? '● Publié' : '○ Brouillon'}
        </span>
        {cert.date && (
          <span className="cert-date font-mono">{formatDate(cert.date)}</span>
        )}
      </div>

      {cert.image && (
        <div className="cert-image-wrapper">
          <img 
            src={cert.image} 
            alt={cert.titre} 
            className="cert-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="certificate-body">
        <h3>{cert.titre}</h3>
        <p>{cert.description}</p>
      </div>

      <div className="certificate-footer">
        {cert.url ? (
          <a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-xs cert-link-btn"
          >
            <LuExternalLink className="btn-icon" /> Vérifier le diplôme
          </a>
        ) : (
          <span className="text-xs text-tertiary font-mono">Attestation enregistrée</span>
        )}

        <div className="project-actions">
          <button
            type="button"
            className="btn btn-ghost btn-icon-only"
            onClick={() => handleOpenEditModal(cert)}
            title="Modifier"
          >
            <FiEdit3 />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon-only danger"
            onClick={() => setDeleteConfirmCert(cert)}
            title="Supprimer"
          >
            <LuTrash2 />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="certificates-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Accréditations & Diplômes</p>
          <h2>Certificats & Certifications</h2>
        </div>

        <div className="header-actions">
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            <LuPlus className="btn-icon" /> Ajouter une certification
          </button>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="projects-toolbar">
        <div className="search-input-wrap flex-1">
          <LuSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par titre, organisme ou compétences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtre par Catégorie */}
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
      </div>

      {/* Grille de Certificats */}
      {isLoading ? (
        <div className="panel-card loading-panel">
          <Spinner color="#6366f1" />
          <p>Chargement des certificats...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="panel-card empty-projects-panel">
          <LuAward className="empty-icon" />
          <h3>Aucun certificat trouvé</h3>
          <p>Ajoutez vos diplômes, accréditations et badges de compétences.</p>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            <LuPlus className="btn-icon" /> Ajouter un certificat
          </button>
        </div>
      ) : (
        <>
          <div className="certificates-grid">
            {certificates.map(renderCertificateCard)}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => fetchCertificatesData(page)}
          />
        </>
      )}

      {/* Modal Création / Édition */}
      {isModalOpen && (
        <CertificateModal
          title={editingCert ? 'Modifier la certification' : 'Ajouter une nouvelle certification'}
          submitLabel={editingCert ? 'Mettre à jour' : 'Enregistrer le certificat'}
          isSubmitting={isFormSubmitting}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleSaveCertificate}
          formData={formData}
          setFormData={setFormData}
          formImage={formImage}
          setFormImage={setFormImage}
          categories={categories}
          isEdit={!!editingCert}
          currentImage={editingCert?.image}
        />
      )}

      {/* Modal Confirmation de Suppression */}
      {deleteConfirmCert && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmCert(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setDeleteConfirmCert(null)}
              >
                <LuX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement la certification{' '}
                <strong>« {deleteConfirmCert.titre} »</strong> ?
              </p>
              {deleteConfirmCert.image && (
                <div className="delete-image-preview">
                  <img src={deleteConfirmCert.image} alt="" />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmCert(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteCertificate}
              >
                Supprimer le certificat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Modal pour les certificats
interface CertificateModalProps {
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: CertificateFormData;
  setFormData: (data: CertificateFormData | ((prev: CertificateFormData) => CertificateFormData)) => void;
  formImage: File | null;
  setFormImage: (file: File | null) => void;
  categories: string[];
  isEdit: boolean;
  currentImage?: string | null;
}

function CertificateModal({
  title,
  submitLabel,
  isSubmitting,
  onClose,
  onSubmit,
  formData,
  setFormData,
  formImage,
  setFormImage,
  categories,
  isEdit,
  currentImage,
}: CertificateModalProps) {
  const updateField = <K extends keyof CertificateFormData>(
    field: K,
    value: CertificateFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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
            <label htmlFor="ctitre">Titre de la certification *</label>
            <input
              id="ctitre"
              type="text"
              placeholder="Ex: AWS Certified Developer, Master React..."
              value={formData.titre}
              onChange={(e) => updateField('titre', e.target.value)}
              autoFocus
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="field-row-triple">
            <div className="field">
              <label htmlFor="corganisme">Organisme</label>
              <input
                id="corganisme"
                type="text"
                placeholder="Ex: Amazon Web Services, Meta, Coursera..."
                value={formData.organisme}
                onChange={(e) => updateField('organisme', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="field">
              <label htmlFor="cdate">Date d'obtention</label>
              <input
                id="cdate"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="field">
              <label htmlFor="ccategorie">Catégorie *</label>
              <select
                id="ccategorie"
                value={formData.categorie}
                onChange={(e) => updateField('categorie', e.target.value)}
                className="field-select"
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row-dual">
            <div className="field">
              <label htmlFor="curl">URL de vérification (optionnel)</label>
              <input
                id="curl"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => updateField('url', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="field">
              <label htmlFor="cimage">Image (PNG/JPG) — optionnel</label>
              {isEdit && currentImage && !formImage && (
                <div className="current-image-preview">
                  <img src={currentImage} alt="Image actuelle" />
                  <p className="text-xs text-tertiary">Image actuelle</p>
                </div>
              )}
              <input
                id="cimage"
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
          </div>

          <div className="field-row-dual">
            <div className="field">
              <label htmlFor="cstatus">Statut de publication</label>
              <select
                id="cstatus"
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
              <label htmlFor="cimportant">Importance</label>
              <select
                id="cimportant"
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
            <label htmlFor="cdesc">Description & Domaines d'expertise *</label>
            <textarea
              id="cdesc"
              placeholder="Précisez les compétences validées par ce certificat..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              disabled={isSubmitting}
              required
            />
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