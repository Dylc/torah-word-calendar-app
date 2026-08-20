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
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    const saved = localStorage.getItem('hapticsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (urlYear) {
      const parsed = parseInt(urlYear, 10);
      if (!isNaN(parsed) && parsed >= 1130 && parsed <= 2084 && parsed !== year) {
        setYear(parsed);
      }
    }
  }, [urlYear, year]);

  const canGoPrev = year > 1130;
  const canGoNext = year < 2084;

  const currentVerse = findVerseByYear(verses, year);
  const prevVerse = canGoPrev ? findVerseByYear(verses, year - 1) : null;
  const nextVerse = canGoNext ? findVerseByYear(verses, year + 1) : null;

  const yearRange = currentVerse
    ? formatGregorianRange(
        currentVerse.gregorian_date_range.from,
        currentVerse.gregorian_date_range.to
      )
    : `${year}`;

  const triggerHaptic = () => {
    if (hapticsEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    navigate(`/${newYear}`, { replace: true });
    triggerHaptic();
  };

  const handlePrevYear = () => {
    if (canGoPrev) handleYearChange(year - 1);
  };

  const handleNextYear = () => {
    if (canGoNext) handleYearChange(year + 1);
  };

  const toggleHaptics = () => {
    const newValue = !hapticsEnabled;
    setHapticsEnabled(newValue);
    localStorage.setItem('hapticsEnabled', JSON.stringify(newValue));
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
    onSwipeRight: handlePrevYear,
    canGoPrev,
    canGoNext,
    currentYear: year
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

      <button
        className="haptics-toggle"
        onClick={toggleHaptics}
        title={hapticsEnabled ? 'Haptics enabled' : 'Haptics disabled'}
      >
        {hapticsEnabled ? '📳' : '🔇'}
      </button>

      <div className="verses-container">
        {/* Previous verse - slides in from left */}
        {swipeTransform.showPrev && prevVerse && (
          <div
            className="verse-adjacent verse-prev"
            style={{
              transform: `translateX(calc(-100% + ${swipeTransform.x}px))`,
              opacity: swipeTransform.prevOpacity
            }}
          >
            <VerseDisplay
              verse={prevVerse}
              showNikud={showNikud}
              isLoading={false}
              swipeTransform={{ x: 0, opacity: 1, showPrev: false, showNext: false, prevOpacity: 0, nextOpacity: 0 }}
            />
          </div>
        )}

        {/* Current verse */}
        <VerseDisplay
          verse={currentVerse}
          showNikud={showNikud}
          isLoading={isLoading}
          swipeTransform={swipeTransform}
        />

        {/* Next verse - slides in from right */}
        {swipeTransform.showNext && nextVerse && (
          <div
            className="verse-adjacent verse-next"
            style={{
              transform: `translateX(calc(100% + ${swipeTransform.x}px))`,
              opacity: swipeTransform.nextOpacity
            }}
          >
            <VerseDisplay
              verse={nextVerse}
              showNikud={showNikud}
              isLoading={false}
              swipeTransform={{ x: 0, opacity: 1, showPrev: false, showNext: false, prevOpacity: 0, nextOpacity: 0 }}
            />
          </div>
        )}
      </div>

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
