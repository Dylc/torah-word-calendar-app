import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVerseData } from './hooks/useVerseData';
import { useSwipe } from './hooks/useSwipe';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { findVerseByYear } from './utils/verseMapper';
import { formatGregorianRange } from './utils/dateFormatter';
import { VerseDisplay } from './components/VerseDisplay';
import { Navigation } from './components/Navigation';
import './App.css';

function App() {
  const { verses, isLoading } = useVerseData();
  const navigate = useNavigate();
  const { year: urlYear } = useParams<{ year: string }>();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(() => {
    const parsed = urlYear ? parseInt(urlYear, 10) : currentYear;
    return !isNaN(parsed) && parsed >= 1130 && parsed <= 2084 ? parsed : currentYear;
  });

  const [showNikud, setShowNikud] = useState(false);

  useEffect(() => {
    if (urlYear) {
      const parsed = parseInt(urlYear, 10);
      if (!isNaN(parsed) && parsed >= 1130 && parsed <= 2084 && parsed !== year) {
        setYear(parsed);
      }
    } else if (year !== currentYear) {
      // No URL year but we have a year - add it to URL
      navigate(`/${year}`, { replace: true });
    }
  }, [urlYear, year, currentYear, navigate]);

  const canGoPrev = year > 1130;
  const canGoNext = year < 2084;

  const currentVerse = findVerseByYear(verses, year);

  const yearRange = currentVerse
    ? formatGregorianRange(
        currentVerse.gregorian_date_range.from,
        currentVerse.gregorian_date_range.to
      )
    : `${year}`;

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    navigate(`/${newYear}`);
  };

  const handlePrevYear = () => {
    if (canGoPrev) handleYearChange(year - 1);
  };

  const handleNextYear = () => {
    if (canGoNext) handleYearChange(year + 1);
  };

  const handleRefresh = async () => {
    // Reload the page to fetch fresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  const { pullToRefreshHandlers, pullState } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  });

  const swipeHandlers = useSwipe({
    onSwipeLeft: handleNextYear,
    onSwipeRight: handlePrevYear
  });

  const { onTouchStart, onTouchMove, onTouchEnd, swipeTransform } = swipeHandlers;

  // Combine touch handlers
  const combinedTouchStart = (e: React.TouchEvent) => {
    onTouchStart(e);
    pullToRefreshHandlers.onTouchStart(e);
  };

  const combinedTouchMove = (e: React.TouchEvent) => {
    onTouchMove(e);
    pullToRefreshHandlers.onTouchMove(e);
  };

  const combinedTouchEnd = () => {
    onTouchEnd();
    pullToRefreshHandlers.onTouchEnd();
  };

  return (
    <main
      className="app"
      onTouchStart={combinedTouchStart}
      onTouchMove={combinedTouchMove}
      onTouchEnd={combinedTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {(pullState.isPulling || pullState.isRefreshing) && (
        <div
          className="pull-refresh-indicator"
          style={{
            transform: `translateY(${pullState.pullDistance}px)`,
            opacity: Math.min(pullState.pullDistance / pullState.threshold, 1)
          }}
        >
          {pullState.isRefreshing ? '↻' : '↓'}
        </div>
      )}

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
        swipeTransform={swipeTransform}
      />

      <Navigation
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
        currentYear={year}
        yearRange={yearRange}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </main>
  );
}

export default App;
