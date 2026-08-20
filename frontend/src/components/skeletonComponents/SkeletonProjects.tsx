import React from 'react';
import '../../css/skeleton/SkeletonProjects.css';

const SkeletonProjects: React.FC = () => {
  return (
    <>
      <div className="skeleton-projects-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <article key={index} className="skeleton-project-card">
            <div className="skeleton-project-thumb">
              <div className="shimmer" style={{ width: '100%', height: '100%' }} />
            </div>

            <div className="skeleton-project-body">
              <div className="shimmer" style={{ width: 100, height: 14, borderRadius: 4, marginBottom: 8 }} />
              
              <div className="shimmer" style={{ width: '70%', height: 20, borderRadius: 6, marginBottom: 10 }} />
              
              <div className="shimmer" style={{ width: '90%', height: 14, borderRadius: 4, marginBottom: 6 }} />
              <div className="shimmer" style={{ width: '85%', height: 14, borderRadius: 4, marginBottom: 18 }} />

              <div className="skeleton-project-tags">
                <div className="shimmer" style={{ width: 60, height: 24, borderRadius: 999 }} />
                <div className="shimmer" style={{ width: 70, height: 24, borderRadius: 999 }} />
                <div className="shimmer" style={{ width: 55, height: 24, borderRadius: 999 }} />
              </div>

              <div className="skeleton-project-footer">
                <div className="skeleton-project-links">
                  <div className="shimmer" style={{ width: 32, height: 32, borderRadius: 8 }} />
                  <div className="shimmer" style={{ width: 32, height: 32, borderRadius: 8 }} />
                </div>
                <div className="shimmer" style={{ width: 70, height: 16, borderRadius: 4 }} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="skeleton-projects-actions">
        <div className="shimmer" style={{ width: 200, height: 44, borderRadius: 999 }} />
        <div className="shimmer" style={{ width: 180, height: 44, borderRadius: 999 }} />
      </div>
    </>
  );
};

export default SkeletonProjects;