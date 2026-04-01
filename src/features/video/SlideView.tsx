import { memo } from 'react';
import type { Slide } from './narrationScripts';

export const SlideView = memo(function SlideView({
  slide,
  slideIndex,
  totalSlides,
  isActive,
}: {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  isActive: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col p-6 sm:p-10 transition-all duration-500 ${
        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      }`}
    >
      {/* Slide number */}
      <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-4">
        SLIDE {slideIndex + 1} / {totalSlides}
      </div>

      {/* Heading */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight">
        {slide.heading}
      </h3>

      {/* Bullets */}
      <ul className="space-y-3 mb-6 flex-1">
        {slide.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
            <span className={isActive ? 'slide-bullet-enter' : ''}>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Code block */}
      {slide.code && (
        <div className="mt-auto rounded-xl bg-gray-900 dark:bg-gray-800/80 border border-gray-700/50 p-4 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono text-green-400 leading-relaxed whitespace-pre-wrap">
            {slide.code}
          </pre>
        </div>
      )}
    </div>
  );
});
