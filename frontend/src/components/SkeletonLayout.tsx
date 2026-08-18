import React from 'react';
import '../css/Skeleton.css';
import '../css/Hero.css';
import '../css/Navbar.css';

const SkeletonLayout: React.FC = () => {
  return (
    <>
      <header className="pf-nav-wrap">
        <div className="pf-nav">
          <a className="pf-nav-logo" aria-hidden>
            <div className="skeleton-logo shimmer" style={{ width: 32, height: 30, borderRadius: 8 }} />
            <div style={{ width: 90, height: 18 }} className="shimmer skeleton-inline-block" />
          </a>

          <nav className="pf-nav-links" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 80, height: 14 }} className="shimmer skeleton-inline-block" />
            ))}
          </nav>

          <div className="pf-nav-actions">
            <div style={{ width: 90, height: 36 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 36, height: 36 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 36, height: 36 }} className="shimmer skeleton-inline-block" />
          </div>
        </div>
      </header>

      <section id="top" className="pf-hero">
        <div className="pf-hero-background-glow" aria-hidden="true" />
        <div className="pf-container pf-hero-inner">
          <div className="pf-hero-badge">
            <div className="pf-dot" />
            <div style={{ width: 220, height: 14 }} className="shimmer skeleton-inline-block" />
          </div>

          <h1 className="pf-hero-title">
            <div style={{ width: '70%', height: 48 }} className="shimmer skeleton-inline-block" />
          </h1>

          <div className="pf-hero-subtitle">
            <p style={{ width: '50%', height: 18, margin: '0 auto' }} className="shimmer skeleton-inline-block" />
          </div>

          <div className="pf-hero-cta">
            <div style={{ width: 180, height: 44 }} className="shimmer skeleton-inline-block" />
            <div style={{ width: 140, height: 44 }} className="shimmer skeleton-inline-block" />
          </div>

          <div className="pf-hero-cards">
            {Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="pf-hero-card" aria-hidden>
                <div className="pf-hero-card-icon shimmer" style={{ width: 42, height: 42, borderRadius: 10 }} />
                <div style={{ width: '80%', height: 18, marginBottom: 10 }} className="shimmer skeleton-inline-block" />
                <div style={{ width: '100%', height: 12, marginBottom: 12 }} className="shimmer skeleton-inline-block" />
                <div style={{ width: '60%', height: 12 }} className="shimmer skeleton-inline-block" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SkeletonLayout;
