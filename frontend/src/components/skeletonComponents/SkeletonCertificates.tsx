import React from 'react';
import '../../css/skeleton/SkeletonCertificates.css';

const SkeletonCertificates: React.FC = () => {
  return (
    <section id="certificates" className="pf-certificates">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Accréditations & Diplômes</span>
          <h2 className="pf-section-title">Certifications Professionnelles</h2>
          <p className="pf-section-subtitle">
            Formations continues certifiées par les leaders technologiques mondiaux pour garantir les meilleures pratiques d'ingénierie.
          </p>
        </div>

        <div className="skeleton-cert-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="skeleton-cert-card">
              <div className="skeleton-cert-thumb">
                <div className="shimmer" style={{ width: '100%', height: '100%' }} />
              </div>

              <div className="skeleton-cert-body">
                <div className="skeleton-cert-meta-top">
                  <div className="shimmer" style={{ width: 80, height: 22, borderRadius: 999 }} />
                  <div className="shimmer" style={{ width: 60, height: 14, borderRadius: 4 }} />
                </div>

                <div className="shimmer" style={{ width: '75%', height: 20, borderRadius: 6, marginBottom: 10 }} />
                <div className="shimmer" style={{ width: '90%', height: 14, borderRadius: 4, marginBottom: 8 }} />
                <div className="shimmer" style={{ width: '85%', height: 14, borderRadius: 4, marginBottom: 20 }} />

                <div className="skeleton-cert-footer">
                  <div className="skeleton-cert-issuer-box">
                    <div className="shimmer" style={{ width: 120, height: 16, borderRadius: 4 }} />
                    <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4 }} />
                  </div>
                  <div className="shimmer" style={{ width: 80, height: 28, borderRadius: 999 }} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="skeleton-cert-actions">
          <div className="shimmer" style={{ width: 200, height: 44, borderRadius: 999 }} />
          <div className="shimmer" style={{ width: 180, height: 44, borderRadius: 999 }} />
        </div>
      </div>
    </section>
  );
};

export default SkeletonCertificates;