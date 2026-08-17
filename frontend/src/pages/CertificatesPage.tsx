import { useState, useMemo, useEffect } from "react";
import { 
  FiArrowLeft, 
  FiArrowUpRight, 
  FiAward, 
  FiCheckCircle, 
  FiSearch,
  FiFilter,
  FiX
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/CertificatesPage.css";

interface Certificate {
  id: string;
  category: string;
  title: string;
  description: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
  image: string;
}

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

const CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    category: "Web",
    title: "Full-Stack Web Development Professional",
    description:
      "Certification avancée couvrant les architectures modernes React, TypeScript, APIs RESTful et Django.",
    issuer: "Meta",
    date: "Mars 2025",
    credentialId: "META-FS-98214",
    url: "https://coursera.org",
    image: "/assets/certificates/web-development.svg",
  },
  {
    id: "cert-2",
    category: "IA",
    title: "AI & Generative Models Specialist",
    description:
      "Spécialisation en intégration d'IA générative, embeddings, LLM orchestration et architectures neuro-vectorielles.",
    issuer: "Google Cloud",
    date: "Janvier 2025",
    credentialId: "GCP-AI-44102",
    url: "https://cloud.google.com",
    image: "/assets/certificates/ai-professional.svg",
  },
  {
    id: "cert-3",
    category: "Data Base",
    title: "Database Administrator & Data Modeling",
    description:
      "Maîtrise de l'architecture des données relationnelles et NoSQL (PostgreSQL, MySQL, Redis, MongoDB).",
    issuer: "IBM",
    date: "Novembre 2026",
    credentialId: "IBM-DB-78193",
    url: "https://ibm.com",
    image: "/assets/certificates/database-administrator.svg",
  },
  {
    id: "cert-4",
    category: "Cloud",
    title: "Cloud Solutions Architect",
    description:
      "Conception et déploiement d'infrastructures résilientes et scalables, conteneurisation Docker et CI/CD.",
    issuer: "AWS / Coursera",
    date: "Septembre 2026",
    credentialId: "AWS-CSA-31804",
    url: "https://aws.amazon.com",
    image: "/assets/certificates/cloud-solutions-architect.svg",
  },
  {
    id: "cert-5",
    category: "Langage de Programmation",
    title: "Advanced Software Design & Clean Code",
    description:
      "Principes SOLID, design patterns avancés, tests unitaires/E2E et refactoring d'applications d'entreprise.",
    issuer: "Microsoft",
    date: "Juin 2026",
    credentialId: "MS-ASD-19045",
    url: "https://microsoft.com",
    image: "/assets/certificates/advanced-software-design.svg",
  },
];

// Générer les années de 2025 à 2030
const YEARS = Array.from({ length: 5 }, (_, i) => (2025 + i).toString());

export default function CertificatesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Scroll en haut de la page au chargement
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filtrer les certificats
  const filteredCertificates = useMemo(() => {
    let filtered = CERTIFICATES;

    // Filtre par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(term) ||
          cert.description.toLowerCase().includes(term) ||
          cert.issuer.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((cert) => cert.category === selectedCategory);
    }

    // Filtre par année
    if (selectedYear) {
      filtered = filtered.filter((cert) => cert.date.includes(selectedYear));
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedYear]);

  const handleCertClick = (cert: Certificate, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(cert.url, "_blank", "noopener,noreferrer");
    toast.success(
      "Certificat vérifié",
      `Ouverture du certificat de ${cert.issuer}...`
    );
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    // Attendre que la page se charge pour scroller vers la section certificats
    setTimeout(() => {
      const element = document.getElementById("certificates");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
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

  return (
    <>
      <Navbar />
      <div className="pf-certificates-page">
        <div className="pf-container">
          {/* En-tête avec navigation */}
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
                {CERTIFICATES.length} certificats validés.
              </p>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
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

          {/* Filtres déroulants */}
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
                  {YEARS.map((year) => (
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

          {/* Résultats */}
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
                        src={cert.image}
                        alt={cert.title}
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
                          {getCategoryLabel(cert.category)}
                        </span>
                        <span className="pf-cert-date">{cert.date}</span>
                      </div>

                      <h3 className="pf-cert-title">{cert.title}</h3>
                      <p className="pf-cert-desc">{cert.description}</p>

                      <div className="pf-cert-footer">
                        <div className="pf-cert-issuer-box">
                          <span className="pf-issuer-name">{cert.issuer}</span>
                          <span className="pf-cred-id font-mono">ID: {cert.credentialId}</span>
                        </div>

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