import React from 'react';

interface SpinnerProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size, color, className = '' }) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        ...(size ? { width: size, height: size } : {}),
        ...(color ? ({ '--spinner-color': color } as React.CSSProperties) : {}),
      }}
      aria-label="Chargement..."
      role="status"
    />
  );
};

export default Spinner;
