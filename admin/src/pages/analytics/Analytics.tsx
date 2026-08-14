import { useState, useEffect, useCallback } from 'react';
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
import { fetchAnalytics } from '../../api/Actions';
import type { AnalyticsRange, AnalyticsResponse } from '../../types/Types';
import './Analytics.css';

// Convertit un code pays ISO (ex: "FR") en emoji drapeau, sans table de correspondance à maintenir
function countryFlagEmoji(code: string | null): string {
  if (!code || code.length !== 2) return '🌍';
  const points = code
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...points);
}

function formatDuration(seconds: number): string {
  const sign = seconds < 0 ? '-' : '';
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = Math.round(abs % 60);
  return `${sign}${m}m ${s}s`;
}

function formatTrendPct(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct}%`;
}

export default function Analytics() {
  const toast = useToast();
  const [timeRange, setTimeRange] = useState<AnalyticsRange>('30d');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async (range: AnalyticsRange) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAnalytics(range);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de charger les statistiques.';
      setError(message);
      toast.error('Erreur', message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAnalytics(timeRange);
  }, [timeRange, loadAnalytics]);

  const handleExport = () => {
    if (!data) return;

    const lines: string[] = [];
    lines.push('Rapport Analytics');
    lines.push(`Période,${data.range}`);
    lines.push('');
    lines.push('KPI,Valeur,Tendance');
    lines.push(`Visites Totales,${data.kpis.total_visits.value},${formatTrendPct(data.kpis.total_visits.trend_pct)}`);
    lines.push(`Visiteurs Uniques,${data.kpis.unique_visitors.value},${formatTrendPct(data.kpis.unique_visitors.trend_pct)}`);
    lines.push(`Temps Moyen par Session,${formatDuration(data.kpis.avg_session_duration.value_seconds)},${formatDuration(data.kpis.avg_session_duration.trend_seconds)}`);
    lines.push(`Taux de Rebond,${data.kpis.bounce_rate.value_pct}%,${formatTrendPct(data.kpis.bounce_rate.trend_pct)}`);
    lines.push('');
    lines.push('Trafic par jour');
    lines.push('Jour,Date,Visites');
    data.weekly_traffic.forEach((d) => lines.push(`${d.day},${d.date},${d.visits}`));
    lines.push('');
    lines.push('Top Pages');
    lines.push('Page,Vues,Pourcentage');
    data.top_pages.forEach((p) => lines.push(`${p.path},${p.views},${p.pct}%`));
    lines.push('');
    lines.push('Répartition Géographique');
    lines.push('Pays,Pourcentage');
    data.top_countries.forEach((c) => lines.push(`${c.country},${c.pct}%`));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${data.range}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Rapport exporté', 'Fichier CSV des statistiques téléchargé.');
  };

  const maxVisits = data ? Math.max(1, ...data.weekly_traffic.map((d) => d.visits)) : 1;

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

          <button type="button" className="btn btn-secondary" onClick={handleExport} disabled={!data}>
            <LuCalendar className="btn-icon" /> Exporter le rapport
          </button>
        </div>
      </div>

      {error && !loading && (
        <div className="panel-card">
          <p>{error}</p>
        </div>
      )}

      {loading && !data ? (
        <div className="panel-card">
          <p>Chargement des statistiques...</p>
        </div>
      ) : data ? (
        <>
          {/* Grid des 4 KPIs */}
          <div className="kpi-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Visites Totales</span>
                <LuTrendingUp className="stat-icon" />
              </div>
              <p className="stat-value">{data.kpis.total_visits.value.toLocaleString('fr-FR')}</p>
              <span className={`stat-trend badge ${data.kpis.total_visits.trend_pct >= 0 ? 'badge-accent' : 'badge-neutral'}`}>
                {data.kpis.total_visits.trend_pct >= 0 ? <LuArrowUpRight /> : <LuArrowDownRight />}
                {formatTrendPct(data.kpis.total_visits.trend_pct)} vs période précédente
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Visiteurs Uniques</span>
                <LuUsers className="stat-icon" />
              </div>
              <p className="stat-value">{data.kpis.unique_visitors.value.toLocaleString('fr-FR')}</p>
              <span className={`stat-trend badge ${data.kpis.unique_visitors.trend_pct >= 0 ? 'badge-accent' : 'badge-neutral'}`}>
                {data.kpis.unique_visitors.trend_pct >= 0 ? <LuArrowUpRight /> : <LuArrowDownRight />}
                {formatTrendPct(data.kpis.unique_visitors.trend_pct)} vs période précédente
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Temps Moyen par Session</span>
                <LuClock className="stat-icon" />
              </div>
              <p className="stat-value">{formatDuration(data.kpis.avg_session_duration.value_seconds)}</p>
              <span className="stat-trend badge badge-neutral">
                {data.kpis.avg_session_duration.trend_seconds >= 0 ? <LuArrowUpRight /> : <LuArrowDownRight />}
                {formatDuration(data.kpis.avg_session_duration.trend_seconds)}
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Taux de Rebond</span>
                <LuChartColumn className="stat-icon" />
              </div>
              <p className="stat-value">{data.kpis.bounce_rate.value_pct}%</p>
              <span className={`stat-trend badge ${data.kpis.bounce_rate.trend_pct <= 0 ? 'badge-accent' : 'badge-neutral'}`}>
                {data.kpis.bounce_rate.trend_pct <= 0 ? <LuArrowDownRight /> : <LuArrowUpRight />}
                {formatTrendPct(data.kpis.bounce_rate.trend_pct)} {data.kpis.bounce_rate.trend_pct <= 0 ? '(Amélioration)' : ''}
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
              {data.weekly_traffic.map((item) => (
                <div key={item.date} className="chart-column">
                  <div className="bar-wrapper">
                    <span className="bar-tooltip">{item.visits} vues</span>
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.max(4, (item.visits / maxVisits) * 100)}%` }}
                    />
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
                {data.top_pages.length === 0 && <p>Aucune donnée pour cette période.</p>}
                {data.top_pages.map((page) => (
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
                {data.top_countries.length === 0 && <p>Aucune donnée pour cette période.</p>}
                {data.top_countries.map((c) => (
                  <div key={c.country} className="page-metric-row">
                    <div className="page-info-row">
                      <span>{countryFlagEmoji(c.code)} {c.country}</span>
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
        </>
      ) : null}
    </div>
  );
}