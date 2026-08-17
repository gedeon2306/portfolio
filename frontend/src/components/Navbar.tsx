import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FiGithub, FiLinkedin, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import logoJdBlanc from "../assets/logo_jd_blanc_sbg.png";
import "../css/Navbar.css";

const NAV_LINKS = [
  { label: "Accueil", href: "#top", id: "top" },
  { label: "À propos", href: "#apropos", id: "apropos" },
  { label: "Certificats", href: "#certificates", id: "certificates" },
  { label: "Compétences", href: "#competences", id: "competences" },
  { label: "Projets", href: "#projets", id: "projets" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const GITHUB_REPO_URL = "https://github.com/";
const LINKEDIN_URL = "https://linkedin.com/";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isCertificatesPage = location.pathname === "/certificates";
  const isProjectsPage = location.pathname === "/projects";
  const isSpecialPage = isCertificatesPage || isProjectsPage;

  // Gérer le scroll pour la page d'accueil
  useEffect(() => {
    if (isCertificatesPage) {
      setActiveSection("#certificates");
      return;
    }
    if (isProjectsPage) {
      setActiveSection("#projets");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let found = false;

      for (const link of [...NAV_LINKS].reverse()) {
        const element = document.getElementById(link.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(link.href);
          found = true;
          break;
        }
      }

      if (!found) {
        setActiveSection("#top");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCertificatesPage, isProjectsPage]);

  // Gérer le clic sur un lien de navigation
  const handleNavClick = (link: typeof NAV_LINKS[0], e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);

    if (isSpecialPage) {
      // Naviguer vers la page d'accueil
      navigate("/");
      // Attendre que la page se charge pour scroller
      setTimeout(() => {
        const element = document.getElementById(link.id);
        if (element && link.id !== "top") {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (link.id === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 200);
    } else {
      // Sur la page d'accueil, scroller directement
      const element = document.getElementById(link.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Empêcher le défilement du corps quand le menu est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Fermer le menu avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Déterminer si un lien est actif
  const isLinkActive = (link: typeof NAV_LINKS[0]) => {
    if (isCertificatesPage && link.id === "certificates") {
      return true;
    }
    if (isProjectsPage && link.id === "projets") {
      return true;
    }
    if (!isSpecialPage) {
      return activeSection === link.href;
    }
    return false;
  };

  return (
    <>
      <header className="pf-nav-wrap">
        <div className="pf-nav">
          <a 
            href="/" 
            className="pf-nav-logo" 
            aria-label="JihrelDev - Accueil"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMenuOpen(false);
            }}
          >
            <img
              src={logoJdBlanc}
              alt="JihrelDev logo"
              className="pf-logo-mark pf-logo-mark-image"
            />
            <span className="pf-logo-text">
              Jihrel<span>Dev</span>
            </span>
          </a>

          <nav className="pf-nav-links" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={isActive ? "active" : ""}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => handleNavClick(link, e)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="pf-nav-actions">
            <a
              className="pf-nav-source"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              title="Consulter le code source sur GitHub"
            >
              <FiGithub size={15} />
              <span>Code source</span>
            </a>

            <a
              className="pf-icon-btn"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Profil LinkedIn"
              title="LinkedIn"
            >
              <FiLinkedin size={16} />
            </a>

            <button
              type="button"
              className="pf-icon-btn pf-theme-btn"
              aria-label={`Passer au mode ${theme === "dark" ? "clair" : "sombre"}`}
              title={`Passer au mode ${theme === "dark" ? "clair" : "sombre"}`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <FiSun size={16} className="theme-icon sun" />
              ) : (
                <FiMoon size={16} className="theme-icon moon" />
              )}
            </button>

            <button
              type="button"
              className="pf-icon-btn pf-nav-burger"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <HiOutlineX size={19} /> : <HiOutlineMenu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {menuOpen && (
        <div 
          className="pf-nav-dropdown-overlay" 
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation mobile"
        >
          <nav
            className="pf-nav-dropdown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-dropdown-header">
              <img
                src={logoJdBlanc}
                alt="JihrelDev logo"
                className="pf-logo-mark pf-logo-mark-image"
              />
              <button
                type="button"
                className="pf-icon-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer"
              >
                <HiOutlineX size={18} />
              </button>
            </div>
            <div className="pf-dropdown-links">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={isActive ? "active" : ""}
                    onClick={(e) => handleNavClick(link, e)}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <div className="pf-dropdown-footer">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary pf-dropdown-action"
                onClick={() => setMenuOpen(false)}
              >
                <FiGithub size={16} />
                <span>Code source</span>
              </a>
              <button
                type="button"
                className="btn btn-secondary pf-dropdown-action"
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
              >
                {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
                <span>{theme === "dark" ? "Mode Clair" : "Mode Sombre"}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}