import { memo, useMemo } from 'react';
import type { Section } from '../lib/parseContent';
import { CheckIcon, CollapseIcon, LogoIcon, MoonIcon, SearchIcon, SunIcon } from './icons';
import { CollapsedRail } from './CollapsedRail';

interface SidebarProps {
  sections: Section[];
  activeSection: number;
  completedSections: Set<number>;
  isOpen: boolean;
  collapsed: boolean;
  onNavigate: (index: number) => void;
  onSearchOpen: () => void;
  onToggleDark: () => void;
  onToggleCollapse: () => void;
  darkMode: boolean;
  progress: number;
  completedCount: number;
}

export const Sidebar = memo(function Sidebar({
  sections,
  activeSection,
  completedSections,
  isOpen,
  collapsed,
  onNavigate,
  onSearchOpen,
  onToggleDark,
  onToggleCollapse,
  darkMode,
  progress,
  completedCount,
}: SidebarProps) {
  const progressStyle = useMemo(() => ({ width: `${progress}%` }), [progress]);

  // On desktop: if collapsed, render the narrow rail instead
  // On mobile: collapsed state is ignored — always use the full overlay sidebar
  if (collapsed && !isOpen) {
    return (
      <CollapsedRail
        sections={sections}
        activeSection={activeSection}
        completedSections={completedSections}
        onNavigate={onNavigate}
        onSearchOpen={onSearchOpen}
        onToggleCollapse={onToggleCollapse}
        progress={progress}
      />
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 lg:z-30 h-screen w-80 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <LogoIcon />
            </div>
            <h2 className="font-bold text-sm">The React Bible</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            {/* Collapse button — desktop only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>

        {/* Search trigger */}
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm"
        >
          <SearchIcon />
          <span className="text-left flex-1">Search sections...</span>
          <kbd className="hidden sm:inline text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
            &#8984;K
          </kbd>
        </button>
      </div>

      {/* Section list */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {sections.map((section, index) => {
          const isActive = activeSection === index;
          const isComplete = completedSections.has(index);

          return (
            <button
              key={section.id}
              onClick={() => onNavigate(index)}
              className={`w-full text-left px-3 py-2.5 mb-0.5 rounded-xl flex items-center gap-3 text-[13px] transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-colors ${
                  isComplete
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {isComplete ? <CheckIcon /> : section.number}
              </span>
              <span className="truncate leading-tight">{section.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Progress footer */}
      <div className="flex-shrink-0 p-5 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-gray-500 dark:text-gray-500 font-medium">Progress</span>
          <span className="text-gray-400 dark:text-gray-600 tabular-nums">
            {completedCount} / {sections.length} sections
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
            style={progressStyle}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium text-center">
            Course complete!
          </p>
        )}
      </div>
    </aside>
  );
});
