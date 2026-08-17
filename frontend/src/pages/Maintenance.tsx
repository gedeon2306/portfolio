// Maintenance.tsx
import { FiClock, FiRefreshCw, FiMail } from "react-icons/fi";
import { useScrollReveal } from "../components/useScrollReveal";
import "../css/Maintenance.css";

export default function Maintenance() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="pf-maintenance">
      <div className="pf-maintenance-glow" aria-hidden="true" />
      
      <div className="pf-container pf-maintenance-inner">
        <div className="pf-maintenance-badge">
          <FiClock size={14} />
          <span>Maintenance en cours</span>
        </div>

        <div ref={revealRef} className="pf-maintenance-content pf-reveal">
          <div className="pf-maintenance-icon-wrapper">
            <div className="pf-maintenance-icon-ring">
              <FiRefreshCw size={40} className="pf-maintenance-spin" />
            </div>
          </div>

          <h1 className="pf-maintenance-title">
            Nous revenons <span className="pf-gradient-text">très bientôt</span>
          </h1>

          <p className="pf-maintenance-subtitle">
            Notre site est actuellement en cours d'amélioration pour vous offrir une expérience 
            encore plus fluide et performante. Nous serons de retour dans quelques instants.
          </p>

          <div className="pf-maintenance-cards">
            <div className="pf-maintenance-card">
              <div className="pf-maintenance-card-icon">
                <FiClock size={20} />
              </div>
              <h4>Temps estimé</h4>
              <p>L'opération devrait durer environ <strong>2 heures</strong>.</p>
            </div>

            <div className="pf-maintenance-card">
              <div className="pf-maintenance-card-icon">
                <FiMail size={20} />
              </div>
              <h4>Une question ?</h4>
              <p>
                Contactez-nous à{" "}
                <a href="mailto:contact@Jihreldev.com" className="pf-maintenance-email">
                  contact@Jihreldev.com
                </a>
              </p>
            </div>
          </div>

          <div className="pf-maintenance-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw size={16} />
              <span>Vérifier le statut</span>
            </button>
            <a href="mailto:contact@Jihreldev.com" className="btn btn-outline">
              <FiMail size={16} />
              <span>Envoyer un message</span>
            </a>
          </div>

          <div className="pf-maintenance-status">
            <span className="pf-maintenance-dot" />
            <span className="pf-maintenance-status-text">
              Maintenance programmée — Mise à jour majeure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}