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
    if (!isSwiping || !touchStart || !touchEnd) {
      return {
        x: 0,
        opacity: 1,
        showPrev: false,
        showNext: false,
        prevOpacity: 0,
        nextOpacity: 0
      };
    }

    const distance = touchEnd - touchStart;
    const maxDistance = 150;
    const clampedDistance = Math.max(-maxDistance, Math.min(maxDistance, distance));
    const opacity = 1 - Math.abs(clampedDistance) / maxDistance * 0.3;

    // Calculate adjacent verse visibility
    const progress = Math.abs(clampedDistance) / maxDistance;
    const adjacentOpacity = Math.min(progress * 1.2, 0.8);

    const showPrev = clampedDistance > 10 && options.canGoPrev;
    const showNext = clampedDistance < -10 && options.canGoNext;

    return {
      x: clampedDistance,
      opacity,
      showPrev,
      showNext,
      prevOpacity: showPrev ? adjacentOpacity : 0,
      nextOpacity: showNext ? adjacentOpacity : 0
    };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    swipeTransform: getSwipeTransform()
  };
};
