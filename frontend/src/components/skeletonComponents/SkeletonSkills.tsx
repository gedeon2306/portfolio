import React from 'react';
import '../../css/skeleton/SkeletonSkills.css';

const SkeletonSkills: React.FC = () => {
  return (
    <div className="skeleton-skills-grid">
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} className="skeleton-skills-card">
          <div className="skeleton-skills-card-header">
            <div className="shimmer" style={{ width: 140, height: 22, borderRadius: 6 }} />
          </div>
          
          <ul className="skeleton-skills-list">
            {Array.from({ length: 5 }).map((_, skillIndex) => (
              <li key={skillIndex} className="skeleton-skill-item">
                <div className="skeleton-skill-row">
                  <div className="skeleton-skill-name">
                    <div className="shimmer" style={{ width: 16, height: 16, borderRadius: 4 }} />
                    <div className="shimmer" style={{ width: 80, height: 14, borderRadius: 4 }} />
                  </div>
                  <div className="shimmer" style={{ width: 30, height: 12, borderRadius: 4 }} />
                </div>
                <div className="skeleton-skill-bar">
                  <div className="skeleton-skill-bar-fill shimmer" style={{ width: '70%' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SkeletonSkills;