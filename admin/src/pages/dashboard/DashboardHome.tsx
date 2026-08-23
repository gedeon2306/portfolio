import { useEffect, useState } from 'react';
import {
  LuArrowUpRight,
  LuAward,
  LuChartColumn,
  LuFolderKanban,
  LuSparkles,
  LuTrendingUp,
  LuEye,
  LuSearch,
  LuPlus,
  LuUserCheck,
  LuClock,
  LuLaptop,
  LuSmartphone,
  LuBot,
  LuX
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Pagination';
import { fetchDashboardHome } from '../../api/Actions';
import type {
  DashboardStats,
  DeviceType,
  JournalEntry,
  PageView,
} from '../../types/Types';
import './DashboardHome.css';

const PAGE_SIZE = 10;

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "À l'instant";
  if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return date.toLocaleDateString();
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | DeviceType>('all');
  const [selectedView, setSelectedView] = useState<PageView | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<JournalEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Debounce de la recherche pour éviter un appel API à chaque frappe
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Reset de la page quand le filtre appareil change
  useEffect(() => {
    setCurrentPage(1);
  }, [deviceFilter]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      try {
        const data = await fetchDashboardHome({
          search: debouncedSearch,
          device: deviceFilter,
          page: currentPage,
        });

        if (cancelled) return;

        setStats(data.stats);
        setRecentActivity(data.recent_activity);
        setPageViews(data.page_views.results);
        setTotalCount(data.page_views.count);
      } catch (error) {
        if (!cancelled) {
          toast.error('Erreur', error instanceof Error ? error.message : 'Impossible de charger le dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, deviceFilter, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const cards = [
    {
      title: 'Projets publics',
      value: stats?.projects.value ?? '—',
      trend: stats?.projects.trend ?? '',
      caption: 'Mises à jour actives',
      icon: LuFolderKanban,
      action: () => navigate('/dashboard/projects'),
    },
    {
      title: 'Visites totales',
      value: stats?.visits.value ?? '—',
      trend: stats?.visits.trend ?? '',
      caption: 'Sur les 30 derniers jours',
      icon: LuTrendingUp,
      action: () => navigate('/dashboard/analytics'),
    },
    {
      title: 'Compétences',
      value: stats?.skills.value ?? '—',
      trend: stats?.skills.trend ?? '',
      caption: 'Expertises référencées',
      icon: LuUserCheck,
      action: () => navigate('/dashboard/skills'),
    },
    {
      title: 'Certifications',
      value: stats?.certificates.value ?? '—',
      trend: stats?.certificates.trend ?? '',
      caption: 'En constante évolution',
      icon: LuAward,
      action: () => navigate('/dashboard/certificates'),
    },
  ];

  return (
    <div className="dashboard-home">
      {/* Banner Hero */}
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-eyebrow badge badge-accent">
            <LuSparkles className="hero-icon" /> Vue d'ensemble générale
          </div>
          <h2>Bienvenue dans votre console d’administration.</h2>
          <p className="hero-text">
            Suivez les performances de votre portfolio, organisez vos projets, modifiez vos compétences et gardez un œil sur votre audience.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => toast.info('Aperçu public', 'Redirection vers le portfolio public (mode démo).')}
            >
              Aperçu du Portfolio
              <LuArrowUpRight className="btn-icon" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/projects')}
            >
              <LuPlus className="btn-icon" /> Nouveau projet
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Cartes Stats */}
      <section className="stats-grid">
        {cards.map(({ title, value, trend, caption, icon: Icon, action }) => (
          <article key={title} className="stat-card" onClick={action} role="button" tabIndex={0}>
            <div className="stat-header">
              <div className="stat-icon-wrap">
                <Icon className="stat-icon" />
              </div>
              {trend && <span className="stat-trend badge badge-accent">{trend}</span>}
            </div>
            <div className="stat-body">
              <p className="stat-value">{value}</p>
              <p className="stat-title">{title}</p>
              <p className="stat-caption">{caption}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Section Deux Colonnes : Raccourcis + Activité Récente */}
      <div className="home-dual-grid">
        {/* Raccourcis Rapides */}
        <section className="panel-card shortcuts-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Productivité</p>
              <h3>Raccourcis d’administration</h3>
            </div>
          </div>
          <div className="shortcuts-list">
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => navigate('/dashboard/myinfo')}
            >
              <div className="shortcut-icon"><LuUserCheck /></div>
              <div className="shortcut-info">
                <p className="shortcut-title">Mettre à jour ma bio & photo</p>
                <p className="shortcut-desc">Éditer le profil public et le CV</p>
              </div>
            </button>
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => navigate('/dashboard/skills')}
            >
              <div className="shortcut-icon"><LuSparkles /></div>
              <div className="shortcut-info">
                <p className="shortcut-title">Ajuster mes compétences</p>
                <p className="shortcut-desc">Gérer les niveaux React, Django, Python</p>
              </div>
            </button>
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => navigate('/dashboard/projects')}
            >
              <div className="shortcut-icon"><LuFolderKanban /></div>
              <div className="shortcut-info">
                <p className="shortcut-title">Publier un nouveau projet</p>
                <p className="shortcut-desc">Ajouter des maquettes ou dépôts Git</p>
              </div>
            </button>
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => navigate('/dashboard/projects')}
            >
              <div className="shortcut-icon"><LuAward /></div>
              <div className="shortcut-info">
                <p className="shortcut-title">Publier un nouveau certificat</p>
                <p className="shortcut-desc">Ajouter vos nouveaux certificat obtenu</p>
              </div>
            </button>
            <button
              type="button"
              className="shortcut-btn"
              onClick={() => navigate('/dashboard/projects')}
            >
              <div className="shortcut-icon"><LuChartColumn /></div>
              <div className="shortcut-info">
                <p className="shortcut-title">Voir les stats</p>
                <p className="shortcut-desc">Consultez vos statistiques</p>
              </div>
            </button>
          </div>
        </section>

        {/* Activité récente */}
        <section className="panel-card activity-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Journal</p>
              <h3>Activité récente</h3>
            </div>
          </div>

          <ul className="activity-list">
            {recentActivity.length === 0 ? (
              <li className="activity-item">
                <div className="activity-content">
                  <p className="activity-text">Aucune activité récente.</p>
                </div>
              </li>
            ) : (
              recentActivity.map((entry) => (
                <li key={entry.id} className="activity-item">
                  <span className="activity-pulse-dot" />
                  <div className="activity-content">
                    <p className="activity-text">{entry.action}</p>
                    <span className="activity-time"><LuClock /> {formatRelativeTime(entry.created_at)}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {/* Tableau des Statistiques / Pages vues avec filtres */}
      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Traçabilité</p>
            <h3>Journal des vues & trafic récent</h3>
          </div>

          {/* Bar de recherche et Filtre par Appareil */}
          <div className="table-controls">
            <div className="search-input-wrap">
              <LuSearch className="search-icon" />
              <input
                type="text"
                placeholder="Filtrer par chemin ou IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="device-filter-group">
              <button
                type="button"
                className={`filter-tab ${deviceFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('all')}
              >
                Tous
              </button>
              <button
                type="button"
                className={`filter-tab ${deviceFilter === 'desktop' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('desktop')}
              >
                <LuLaptop /> Ordi
              </button>
              <button
                type="button"
                className={`filter-tab ${deviceFilter === 'mobile' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('mobile')}
              >
                <LuSmartphone /> Mobile
              </button>
              <button
                type="button"
                className={`filter-tab ${deviceFilter === 'bot' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('bot')}
              >
                <LuBot /> Bot
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Chemin visité</th>
                <th>Méthode</th>
                <th>Origine</th>
                <th>Source</th>
                <th>Adresse IP</th>
                <th>Appareil</th>
                <th>Horodatage</th>
                <th className="text-right">Détails</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="table-empty">
                    Chargement...
                  </td>
                </tr>
              ) : pageViews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">
                    Aucune visite ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                pageViews.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="font-mono path-tag">{row.path}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{row.method}</span>
                    </td>
                    <td className="text-secondary">{row.referrer || 'Accès direct'}</td>
                    <td className="text-secondary">{row.source || 'Accès direct'}</td>
                    <td className="font-mono text-xs">{row.ip_address}</td>
                    <td>
                      <span className="badge badge-accent">
                        {row.device_type === 'desktop' && <LuLaptop />}
                        {row.device_type === 'mobile' && <LuSmartphone />}
                        {row.device_type === 'bot' && <LuBot />}
                        <span style={{ textTransform: 'capitalize' }}>{row.device_type}</span>
                      </span>
                    </td>
                    <td className="text-xs text-secondary">
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon-only"
                        onClick={() => setSelectedView(row)}
                        title="Inspecter le log"
                      >
                        <LuEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Modal de détail d'une page vue */}
      {selectedView && (
        <div className="modal-overlay" onClick={() => setSelectedView(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détail de la requête HTTP</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setSelectedView(null)}
              >
                <LuX />
              </button>
            </div>
            <div className="modal-body">
              <div className="log-detail-grid">
                <div className="log-field">
                  <span>URL Cible :</span>
                  <strong className="font-mono">{selectedView.path}</strong>
                </div>
                <div className="log-field">
                  <span>Méthode :</span>
                  <strong>{selectedView.method}</strong>
                </div>
                <div className="log-field">
                  <span>Adresse IP :</span>
                  <strong className="font-mono">{selectedView.ip_address}</strong>
                </div>
                <div className="log-field">
                  <span>Referrer :</span>
                  <strong>{selectedView.referrer || 'Accès direct'}</strong>
                </div>
                <div className="log-field field-full">
                  <span>User Agent :</span>
                  <code className="ua-code">{selectedView.user_agent}</code>
                </div>
                <div className="log-field">
                  <span>Date & Heure :</span>
                  <strong>{new Date(selectedView.timestamp).toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedView(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}