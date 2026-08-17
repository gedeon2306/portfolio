import { useState, useRef } from "react";
import { 
  FiArrowUpRight, 
  FiAward, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronRight 
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "../css/Certificates.css";

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

const CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    category: "Développement web",
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
    category: "Intelligence artificielle",
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
    category: "Base de données",
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
    category: "Cloud computing",
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
    category: "Software engineering",
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

const INITIAL_VISIBLE_COUNT = 3;

export default function Certificates() {
  const toast = useToast();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const gridRef = useRef<HTMLDivElement>(null);

  const displayedCertificates = CERTIFICATES.slice(0, visibleCount);
  const hasMore = visibleCount < CERTIFICATES.length;
  const canCollapse = visibleCount > INITIAL_VISIBLE_COUNT && CERTIFICATES.length > INITIAL_VISIBLE_COUNT;

  const handleCertClick = (cert: Certificate, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(cert.url, "_blank", "noopener,noreferrer");
    toast.success(
      "Certificat vérifié",
      `Ouverture du certificat de ${cert.issuer}...`
    );
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/certificates");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, CERTIFICATES.length));
  };

  const handleCollapse = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <section id="certificates" className="pf-certificates">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Accréditations & Diplômes</span>
          <h2 className="pf-section-title">Certifications Professionnelles</h2>
          <p className="pf-section-subtitle">
            Formations continues certifiées par les leaders technologiques mondiaux pour garantir les meilleures pratiques d'ingénierie.
          </p>
        </div>

        <div ref={gridRef} className="pf-cert-grid">
          {displayedCertificates.map((cert) => (
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
                  <span className="badge badge-accent pf-cert-category">{cert.category}</span>
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

        <div className="pf-cert-actions">
          {hasMore && (
            <button
              type="button"
              className="btn btn-secondary pf-cert-action-btn"
              onClick={handleShowMore}
            >
              <span>Afficher plus de certificats</span>
              <FiChevronDown size={18} className="pf-chevron-icon" />
            </button>
          )}
          {canCollapse && !hasMore && (
            <button
              type="button"
              className="btn btn-secondary pf-cert-action-btn"
              onClick={handleCollapse}
            >
              <span>Réduire la liste</span>
              <FiChevronDown size={18} className="pf-chevron-icon pf-chevron-up" />
            </button>
          )}
          <Link
            to="/certificates"
            className="btn btn-primary pf-cert-action-btn"
            onClick={handleViewAll}
          >
            <span>Voir tous les certificats</span>
            <FiChevronRight size={18} className="pf-chevron-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}