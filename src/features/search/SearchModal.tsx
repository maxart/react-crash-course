import { memo, useState, useEffect, useRef, useCallback } from 'react';
import type { Section } from '../../lib/parseContent';
import { useSearch } from './useSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onNavigate: (index: number) => void;
}

export const SearchModal = memo(function SearchModal({
  isOpen,
  onClose,
  sections,
  onNavigate,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useSearch(sections, query);

  // Focus input on open, reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) onNavigate(results[selectedIndex].index);
          break;
      }
    },
    [results, selectedIndex, onNavigate],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] sm:pt-[18vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across all sections..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
          <kbd
            className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto">
          {Boolean(query.trim()) && results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-400 dark:text-gray-600">
                No results for &ldquo;<span className="text-gray-600 dark:text-gray-400">{query}</span>&rdquo;
              </p>
            </div>
          )}

          {results.map((r, i) => (
            <button
              key={r.index}
              onClick={() => onNavigate(r.index)}
              className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition-colors ${
                i === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              } ${i < results.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/50' : ''}`}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span
                className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                  i === selectedIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {r.section.number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {r.section.title}
                </p>
                {r.snippet && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {r.snippet}
                  </p>
                )}
              </div>
              {i === selectedIndex && (
                <kbd className="flex-shrink-0 mt-1 text-[10px] font-mono text-blue-500 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40">
                  &#9166;
                </kbd>
              )}
            </button>
          ))}

          {!query.trim() && (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">
                Type to search across all {sections.length} sections
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-700">
                Use{' '}
                <kbd className="font-mono px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400">&#8593;</kbd>{' '}
                <kbd className="font-mono px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400">&#8595;</kbd>{' '}
                to navigate,{' '}
                <kbd className="font-mono px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400">&#9166;</kbd>{' '}
                to select
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
