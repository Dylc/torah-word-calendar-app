import { useState, useRef } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const usePullToRefresh = (options: PullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const scrollTop = useRef(0);

  const threshold = options.threshold || 80;

  const onTouchStart = (e: React.TouchEvent) => {
    scrollTop.current = window.scrollY;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || scrollTop.current > 0 || isRefreshing) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStartY.current;

    if (distance > 0) {
      setIsPulling(true);
      // Resistance effect - diminishing returns as you pull further
      const resistance = 0.5;
      setPullDistance(Math.min(distance * resistance, threshold * 1.5));
    }
  };

  const onTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await options.onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setIsPulling(false);
    setPullDistance(0);
    touchStartY.current = null;
  };

  return {
    pullToRefreshHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    pullState: {
      isPulling,
      isRefreshing,
      pullDistance,
      threshold
    }
  };
};
