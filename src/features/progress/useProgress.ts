import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'rcc-completed';

function loadCompleted(): Set<number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Manages section completion state with localStorage persistence.
 * Returns a stable API — all callbacks are memoized.
 */
export function useProgress(totalSections: number) {
  const [completedSections, setCompletedSections] = useState<Set<number>>(loadCompleted);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSections]));
  }, [completedSections]);

  const toggleComplete = useCallback((index: number) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const progress = useMemo(
    () => (totalSections > 0 ? Math.round((completedSections.size / totalSections) * 100) : 0),
    [completedSections.size, totalSections],
  );

  return { completedSections, toggleComplete, progress } as const;
}
