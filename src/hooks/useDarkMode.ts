import { useState, useEffect, useCallback } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('rcc-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('rcc-dark-mode', String(darkMode));
  }, [darkMode]);

  const toggle = useCallback(() => setDarkMode((prev) => !prev), []);

  return { darkMode, toggleDark: toggle } as const;
}
