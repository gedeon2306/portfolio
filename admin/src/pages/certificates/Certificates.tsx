import { useState } from 'react';
import {
  LuPlus,
  LuSearch,
  LuTrash2,
  LuExternalLink,
  LuAward,
  LuX,
  LuBadgeCheck
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
};

const initialCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    titre: 'AWS Certified Solutions Architect',
    description: 'Certification validant la conception d’architectures distribuées et évolutives sur Amazon Web Services.',
    url: 'https://aws.amazon.com/verification',
    dateObtention: '2025',
    organisme: 'Amazon Web Services',
  },
  {
    id: 'cert-2',
    titre: 'Meta Front-End Developer Professional',
    description: 'Parcours complet couvrant React, JavaScript moderne, HTML5/CSS3, UX/UI et intégration d’APIs REST.',
    url: 'https://coursera.org/verify/meta-frontend',
    dateObtention: '2024',
    organisme: 'Meta',
  },
  {
    id: 'cert-3',
    titre: 'Django Web Framework Specialist',
    description: 'Maîtrise de l’ORM Django, de Django REST Framework, des signaux et de l’authentification JWT sécurisée.',
    url: 'https://djangoproject.com',
    dateObtention: '2024',
    organisme: 'Python Software Foundation',
  },
];

export default function Certificates() {
  const toast = useToast();
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  // Form State
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [organisme, setOrganisme] = useState('');
  const [dateObtention, setDateObtention] = useState('');
  const [image, setImage] = useState('');

  const filteredCertificates = certificates.filter((cert) =>
    cert.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cert.organisme && cert.organisme.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setEditingCert(null);
    setTitre('');
    setDescription('');
    setUrl('');
    setOrganisme('');
    setDateObtention('');
    setImage('');
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
            ? { ...c, titre: titre.trim(), description: description.trim(), url: url.trim(), organisme: organisme.trim(), dateObtention: dateObtention.trim(), image }
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

      {/* Barre de Recherche */}
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
                  <div>
                    <span className="badge badge-accent">{cert.organisme || 'Certification'}</span>
                    {cert.dateObtention && (
                      <span className="cert-date font-mono">{cert.dateObtention}</span>
                    )}
                  </div>
                </div>
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
