import { useState } from 'react';
import {
  LuArrowUpRight,
  LuCircleDashed,
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
import './DashboardHome.css';

interface PageView {
  id: string;
  path: string;
  method: string;
  referrer: string;
  ip_address: string;
  user_agent: string;
  device_type: 'desktop' | 'mobile' | 'bot';
  timestamp: string;
}

const samplePageViews: PageView[] = [
  {
    id: '1',
    path: '/projects/awesome-app',
    method: 'GET',
    referrer: 'https://google.com',
    ip_address: '192.0.2.1',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
    device_type: 'desktop',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    path: '/contact',
    method: 'GET',
    referrer: 'Direct',
    ip_address: '198.51.100.23',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    device_type: 'mobile',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    path: '/projects',
    method: 'GET',
    referrer: 'https://github.com/gedeon2306',
    ip_address: '203.0.113.5',
    user_agent: 'curl/7.68.0',
    device_type: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: '4',
    path: '/skills',
    method: 'GET',
    referrer: 'https://linkedin.com',
    ip_address: '192.168.1.50',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    device_type: 'desktop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '5',
    path: '/cv.pdf',
    method: 'GET',
    referrer: 'Direct',
    ip_address: '82.124.45.10',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device_type: 'desktop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'bot'>('all');
  const [selectedView, setSelectedView] = useState<PageView | null>(null);

  const cards = [
    {
      title: 'Projets publics',
      value: '12',
      trend: '+2 ce mois',
      caption: 'Mises à jour actives',
      icon: LuFolderKanban,
      action: () => navigate('/dashboard/projects'),
    },
    {
      title: 'Visites totales',
      value: '1,428',
      trend: '+24%',
      caption: 'Sur les 30 derniers jours',
      icon: LuTrendingUp,
      action: () => navigate('/dashboard/analytics'),
    },
    {
      title: 'Compétences',
      value: '18',
      trend: '4 catégories',
      caption: 'Expertises référencées',
      icon: LuUserCheck,
      action: () => navigate('/dashboard/skills'),
    },
    {
      title: 'Tâches à finaliser',
      value: '3',
      trend: 'Priorité haute',
      caption: 'Vérifications du CV & Bio',
      icon: LuCircleDashed,
      action: () => navigate('/dashboard/myinfo'),
    },
  ];

  const filteredViews = samplePageViews.filter((view) => {
    const matchesSearch =
      view.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.referrer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.ip_address.includes(searchQuery);
    const matchesDevice = deviceFilter === 'all' || view.device_type === deviceFilter;
    return matchesSearch && matchesDevice;
  });

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
              <span className="stat-trend badge badge-accent">{trend}</span>
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
          </div>
        </section>

        {/* Activité récente */}
        <section className="panel-card activity-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Journal</p>
              <h3>Activité récente</h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => toast.info('Activité', 'Journal complet actualisé.')}
            >
              Actualiser
            </button>
          </div>

          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-pulse-dot" />
              <div className="activity-content">
                <p className="activity-text">Mise à jour du projet <strong>« Portfolio V2 »</strong></p>
                <span className="activity-time"><LuClock /> Il y a 10 minutes</span>
              </div>
            </li>
            <li className="activity-item">
              <span className="activity-pulse-dot" />
              <div className="activity-content">
                <p className="activity-text">Modifications enregistrées sur la rubrique <strong>Mes Infos</strong></p>
                <span className="activity-time"><LuClock /> Il y a 2 heures</span>
              </div>
            </li>
            <li className="activity-item">
              <span className="activity-pulse-dot" />
              <div className="activity-content">
                <p className="activity-text">Nouveau niveau renseigné pour la compétence <strong>React 19</strong></p>
                <span className="activity-time"><LuClock /> Hier</span>
              </div>
            </li>
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
                <th>Origine / Referrer</th>
                <th>Adresse IP</th>
                <th>Appareil</th>
                <th>Horodatage</th>
                <th className="text-right">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredViews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">
                    Aucune visite ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredViews.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="font-mono path-tag">{row.path}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{row.method}</span>
                    </td>
                    <td className="text-secondary">{row.referrer || 'Accès direct'}</td>
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
