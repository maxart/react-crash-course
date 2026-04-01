import { memo, useMemo } from 'react';
import type { Section } from '../lib/parseContent';
import { CheckIcon, ExpandIcon, LogoIcon, SearchIcon } from './icons';

interface CollapsedRailProps {
  sections: Section[];
  activeSection: number;
  completedSections: Set<number>;
  onNavigate: (index: number) => void;
  onSearchOpen: () => void;
  onToggleCollapse: () => void;
  progress: number;
}

export const CollapsedRail = memo(function CollapsedRail({
  sections,
  activeSection,
  completedSections,
  onNavigate,
  onSearchOpen,
  onToggleCollapse,
  progress,
}: CollapsedRailProps) {
  const progressStyle = useMemo(() => ({ height: `${progress}%` }), [progress]);

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-screen w-[60px] bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 flex-col items-center py-3 gap-1">
      {/* Logo — click to expand */}
      <button
        onClick={onToggleCollapse}
        className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 mb-1 hover:ring-2 hover:ring-blue-400/50 transition-all"
        aria-label="Expand sidebar"
        title="Expand sidebar"
      >
        <LogoIcon />
      </button>

      {/* Search */}
      <button
        onClick={onSearchOpen}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 mb-1"
        aria-label="Search sections"
        title="Search (⌘K)"
      >
        <SearchIcon />
      </button>

      {/* Thin divider */}
      <div className="w-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0" />

      {/* Section number pills — scrollable */}
      <nav className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-0.5 py-1 scrollbar-thin">
        {sections.map((section, index) => {
          const isActive = activeSection === index;
          const isComplete = completedSections.has(index);

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(index)}
              className={`w-8 h-8 rounded-lg text-[11px] font-bold flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                isComplete
                  ? 'bg-green-500 text-white shadow-sm'
                  : isActive
                    ? 'bg-blue-500 text-white shadow-sm ring-2 ring-blue-300/50 dark:ring-blue-500/30'
                    : 'bg-gray-200/70 dark:bg-gray-700/70 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={`${section.number}. ${section.title}`}
            >
              {isComplete ? <CheckIcon /> : section.number}
            </button>
          );
        })}
      </nav>

      {/* Vertical progress bar */}
      <div className="w-1.5 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0 mt-1 mb-1 relative">
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
          style={progressStyle}
        />
      </div>

      {/* Expand button */}
      <button
        onClick={onToggleCollapse}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
        aria-label="Expand sidebar"
        title="Expand sidebar"
      >
        <ExpandIcon />
      </button>
    </aside>
  );
});
