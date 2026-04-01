import { memo } from 'react';

interface HeroSectionProps {
  sectionCount: number;
  progress: number;
}

export const HeroSection = memo(function HeroSection({ sectionCount, progress }: HeroSectionProps) {
  return (
    <div className="mb-16 lg:mb-20">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-6">
        <svg className="w-3.5 h-3.5" viewBox="0 0 197 170" fill="currentColor">
          <polygon points="98.16 102.01 42.1757011 5.09911711 39.23 0 0 0 2.94507611 5.10107823 98.16 170.02 196.32 0 157.06 0"/>
          <polygon points="98.16 29.0371525 81.35 0 75.5 0 0 0 2.94 5.1 78.4487095 5.1 98.16 39.26 117.879366 5.1 193.38 5.1 196.325 0 120.82 0 114.973219 0"/>
        </svg>
        For Vue 3 Developers
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          The React Bible
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
        A comprehensive crash course for mid/senior frontend engineers transitioning from Vue 3 to
        React 18+. Everything you need to get productive fast.
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-8 text-sm text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {sectionCount} sections
        </span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ~2 hour read
        </span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {progress}% complete
        </span>
      </div>
    </div>
  );
});
