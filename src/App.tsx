import { useState } from 'react';
import { useVerseData } from './hooks/useVerseData';
import { useSwipe } from './hooks/useSwipe';
import { findVerseByYear } from './utils/verseMapper';
import { formatGregorianRange } from './utils/dateFormatter';
import { VerseDisplay } from './components/VerseDisplay';
import { Navigation } from './components/Navigation';
import './App.css';

const COLOR_PALETTES = {
  'current': {
    bg: '#1A1D23',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
  },
  'sepia': {
    bg: '#2B2520',
    textPrimary: '#F5E6D3',
    textSecondary: '#B8A690',
  },
  'purple': {
    bg: '#1A1525',
    textPrimary: '#F0E6FF',
    textSecondary: '#A89BC7',
  },
  'green': {
    bg: '#1A2322',
    textPrimary: '#E8F4F2',
    textSecondary: '#A0BDB9',
  },
  'charcoal': {
    bg: '#1C1C1C',
    textPrimary: '#EFEFEF',
    textSecondary: '#9A9A9A',
  },
  'navy': {
    bg: '#0F1419',
    textPrimary: '#E6F1FF',
    textSecondary: '#8B9DC3',
  },
} as const;

type PaletteName = keyof typeof COLOR_PALETTES;

function App() {
  const { verses, isLoading } = useVerseData();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showNikud, setShowNikud] = useState(false);
  const [palette, setPalette] = useState<PaletteName>('current');

  const currentVerse = findVerseByYear(verses, year);
  const canGoPrev = year > 1130;
  const canGoNext = year < 2084;

  const yearRange = currentVerse
    ? formatGregorianRange(
        currentVerse.gregorian_date_range.from,
        currentVerse.gregorian_date_range.to
      )
    : `${year}`;

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

  const cyclePalette = () => {
    const paletteNames: PaletteName[] = ['current', 'sepia', 'purple', 'green', 'charcoal', 'navy'];
    const currentIndex = paletteNames.indexOf(palette);
    const nextIndex = (currentIndex + 1) % paletteNames.length;
    setPalette(paletteNames[nextIndex]);
  };

  const currentColors = COLOR_PALETTES[palette];

  return (
    <main
      className="app"
      {...swipeHandlers}
      style={{
        '--bg-primary': currentColors.bg,
        '--text-primary': currentColors.textPrimary,
        '--text-secondary': currentColors.textSecondary,
      } as React.CSSProperties}
    >
      <button
        className="nikud-toggle"
        onClick={() => setShowNikud(!showNikud)}
      >
        {showNikud ? 'ללא ניקוד' : 'עם ניקוד'}
      </button>

      <button
        className="palette-toggle"
        onClick={cyclePalette}
        title={`Current: ${palette}`}
      >
        🎨
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
        yearRange={yearRange}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </main>
  );
}

export default App;
