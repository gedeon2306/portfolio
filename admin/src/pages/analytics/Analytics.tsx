import { useState } from 'react';
import {
  LuChartColumn,
  LuTrendingUp,
  LuUsers,
  LuClock,
  LuArrowUpRight,
  LuArrowDownRight,
  LuCalendar
} from 'react-icons/lu';
import { useToast } from '../../context/ToastContext';
import './Analytics.css';

export default function Analytics() {
  const toast = useToast();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y'>('30d');

  const trafficData = [
    { day: 'Lun', visits: 120, height: '45%' },
    { day: 'Mar', visits: 190, height: '70%' },
    { day: 'Mer', visits: 240, height: '90%' },
    { day: 'Jeu', visits: 210, height: '80%' },
    { day: 'Ven', visits: 280, height: '100%' },
    { day: 'Sam', visits: 150, height: '55%' },
    { day: 'Dim', visits: 95, height: '35%' },
  ];

  const topPages = [
    { path: '/projects/awesome-app', views: 540, pct: 40 },
    { path: '/myinfo', views: 320, pct: 24 },
    { path: '/skills', views: 280, pct: 20 },
    { path: '/contact', views: 210, pct: 16 },
  ];

  const topCountries = [
    { country: 'France', flag: '🇫🇷', pct: 65 },
    { country: 'États-Unis', flag: '🇺🇸', pct: 15 },
    { country: 'Allemagne', flag: '🇩🇪', pct: 12 },
    { country: 'Royaume-Uni', flag: '🇬🇧', pct: 8 },
  ];

  const handleExport = () => {
    toast.success('Rapport exporté', 'Fichier CSV des statistiques téléchargé.');
  };

  return (
    <div className="analytics-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Audience & Fréquentation</p>
          <h2>Statistiques & Analytiques</h2>
        </div>

        <div className="header-actions">
          <div className="time-range-group">
            <button
              type="button"
              className={`range-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7J
            </button>
            <button
              type="button"
              className={`range-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30J
            </button>
            <button
              type="button"
              className={`range-btn ${timeRange === '1y' ? 'active' : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              1 An
            </button>
          </div>

          <button type="button" className="btn btn-secondary" onClick={handleExport}>
            <LuCalendar className="btn-icon" /> Exporter le rapport
          </button>
        </div>
      </div>

      {/* Grid des 4 KPIs */}
      <div className="kpi-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Visites Totales</span>
            <LuTrendingUp className="stat-icon" />
          </div>
          <p className="stat-value">2,840</p>
          <span className="stat-trend badge badge-accent">
            <LuArrowUpRight /> +18.4% vs mois dernier
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Visiteurs Uniques</span>
            <LuUsers className="stat-icon" />
          </div>
          <p className="stat-value">1,420</p>
          <span className="stat-trend badge badge-accent">
            <LuArrowUpRight /> +12.1% vs mois dernier
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Temps Moyen par Session</span>
            <LuClock className="stat-icon" />
          </div>
          <p className="stat-value">2m 45s</p>
          <span className="stat-trend badge badge-neutral">
            <LuArrowUpRight /> +0m 15s
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Taux de Rebond</span>
            <LuChartColumn className="stat-icon" />
          </div>
          <p className="stat-value">34.2%</p>
          <span className="stat-trend badge badge-accent">
            <LuArrowDownRight /> -2.5% (Amélioration)
          </span>
        </div>
      </div>

      {/* Graphique Visuel des Visites */}
      <section className="panel-card chart-panel">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Trafic hebdomadaire</p>
            <h3>Distribution des visites par jour</h3>
          </div>
        </div>

        <div className="chart-bar-container">
          {trafficData.map((item) => (
            <div key={item.day} className="chart-column">
              <div className="bar-wrapper">
                <span className="bar-tooltip">{item.visits} vues</span>
                <div className="bar-fill" style={{ height: item.height }} />
              </div>
              <span className="bar-label font-mono">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Deux colonnes: Top Pages + Répartition Géographique */}
      <div className="analytics-dual-grid">
        <section className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Contenus populaires</p>
              <h3>Top Pages Consultées</h3>
            </div>
          </div>

          <div className="top-pages-list">
            {topPages.map((page) => (
              <div key={page.path} className="page-metric-row">
                <div className="page-info-row">
                  <span className="page-path font-mono">{page.path}</span>
                  <span className="page-views font-mono">{page.views} vues</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${page.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Origine des visiteurs</p>
              <h3>Répartition Géographique</h3>
            </div>
          </div>

          <div className="top-pages-list">
            {topCountries.map((c) => (
              <div key={c.country} className="page-metric-row">
                <div className="page-info-row">
                  <span>{c.flag} {c.country}</span>
                  <span className="font-mono">{c.pct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
