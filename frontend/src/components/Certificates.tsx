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
import { useQuery } from "@tanstack/react-query";
import { getCertificatesHighlights } from "../api/Actions";
import { formatCertDate } from "../utils/dateUtils";
import "../css/Certificates.css";
import SkeletonCertificates from "./skeletonComponents/SkeletonCertificates";

const INITIAL_VISIBLE_COUNT = 3;

export default function Certificates() {
  const toast = useToast();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: certificatesData, isLoading, error } = useQuery({
    queryKey: ['certificates-highlights'],
    queryFn: getCertificatesHighlights,
  });

  const certificates = certificatesData?.certificats || [];

  const displayedCertificates = certificates.slice(0, visibleCount);
  const hasMore = visibleCount < certificates.length;
  const canCollapse = visibleCount > INITIAL_VISIBLE_COUNT && certificates.length > INITIAL_VISIBLE_COUNT;

  const handleCertClick = (cert: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (cert.url) {
      window.open(cert.url, "_blank", "noopener,noreferrer");
      toast.success(
        "Certificat vérifié",
        `Ouverture du certificat de ${cert.organisme}...`
      );
    }
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/certificates");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, certificates.length));
  };

  const handleCollapse = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    navigate("/", { state: { scrollTo: "certificates" } });
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

        {isLoading || error || certificates.length === 0 ? (
          <SkeletonCertificates />
        ) : (
          <div ref={gridRef} className="pf-cert-grid">
            {displayedCertificates.map((cert) => (
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
                    <span className="badge badge-accent pf-cert-category">{cert.categorie}</span>
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