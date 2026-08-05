import { useState } from 'react';
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
  LuGlobeLock
} from 'react-icons/lu';
import { FiEdit3 } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import './Certificates.css';

export type CertificateItem = {
  id: string;
  titre: string;
  description: string;
  image?: string;
  url?: string;
  dateObtention?: string;
  organisme?: string;
  status: boolean; // true = publié, false = brouillon
  important: boolean;
};

const initialCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    titre: 'AWS Certified Solutions Architect',
    description: 'Certification validant la conception d’architectures distribuées et évolutives sur Amazon Web Services.',
    url: 'https://aws.amazon.com/verification',
    dateObtention: '2025',
    organisme: 'Amazon Web Services',
    status: true,
    important: true,
  },
  {
    id: 'cert-2',
    titre: 'Meta Front-End Developer Professional',
    description: 'Parcours complet couvrant React, JavaScript moderne, HTML5/CSS3, UX/UI et intégration d’APIs REST.',
    url: 'https://coursera.org/verify/meta-frontend',
    dateObtention: '2024',
    organisme: 'Meta',
    status: true,
    important: false,
  },
  {
    id: 'cert-3',
    titre: 'Django Web Framework Specialist',
    description: 'Maîtrise de l’ORM Django, de Django REST Framework, des signaux et de l’authentification JWT sécurisée.',
    url: 'https://djangoproject.com',
    dateObtention: '2024',
    organisme: 'Python Software Foundation',
    status: false,
    important: false,
  },
];

export default function Certificates() {
  const toast = useToast();
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  // Form State
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [organisme, setOrganisme] = useState('');
  const [dateObtention, setDateObtention] = useState('');
  const [image, setImage] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);
  const [formImportant, setFormImportant] = useState<boolean>(false);

  const filteredCertificates = certificates
    .filter((cert) => {
      const matchesSearch =
        cert.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.organisme && cert.organisme.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && cert.status) ||
        (selectedStatus === 'draft' && !cert.status);
      const matchesImportance =
        selectedImportance === 'all' ||
        (selectedImportance === 'important' && cert.important) ||
        (selectedImportance === 'normal' && !cert.important);
      return matchesSearch && matchesStatus && matchesImportance;
    })
    // Tri : certifications importantes d'abord, puis publiées avant brouillons
    .sort((a, b) => {
      if (a.important !== b.important) return a.important ? -1 : 1;
      if (a.status !== b.status) return a.status ? -1 : 1;
      return 0;
    });

  const handleOpenCreateModal = () => {
    setEditingCert(null);
    setTitre('');
    setDescription('');
    setUrl('');
    setOrganisme('');
    setDateObtention('');
    setImage('');
    setFormStatus(true);
    setFormImportant(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cert: CertificateItem) => {
    setEditingCert(cert);
    setTitre(cert.titre);
    setDescription(cert.description);
    setUrl(cert.url || '');
    setOrganisme(cert.organisme || '');
    setDateObtention(cert.dateObtention || '');
    setImage(cert.image || '');
    setFormStatus(cert.status);
    setFormImportant(cert.important);
    setIsModalOpen(true);
  };

  const handleSaveCertificate = () => {
    if (!titre.trim() || !description.trim()) {
      toast.error('Champs manquants', 'Veuillez renseigner le titre et la description de la certification.');
      return;
    }

    if (editingCert) {
      setCertificates((prev) =>
        prev.map((c) =>
          c.id === editingCert.id
            ? { ...c, titre: titre.trim(), description: description.trim(), url: url.trim(), organisme: organisme.trim(), dateObtention: dateObtention.trim(), image, status: formStatus, important: formImportant }
            : c
        )
      );
      toast.success('Certificat mis à jour', `La certification "${titre}" a été modifiée.`);
    } else {
      const newCert: CertificateItem = {
        id: `cert-${Date.now()}`,
        titre: titre.trim(),
        description: description.trim(),
        url: url.trim(),
        organisme: organisme.trim() || 'Organisme de certification',
        dateObtention: dateObtention.trim() || new Date().getFullYear().toString(),
        image,
        status: formStatus,
        important: formImportant,
      };
      setCertificates((prev) => [newCert, ...prev]);
      toast.success('Certificat ajouté !', `La certification "${newCert.titre}" a été ajoutée.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCertificate = (id: string, certTitre: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    toast.info('Certificat supprimé', `"${certTitre}" a été retiré.`);
  };

  const toggleImportant = (id: string) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;
    const next = !target.important;
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, important: next } : c))
    );
    toast.info(next ? 'Certificat mis en avant' : 'Certificat retiré de la une');
  };

  const toggleStatus = (id: string) => {
    const target = certificates.find((c) => c.id === id);
    if (!target) return;
    const next = !target.status;
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: next } : c))
    );
    toast.info(next ? 'Certificat publié' : 'Certificat passé en brouillon');
  };

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
      {filteredCertificates.length === 0 ? (
        <div className="panel-card empty-projects-panel">
          <LuAward className="empty-icon" />
          <h3>Aucun certificat trouvé</h3>
          <p>Ajoutez vos diplômes, accréditations et badges de compétences.</p>
          <button type="button" className="btn btn-primary" onClick={handleOpenCreateModal}>
            <LuPlus className="btn-icon" /> Ajouter un certificat
          </button>
        </div>
      ) : (
        <div className="certificates-grid">
          {filteredCertificates.map((cert) => (
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
                <span className="badge badge-neutral">
                  {cert.status ? '● Publié' : '○ Brouillon'}
                </span>
                {cert.dateObtention && (
                  <span className="cert-date font-mono">{cert.dateObtention}</span>
                )}
              </div>

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
                    onClick={() => handleDeleteCertificate(cert.id, cert.titre)}
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

      {/* Modal Création / Édition */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCert ? 'Modifier la certification' : 'Ajouter une nouvelle certification'}</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setIsModalOpen(false)}
              >
                <LuX />
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label htmlFor="ctitre">Titre de la certification</label>
                <input
                  id="ctitre"
                  type="text"
                  placeholder="Ex: AWS Certified Developer, Master React..."
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="corganisme">Organisme / Émetteur</label>
                  <input
                    id="corganisme"
                    type="text"
                    placeholder="Ex: Amazon Web Services, Meta, Coursera..."
                    value={organisme}
                    onChange={(e) => setOrganisme(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="cdate">Année / Date d'obtention</label>
                  <input
                    id="cdate"
                    type="text"
                    placeholder="Ex: 2026"
                    value={dateObtention}
                    onChange={(e) => setDateObtention(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="curl">URL de vérification ou badge</label>
                  <input
                    id="curl"
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="cimage">Image (PNG/JPG) — optionnel</label>
                  <input
                    id="cimage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setImage(file ? URL.createObjectURL(file) : '');
                    }}
                  />
                </div>
              </div>

              <div className="field-row-dual">
                <div className="field">
                  <label htmlFor="cstatus">Statut de publication</label>
                  <select
                    id="cstatus"
                    value={formStatus ? 'published' : 'draft'}
                    onChange={(e) => setFormStatus(e.target.value === 'published')}
                    className="field-select"
                  >
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="cimportant">Importance</label>
                  <select
                    id="cimportant"
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
                <label htmlFor="cdesc">Description & Domaines d'expertise</label>
                <textarea
                  id="cdesc"
                  placeholder="Précisez les compétences validées par ce certificat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveCertificate}
              >
                {editingCert ? 'Mettre à jour' : 'Enregistrer le certificat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}