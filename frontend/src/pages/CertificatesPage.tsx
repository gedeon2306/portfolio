import { useState, useMemo, useEffect } from "react";
import { 
  FiArrowLeft, 
  FiArrowUpRight, 
  FiAward, 
  FiCheckCircle, 
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getCertificates } from "../api/Actions";
import type { Certificate } from "../types/Types";
import { formatCertDate, extractYear, getAvailableYears } from "../utils/dateUtils";
import "../css/CertificatesPage.css";

const CERTIFICATION_CATEGORIES = [
  { value: 'IA', label: 'Intelligence Artificielle' },
  { value: 'Web', label: 'Développement Web' },
  { value: 'Mobile', label: 'Développement Mobile' },
  { value: 'Data Base', label: 'Base de Données' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'UI/UX', label: 'UI/UX Design' },
  { value: 'Réseaux', label: 'Réseaux et Télécommunications' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Langue', label: 'Langue' },
  { value: 'Gestion de Projet', label: 'Gestion de Projet' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
  { value: 'Linux', label: 'Administration Linux' },
  { value: 'Data', label: 'Science des Données' },
  { value: 'Cloud', label: 'Cloud Computing' },
  { value: 'Langage de Programmation', label: 'Langage de Programmation' },
  { value: 'Autre', label: 'Autre' },
];

export default function CertificatesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: certificatesData, isLoading, error } = useQuery({
    queryKey: ['certificates'],
    queryFn: getCertificates,
  });

  const certificates = certificatesData?.certificats || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const availableYears = useMemo(() => {
    return getAvailableYears(certificates);
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    let filtered = certificates;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (cert) =>
          cert.titre.toLowerCase().includes(term) ||
          cert.description.toLowerCase().includes(term) ||
          cert.organisme.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((cert) => cert.categorie === selectedCategory);
    }

    if (selectedYear) {
      filtered = filtered.filter((cert) => extractYear(cert.date) === selectedYear);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedYear, certificates]);

  const handleCertClick = (cert: Certificate, e: React.MouseEvent) => {
    e.preventDefault();
    if (cert.url) {
      window.open(cert.url, "_blank", "noopener,noreferrer");
      toast.success(
        "Certificat vérifié",
        `Ouverture du certificat de ${cert.organisme}...`
      );
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: "certificates" } });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedYear("");
  };

  const getCategoryLabel = (value: string) => {
    const category = CERTIFICATION_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedYear;

  if (error) {
    console.error("Erreur lors du chargement des certifications:", error);
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pf-certificates-page">
          <div className="pf-container">
            <div className="pf-cert-page-header">
              <Link to="/" className="pf-back-button" onClick={handleBack}>
                <FiArrowLeft size={20} />
                <span>Retour au portfolio</span>
              </Link>
            </div>
            <div className="pf-cert-loading">
              <div className="pf-spinner" />
              <p>Chargement des certificats...</p>
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
      <div className="pf-certificates-page">
        <div className="pf-container">
          <div className="pf-cert-page-header">
            <Link 
              to="/"
              className="pf-back-button"
              onClick={handleBack}
            >
              <FiArrowLeft size={20} />
              <span>Retour au portfolio</span>
            </Link>
            
            <div className="pf-cert-page-title-section">
              <span className="pf-eyebrow">Accréditations & Diplômes</span>
              <h1 className="pf-cert-page-title">Tous mes Certificats</h1>
              <p className="pf-cert-page-subtitle">
                L'ensemble de mes certifications professionnelles obtenues auprès des leaders technologiques mondiaux.
                {certificates.length} certificats validés.
              </p>
            </div>
          </div>

          <div className="pf-cert-search-section">
            <div className="pf-search-bar">
              <FiSearch className="pf-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un certificat par titre, description ou émetteur..."
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
                  {CERTIFICATION_CATEGORIES.map((cat) => (
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

          <div className="pf-cert-results">
            <div className="pf-cert-results-header">
              <span className="pf-cert-count">
                {filteredCertificates.length} certificat{filteredCertificates.length > 1 ? 's' : ''}
                {hasActiveFilters && ' trouvé(s)'}
              </span>
              {hasActiveFilters && (
                <span className="pf-cert-filters-active">
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

            {filteredCertificates.length === 0 ? (
              <div className="pf-cert-empty">
                <FiAward size={48} className="pf-empty-icon" />
                <h3>Aucun certificat trouvé</h3>
                <p>Aucun certificat ne correspond à vos critères de recherche.</p>
                <button
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="pf-cert-grid-full">
                {filteredCertificates.map((cert) => (
                  <article key={cert.id} className="pf-cert-card">
                    <div className="pf-cert-thumb">
                      <img
                        src={cert.image || "/assets/certificates/default.svg"}
                        alt={cert.titre}
                        className="pf-cert-thumb-image"
                      />
                      <div className="pf-cert-thumb-pattern">
                        <FiAward className="pf-thumb-watermark" />
                      </div>
                      <span className="badge badge-black pf-cert-badge-top">
                        <FiCheckCircle size={12} className="verified-icon" />
                        <span>Vérifié</span>
                      </span>
                    </div>

                    <div className="pf-cert-body">
                      <div className="pf-cert-meta-top">
                        <span className="badge badge-accent pf-cert-category">
                          {getCategoryLabel(cert.categorie)}
                        </span>
                        <span className="pf-cert-date">{formatCertDate(cert.date)}</span>
                      </div>

                      <h3 className="pf-cert-title">{cert.titre}</h3>
                      <p className="pf-cert-desc">{cert.description}</p>

                      <div className="pf-cert-footer">
                        <div className="pf-cert-issuer-box">
                          <span className="pf-issuer-name">{cert.organisme}</span>
                          <span className="pf-cred-id font-mono">ID: {cert.credentialId}</span>
                        </div>

                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="pf-cert-action"
                            onClick={(e) => handleCertClick(cert, e)}
                            title="Voir le certificat"
                          >
                            <span>Vérifier</span>
                            <FiArrowUpRight size={14} className="link-arrow" />
                          </a>
                        )}
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