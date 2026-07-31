import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LuChevronLeft,
  LuChevronRight,
  LuFolderKanban,
  LuLayoutDashboard,
  LuMenu,
  LuMoon,
  LuSettings,
  LuSun,
  LuX,
} from 'react-icons/lu';
import { FiLogOut } from "react-icons/fi";
import { IoBarChart } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';
import { Spinner } from './Spinner';
import logo from '../assets/logo_jd_blanc_sbg.png';
import '../css/DashboardLayout.css';

const navigation = [
  { to: '/dashboard', label: 'Vue d’ensemble', icon: LuLayoutDashboard },
  { to: '/dashboard/content', label: 'Contenus', icon: LuFolderKanban },
  { to: '/dashboard/analytics', label: 'Statistiques', icon: IoBarChart },
  { to: '/dashboard/settings', label: 'Paramètres', icon: LuSettings },
];

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const title = useMemo(() => {
    const current = navigation.find((item) => item.to === location.pathname);
    return current?.label ?? 'Vue d’ensemble';
  }, [location.pathname]);

  // Ferme le tiroir mobile à chaque changement de page
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Empêche le scroll du contenu derrière le tiroir ouvert, et permet Échap pour fermer
  useEffect(() => {
    if (!isMobileNavOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen]);

  return (
    <div className={`dashboard-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div
        className={`mobile-nav-overlay ${isMobileNavOpen ? 'is-visible' : ''}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      <aside className={`dashboard-sidebar ${isMobileNavOpen ? 'is-open' : ''}`}>
        {/* Poignée de collapse : flotte sur le bord droit de la sidebar,
            visible en permanence, indépendante du contenu du logo. */}
        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-label={isCollapsed ? 'Déplier la barre latérale' : 'Réduire la barre latérale'}
        >
          {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
        </button>

        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-logo-wrap">
              <div className="sidebar-logo">
                <img src={logo} alt="Logo" />
              </div>
              <button
                type="button"
                className="sidebar-theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair'}
              >
                {theme === 'light' ? <LuMoon /> : <LuSun />}
              </button>
            </div>
            <div>
              <p className="sidebar-label">Admin</p>
              <h2>Portfolio</h2>
            </div>
          </div>

          {/* Fermer le tiroir (mobile uniquement) */}
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Fermer le menu"
          >
            <LuX />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navigation du tableau de bord">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title-row">
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <LuMenu />
            </button>
            <div>
              <p className="dashboard-eyebrow">Tableau de bord</p>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="header-actions">
              <button
                type="button"
                className="btn btn-danger header-cta"
                onClick={async () => {
                  setIsLoggingOut(true);
                  try {
                    // nettoyage local (token, etc.)
                    localStorage.removeItem('authToken');
                    // attente minimale pour afficher le spinner
                    await new Promise((r) => setTimeout(r, 600));
                    navigate('/connexion');
                  } finally {
                    setIsLoggingOut(false);
                  }
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Spinner /> : <FiLogOut className="btn-icon" />}
              </button>
          </div>
        </header>

        <main className="dashboard-content">
            <Outlet context={{ logout: async () => {
              setIsLoggingOut(true);
              try {
                localStorage.removeItem('authToken');
                await new Promise((r) => setTimeout(r, 600));
                navigate('/connexion');
              } finally {
                setIsLoggingOut(false);
              }
            }, isLoggingOut }} />
        </main>
      </div>
    </div>
  );
}