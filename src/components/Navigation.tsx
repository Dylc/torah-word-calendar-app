import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onPrevYear: () => void;
  onNextYear: () => void;
  currentYear: number;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onPrevYear,
  onNextYear,
  currentYear,
  canGoPrev,
  canGoNext
}) => (
  <div className="navigation">
    <button
      onClick={onPrevYear}
      disabled={!canGoPrev}
      aria-label="שנה קודמת"
      className="nav-button"
    >
      ←
    </button>
    <span className="current-year">{currentYear}</span>
    <button
      onClick={onNextYear}
      disabled={!canGoNext}
      aria-label="שנה הבאה"
      className="nav-button"
    >
      →
    </button>
  </div>
);
