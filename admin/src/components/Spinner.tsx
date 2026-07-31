'use client';

interface SpinnerProps {
  color?: string;
}

export const Spinner = ({ color }: SpinnerProps) => {
  return (
    <div
      className="spinner"
      style={color ? ({ '--spinner-color': color } as React.CSSProperties) : undefined}
    />
  );
};