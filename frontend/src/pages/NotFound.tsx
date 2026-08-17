// NotFound.tsx
import { FiArrowLeft, FiHome, FiSearch, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../components/useScrollReveal";
import "../css/NotFound.css";

export default function NotFound() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div className="pf-notfound">
      <div className="pf-notfound-glow" aria-hidden="true" />
      
      <div className="pf-container pf-notfound-inner">
        <div className="pf-notfound-badge">
          <span>Erreur 404</span>
        </div>

        <div ref={revealRef} className="pf-notfound-content pf-reveal">
          <div className="pf-notfound-code">
            <span className="pf-notfound-digit">4</span>
            <span className="pf-notfound-zero">
              <div className="pf-notfound-zero-ring" />
              0
            </span>
            <span className="pf-notfound-digit">4</span>
          </div>

          <h1 className="pf-notfound-title">
            Page <span className="pf-gradient-text">introuvable</span>
          </h1>

          <p className="pf-notfound-subtitle">
            La page que vous recherchez a été déplacée, supprimée ou n'a jamais existé.
            Mais ne vous inquiétez pas, nous avons tout ce qu'il faut pour vous remettre sur la bonne voie.
          </p>

          <div className="pf-notfound-suggestions">
            <div className="pf-notfound-suggestion">
              <div className="pf-notfound-suggestion-icon">
                <FiSearch size={18} />
              </div>
              <div className="pf-notfound-suggestion-content">
                <h4>Vérifiez l'URL</h4>
                <p>Assurez-vous que l'adresse est correctement saisie.</p>
              </div>
            </div>

            <div className="pf-notfound-suggestion">
              <div className="pf-notfound-suggestion-icon">
                <FiArrowLeft size={18} />
              </div>
              <div className="pf-notfound-suggestion-content">
                <h4>Retour en arrière</h4>
                <p>Utilisez le bouton précédent de votre navigateur.</p>
              </div>
            </div>

            <div className="pf-notfound-suggestion">
              <div className="pf-notfound-suggestion-icon">
                <FiHome size={18} />
              </div>
              <div className="pf-notfound-suggestion-content">
                <h4>Page d'accueil</h4>
                <p>Retournez à la page principale du site.</p>
              </div>
            </div>
          </div>

          <div className="pf-notfound-actions">
            <Link to="/" className="btn btn-primary">
              <FiHome size={16} />
              <span>Retour à l'accueil</span>
            </Link>
            <Link to="/#contact" className="btn btn-outline">
              <span>Me contacter</span>
              <FiArrowUpRight size={15} />
            </Link>
          </div>

          <div className="pf-notfound-footer">
            <span className="pf-notfound-footer-text">
              Vous cherchez quelque chose en particulier ?
            </span>
            <Link to="/#projets" className="pf-notfound-footer-link">
              Voir mes projets
              <FiArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}