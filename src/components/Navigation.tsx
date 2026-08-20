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
  currentYear
}) => (
  <div className="navigation">
    <span className="current-year">{currentYear}</span>
    <span className="swipe-hint">החלק לשינוי שנה</span>
  </div>
);
