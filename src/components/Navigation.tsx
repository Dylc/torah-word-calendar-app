import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onPrevYear: () => void;
  onNextYear: () => void;
  currentYear: number;
  yearRange: string;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  yearRange
}) => (
  <div className="navigation">
    <span className="current-year">{yearRange}</span>
  </div>
);
