import { LuArrowUpRight, LuCircleDashed, LuFolderKanban, LuSparkles, LuTrendingUp } from 'react-icons/lu';
import './DashboardHome.css';

const cards = [
  { title: 'Projets publics', value: '12', caption: 'Mises à jour cette semaine', icon: LuFolderKanban },
  { title: 'Tendances', value: '+24%', caption: 'Visites enregistrées', icon: LuTrendingUp },
  { title: 'À finaliser', value: '4', caption: 'Éléments en attente', icon: LuCircleDashed },
];


export default function DashboardHome() {
  
  // Données de test basées sur le modèle `dashboard` (backend)
  const samplePageViews = [
    {
      id: '1',
      path: '/projects/awesome-app',
      method: 'GET',
      referrer: 'https://google.com',
      ip_address: '192.0.2.1',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
      session_key: 'sess_abc123',
      device_type: 'desktop',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      path: '/contact',
      method: 'GET',
      referrer: '',
      ip_address: '198.51.100.23',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      session_key: 'sess_def456',
      device_type: 'mobile',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '3',
      path: '/projects',
      method: 'GET',
      referrer: 'https://twitter.com',
      ip_address: '203.0.113.5',
      user_agent: 'curl/7.68.0',
      session_key: 'sess_ghi789',
      device_type: 'bot',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];
  return (
    <div className="dashboard-home">
      <section className="hero-card">
        <div>
          <p className="hero-eyebrow">
            <LuSparkles className="hero-icon" />
            Bienvenue dans votre espace
          </p>
          <h2>Gérez votre portfolio avec élégance.</h2>
          <p className="hero-text">
            Retrouvez vos contenus, suivez les performances et préparez vos prochaines publications en un seul endroit.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary hero-action">
            Voir mon portfolio
            <LuArrowUpRight className="btn-icon" />
          </button>
        </div>
      </section>

      <section className="stats-grid">
        {cards.map(({ title, value, caption, icon: Icon }) => (
          <article key={title} className="stat-card">
            <div className="stat-icon">
              <Icon />
            </div>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-title">{title}</p>
              <p className="stat-caption">{caption}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Activité récente</p>
            <h3>Dernières actions</h3>
          </div>
          <button type="button" className="btn btn-ghost">
            Voir tout
          </button>
        </div>

        <ul className="activity-list">
          <li>
            <span className="activity-dot" />
            Mise à jour du projet “Portfolio V2”
          </li>
          <li>
            <span className="activity-dot" />
            Nouveau message reçu depuis la page contact
          </li>
          <li>
            <span className="activity-dot" />
            Publication planifiée pour vendredi prochain
          </li>
        </ul>
      </section>

      <section className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Analytics</p>
            <h3>Pages vues récentes (données de test)</h3>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Chemin</th>
                <th>Méthode</th>
                <th>Origine</th>
                <th>IP</th>
                <th>Device</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>
              {samplePageViews.map((row) => (
                <tr key={row.id}>
                  <td>{row.path}</td>
                  <td>{row.method}</td>
                  <td>{row.referrer || '—'}</td>
                  <td>{row.ip_address}</td>
                  <td>{row.device_type}</td>
                  <td>{new Date(row.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
