import { useState } from 'react';
import { useVerseData } from './hooks/useVerseData';
import { useSwipe } from './hooks/useSwipe';
import { findVerseByYear } from './utils/verseMapper';
import { VerseDisplay } from './components/VerseDisplay';
import { Navigation } from './components/Navigation';
import './App.css';

function App() {
  const { verses, isLoading } = useVerseData();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showNikud, setShowNikud] = useState(true);

  const currentVerse = findVerseByYear(verses, year);
  const canGoPrev = year > 1130;
  const canGoNext = year < 2084;

  const handlePrevYear = () => {
    if (canGoPrev) setYear(year - 1);
  };

  const handleNextYear = () => {
    if (canGoNext) setYear(year + 1);
  };

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleNextYear,
    onSwipeRight: handlePrevYear
  });

  return (
    <main className="app" {...swipeHandlers}>
      <button
        className="nikud-toggle"
        onClick={() => setShowNikud(!showNikud)}
      >
        {showNikud ? 'ללא ניקוד' : 'עם ניקוד'}
      </button>

      <VerseDisplay
        verse={currentVerse}
        showNikud={showNikud}
        isLoading={isLoading}
      />

      <Navigation
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
        currentYear={year}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </main>
  );
}

export default App;
