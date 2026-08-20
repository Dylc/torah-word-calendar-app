import { useState } from 'react';

interface SwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  minSwipeDistance?: number;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  currentYear?: number;
}

export const useSwipe = (options: SwipeOptions) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = options.minSwipeDistance || 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) options.onSwipeLeft();
    if (isRightSwipe) options.onSwipeRight();

    setIsSwiping(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const getSwipeTransform = () => {
    if (!isSwiping || !touchStart || !touchEnd) return { x: 0, opacity: 1, showIndicator: false, indicatorYear: null, indicatorDirection: null };

    const distance = touchEnd - touchStart;
    const maxDistance = 150;
    const clampedDistance = Math.max(-maxDistance, Math.min(maxDistance, distance));
    const opacity = 1 - Math.abs(clampedDistance) / maxDistance * 0.5;

    // Show year indicator when swiped more than 30px
    const showIndicator = Math.abs(clampedDistance) > 30;
    let indicatorYear = null;
    let indicatorDirection: 'left' | 'right' | null = null;

    if (showIndicator && options.currentYear) {
      if (clampedDistance > 0 && options.canGoPrev) {
        // Swiping right - show previous year
        indicatorYear = options.currentYear - 1;
        indicatorDirection = 'right';
      } else if (clampedDistance < 0 && options.canGoNext) {
        // Swiping left - show next year
        indicatorYear = options.currentYear + 1;
        indicatorDirection = 'left';
      }
    }

    return { x: clampedDistance, opacity, showIndicator, indicatorYear, indicatorDirection };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    swipeTransform: getSwipeTransform()
  };
};
