import React from 'react';
import { Verse } from '../types/verse';
import { formatGregorianRange } from '../utils/dateFormatter';
import './VerseDisplay.css';

interface VerseDisplayProps {
  verse: Verse | null;
  showNikud: boolean;
  isLoading: boolean;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verse,
  showNikud,
  isLoading
}) => {
  if (isLoading) {
    return <div className="verse-loading">טוען...</div>;
  }

  if (!verse) {
    return <div className="verse-error">שגיאה בטעינת הפסוק</div>;
  }

  const hebrewText = showNikud
    ? verse.hebrew_text_with_nikud
    : verse.hebrew_text_no_nikud;

  const yearRange = formatGregorianRange(
    verse.gregorian_date_range.from,
    verse.gregorian_date_range.to
  );

  return (
    <div className="verse-container">
      <p className="verse-text" dir="rtl">
        {hebrewText}
      </p>
      <p className="verse-source" dir="rtl">
        {verse.reference}
      </p>
      <p className="verse-year">{yearRange}</p>
    </div>
  );
};
