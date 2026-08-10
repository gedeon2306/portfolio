import { useEffect, useMemo, useState } from 'react';
import { clearAuthTokens } from '../api/Auth';
import { useCheckCookies } from '../utils/CheckCookies';
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
  LuUserRound,
  LuX,
  LuSearch,
  // LuBell,
  LuAward,
  LuChartColumn,
  // LuCheck,
  LuLogOut,
} from 'react-icons/lu';
import { CgMoreVertical } from "react-icons/cg";
import { ImParagraphLeft } from 'react-icons/im';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { CommandPalette } from './CommandPalette';
import logo from '../assets/logo_jd_blanc_sbg.png';
import '../css/DashboardLayout.css';

const navigation = [
  { to: '/dashboard', label: 'Vue d’ensemble', icon: LuLayoutDashboard },
  { to: '/dashboard/myinfo', label: 'Mes infos', icon: LuUserRound },
  { to: '/dashboard/skills', label: 'Skills', icon: ImParagraphLeft },
  { to: '/dashboard/projects', label: 'Projets', icon: LuFolderKanban },
  { to: '/dashboard/certificates', label: 'Certificats', icon: LuAward },
  { to: '/dashboard/analytics', label: 'Statistiques', icon: LuChartColumn },
  { to: '/dashboard/settings', label: 'Paramètres', icon: LuSettings },
];

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  // const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const notifications = [
  //   { id: '1', title: 'Nouveau message reçu', time: 'Il y a 10 min', read: false },
  //   { id: '2', title: 'Projet Portfolio V2 mis à jour', time: 'Il y a 2h', read: false },
  //   { id: '3', title: 'Nouveau certificat AWS ajouté', time: 'Hier à 18:40', read: true },
  // ];

  const currentNav = useMemo(() => {
    return navigation.find((item) => item.to === location.pathname) ?? { label: 'Vue d’ensemble', to: '/dashboard' };
  }, [location.pathname]);

  useCheckCookies({ redirectIfNotAuthenticated: '/connexion' });

  // Fermer les menus lors du changement de page
  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsMobileMenuOpen(false);
    // setIsNotifOpen(false);
  }, [location.pathname]);

  // Gestion de la touche Escape et overflow body pour mobile
  useEffect(() => {
    const shouldLockScroll = isMobileNavOpen || isMobileMenuOpen;
    if (!shouldLockScroll) {
      document.body.style.overflow = '';
      return;
    }
    
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
        setIsMobileMenuOpen(false);
        // setIsNotifOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen, isMobileMenuOpen]);

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-actions-menu') && !target.closest('.mobile-dropdown-menu')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    // Petit délai pour éviter la fermeture immédiate lors du clic d'ouverture
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMobileMenuOpen(false);
    toast.info('Déconnexion en cours...', 'À très bientôt sur l’administration.');
    try {
      clearAuthTokens();
      await new Promise((r) => setTimeout(r, 700));
      navigate('/connexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMobileMenuAction = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`dashboard-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Overlay pour le menu mobile de navigation */}
      <div
        className={`mobile-nav-overlay ${isMobileNavOpen ? 'is-visible' : ''}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Latérale */}
      <aside className={`dashboard-sidebar ${isMobileNavOpen ? 'is-open' : ''}`}>
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
                <img src={logo} alt="Logo JD" />
              </div>
              <button
                type="button"
                className="sidebar-theme-toggle"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
                aria-label="Changer de thème"
              >
                {theme === 'light' ? <LuMoon /> : <LuSun />}
              </button>
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-label">Admin Console</span>
                <h2>JihrelDev</h2>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Fermer le menu"
          >
            <LuX />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navigation principale">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Pied de sidebar / Profil rapide */}
        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">
            <span>JD</span>
            <span className="user-online-dot" />
          </div>
          {!isCollapsed && (
            <div className="sidebar-user-info">
              <p className="user-name">JihrelDev</p>
              <p className="user-role">Administrateur</p>
            </div>
          )}
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Se déconnecter"
            disabled={isLoggingOut}
          >
            <LuLogOut />
          </button>
        </div>
      </aside>

      {/* Zone Principale */}
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
              <div className="dashboard-breadcrumbs">
                <span>Espace Administrateur</span>
              </div>
              <h1>{currentNav.label}</h1>
            </div>
          </div>

          {/* Actions desktop (visibles uniquement sur grand écran) */}
          <div className="header-actions desktop-actions">
            <button
              type="button"
              className="header-cmd-trigger"
              onClick={() => setIsCmdOpen(true)}
              title="Recherche rapide (Ctrl+K)"
            >
              <LuSearch className="cmd-icon" />
              <span className="cmd-text">Rechercher...</span>
              <kbd className="cmd-shortcut-tag">⌘K</kbd>
            </button>

            {/* <div className="notif-wrapper">
              <button
                type="button"
                className={`header-icon-btn ${isNotifOpen ? 'active' : ''}`}
                onClick={() => setIsNotifOpen((prev) => !prev)}
                title="Notifications"
                aria-label="Notifications"
              >
                <LuBell />
                <span className="notif-badge-dot" />
              </button>

              {isNotifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <span className="badge badge-accent">3 nouvelles</span>
                  </div>
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                        <div className="notif-dot" />
                        <div className="notif-content">
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-time">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notif-footer">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsNotifOpen(false)}>
                      <LuCheck /> Tout marquer comme lu
                    </button>
                  </div>
                </div>
              )}
            </div> */}

            <button
              type="button"
              className="btn btn-danger header-logout-cta"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Déconnexion"
            >
              {isLoggingOut ? <span className="spinner" /> : <LuLogOut className="btn-icon" />}
              <span className="logout-text">Déconnexion</span>
            </button>
          </div>

          {/* Actions mobile (visibles uniquement sur petit écran) */}
          <div className="mobile-actions-menu">
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => setIsCmdOpen(true)}
              title="Recherche rapide"
            >
              <LuSearch />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`header-icon-btn ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen((prev) => !prev);
                }}
                title="Menu"
              >
                <CgMoreVertical />
              </button>

              {isMobileMenuOpen && (
                <div className="mobile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  {/* <button
                    type="button"
                    className="mobile-dropdown-item"
                    onClick={() => handleMobileMenuAction(() => setIsNotifOpen((prev) => !prev))}
                  >
                    <LuBell />
                    <span>Notifications</span>
                    <span className="mobile-badge">3</span>
                  </button> */}
                  
                  <button
                    type="button"
                    className="mobile-dropdown-item"
                    onClick={() => handleMobileMenuAction(toggleTheme)}
                  >
                    {theme === 'light' ? <LuMoon /> : <LuSun />}
                    <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
                  </button>
                  
                  <div className="mobile-dropdown-divider" />
                  
                  <button
                    type="button"
                    className="mobile-dropdown-item mobile-logout-item"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? <span className="spinner" /> : <LuLogOut />}
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet context={{ logout: handleLogout, isLoggingOut }} />
        </main>
      </div>

      {/* Command Palette Keyboard Shortcut Modal */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
}