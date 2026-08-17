import { FiArrowUp } from "react-icons/fi";
import logoJdBlanc from "../assets/logo_jd_blanc_sbg.png";
import "../css/Footer.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pf-footer">
      <div className="pf-container pf-footer-inner">
        <div className="pf-footer-brand">
          <div className="pf-footer-logo-wrap">
            <img
              src={logoJdBlanc}
              alt="JhirelDev logo"
              className="pf-logo-mark pf-logo-mark-image"
            />
            <span className="pf-footer-logo">
              Jihrel<span>Dev</span>
            </span>
          </div>
          <p className="pf-footer-tagline">
            "Transformer des idées en réalité numérique."
          </p>
        </div>

        <div className="pf-footer-center">
          <p className="pf-footer-craft">
            <span>Ingénierie logicielle robuste & Design d'excellence.</span>
          </p>
          <p className="pf-footer-copy font-mono">
            © {new Date().getFullYear()} JihrelDev. Tous droits réservés.
          </p>
          <p className="pf-footer-copy font-mono">
            <strong># </strong>faire son travail avec passion.
          </p>
        </div>

        <div className="pf-footer-actions">
          <button
            type="button"
            className="btn btn-secondary pf-back-to-top"
            onClick={scrollToTop}
            aria-label="Retourner en haut de la page"
            title="Haut de page"
          >
            <span>Haut de page</span>
            <FiArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
