import React from 'react';
import '../../css/skeleton/Skeleton.css';
import '../../css/Hero.css';
import '../../css/Navbar.css';

const SkeletonLayout: React.FC = () => {
  return (
    <>
      <header className="pf-nav-wrap">
        <div className="pf-nav skeleton-nav-shell">
          <div className="pf-nav-logo" aria-hidden>
            <div className="skeleton-logo shimmer" style={{ width: 32, height: 30, borderRadius: 8 }} />
            <div style={{ width: 90, height: 18 }} className="shimmer skeleton-inline-block" />
          </div>

          <nav className="pf-nav-links" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 80, height: 14 }} className="shimmer skeleton-inline-block" />
            ))}
          </nav>

          <div className="pf-nav-actions">
            <div style={{ width: 96, height: 36, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 36, height: 36, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 36, height: 36, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
          </div>
        </div>
      </header>

      <section id="top" className="pf-hero skeleton-hero-shell">
        <div className="pf-hero-background-glow" aria-hidden="true" />
        <div className="pf-container pf-hero-inner">
          <div className="pf-hero-badge skeleton-hero-badge">
            <div className="pf-dot" />
            <div style={{ width: 220, height: 14 }} className="shimmer skeleton-inline-block" />
          </div>

          <h1 className="pf-hero-title skeleton-title-block">
            <div style={{ width: '70%', height: 54, borderRadius: 18 }} className="shimmer skeleton-inline-block" />
          </h1>

          <div className="pf-hero-subtitle skeleton-subtitle-block">
            <div style={{ width: '60%', height: 20, margin: '0 auto 10px' }} className="shimmer skeleton-inline-block" />
            <div style={{ width: '48%', height: 20, margin: '0 auto' }} className="shimmer skeleton-inline-block" />
          </div>

          <div className="pf-hero-cta skeleton-cta-block">
            <div style={{ width: 188, height: 48, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 152, height: 48, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
          </div>

          <div className="pf-hero-cards skeleton-cards-shell">
            {Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="pf-hero-card skeleton-card" aria-hidden>
                <div className="pf-hero-card-icon shimmer skeleton-card-icon" style={{ width: 42, height: 42, borderRadius: 10 }} />
                <div style={{ width: '82%', height: 18, marginBottom: 12 }} className="shimmer skeleton-inline-block" />
                <div style={{ width: '100%', height: 12, marginBottom: 10 }} className="shimmer skeleton-inline-block" />
                <div style={{ width: '86%', height: 12, marginBottom: 10 }} className="shimmer skeleton-inline-block" />
                <div style={{ width: '58%', height: 12, marginBottom: 18 }} className="shimmer skeleton-inline-block" />

                <div className="skeleton-card-tags">
                  <span style={{ width: 72, height: 28, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
                  <span style={{ width: 86, height: 28, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
                  <span style={{ width: 64, height: 28, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
                </div>

                <div style={{ width: 130, height: 14, borderRadius: 999 }} className="shimmer skeleton-inline-block" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SkeletonLayout;
