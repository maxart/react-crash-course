import { memo, useMemo } from 'react';

interface MobileHeaderProps {
  title: string;
  progress: number;
  darkMode: boolean;
  onToggleSidebar: () => void;
  onToggleDark: () => void;
  onSearchOpen: () => void;
}

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" />
    <path
      strokeLinecap="round"
      d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      strokeWidth={2}
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const MobileHeader = memo(function MobileHeader({
  title,
  progress,
  darkMode,
  onToggleSidebar,
  onToggleDark,
  onSearchOpen,
}: MobileHeaderProps) {
  const progressStyle = useMemo(() => ({ width: `${progress}%` }), [progress]);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        <span className="font-semibold text-sm truncate px-4">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onSearchOpen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <button
            onClick={onToggleDark}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
          style={progressStyle}
        />
      </div>
    </header>
  );
});
