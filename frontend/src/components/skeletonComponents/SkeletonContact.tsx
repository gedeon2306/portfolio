import React from 'react';
import '../../css/skeleton/SkeletonContact.css';

const SkeletonContact: React.FC = () => {
  return (
    <>
      <div className="skeleton-contact-grid">
        <div className="skeleton-contact-info">
          <div className="skeleton-contact-info-header">
            <div className="shimmer" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <div>
              <div className="shimmer" style={{ width: 140, height: 24, borderRadius: 6, marginBottom: 6 }} />
              <div className="shimmer" style={{ width: 120, height: 14, borderRadius: 4 }} />
            </div>
          </div>

          <div className="shimmer" style={{ width: '90%', height: 14, borderRadius: 4, marginBottom: 8 }} />
          <div className="shimmer" style={{ width: '80%', height: 14, borderRadius: 4, marginBottom: 28 }} />

          <ul className="skeleton-contact-list">
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="skeleton-contact-item">
                <div className="shimmer" style={{ width: 38, height: 38, borderRadius: 8 }} />
                <div className="skeleton-contact-details">
                  <div className="shimmer" style={{ width: 80, height: 11, borderRadius: 4, marginBottom: 4 }} />
                  <div className="shimmer" style={{ width: 140, height: 14, borderRadius: 4 }} />
                </div>
                <div className="shimmer" style={{ width: 14, height: 14, borderRadius: 4 }} />
              </li>
            ))}
          </ul>

          <div className="skeleton-contact-socials-wrap">
            <div className="shimmer" style={{ width: 160, height: 11, borderRadius: 4, marginBottom: 12 }} />
            <div className="skeleton-contact-socials">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="shimmer" style={{ width: 36, height: 36, borderRadius: 8 }} />
              ))}
            </div>
          </div>
        </div>

        <div className="skeleton-contact-form-wrap">
          <form className="skeleton-contact-form">
            <div className="skeleton-form-row">
              <div className="skeleton-field">
                <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4, marginBottom: 6 }} />
                <div className="shimmer" style={{ width: '100%', height: 40, borderRadius: 8 }} />
              </div>
              <div className="skeleton-field">
                <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4, marginBottom: 6 }} />
                <div className="shimmer" style={{ width: '100%', height: 40, borderRadius: 8 }} />
              </div>
            </div>

            <div className="skeleton-field">
              <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4, marginBottom: 6 }} />
              <div className="shimmer" style={{ width: '100%', height: 40, borderRadius: 8 }} />
            </div>

            <div className="skeleton-field">
              <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4, marginBottom: 6 }} />
              <div className="shimmer" style={{ width: '100%', height: 120, borderRadius: 8 }} />
            </div>

            <div className="skeleton-form-footer">
              <div className="shimmer" style={{ width: 180, height: 44, borderRadius: 999 }} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SkeletonContact;