import { memo, useEffect } from 'react';
import type { SectionNarration } from './narrationScripts';
import { SlideView } from './SlideView';
import { ProgressDots } from './ProgressDots';
import { useVideoPlayback } from './useVideoPlayback';

interface VideoPlayerProps {
  narration: SectionNarration;
  onClose: () => void;
}

export const VideoPlayer = memo(function VideoPlayer({ narration, onClose }: VideoPlayerProps) {
  const {
    playerState,
    currentSlide,
    totalSlides,
    audioProgress,
    errorMsg,
    startPlayback,
    togglePlayPause,
    goToSlide,
    goNext,
    goPrev,
  } = useVideoPlayback(narration.sectionId, narration.slides);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === ' ') {
        e.preventDefault();
        if (playerState === 'idle') startPlayback();
        else togglePlayPause();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev, playerState, startPlayback, togglePlayPause]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl shadow-black/30 border border-gray-200 dark:border-gray-700/50">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
              {narration.sectionId}
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[250px] sm:max-w-none">
              {narration.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ProgressDots total={totalSlides} current={currentSlide} onNavigate={goToSlide} />
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide area */}
        <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
          {narration.slides.map((slide, i) => (
            <SlideView
              key={i}
              slide={slide}
              slideIndex={i}
              totalSlides={totalSlides}
              isActive={i === currentSlide}
            />
          ))}
        </div>

        {/* Audio progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200"
            style={{ width: `${audioProgress * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700/50">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={playerState === 'idle' ? startPlayback : togglePlayPause}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              playerState === 'loading'
                ? 'bg-gray-200 dark:bg-gray-700 cursor-wait'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:scale-105'
            }`}
            disabled={playerState === 'loading'}
            title={
              playerState === 'idle'
                ? 'Play narration (Space)'
                : playerState === 'playing'
                  ? 'Pause (Space)'
                  : playerState === 'paused' || playerState === 'ended'
                    ? 'Play (Space)'
                    : 'Loading...'
            }
          >
            {playerState === 'loading' ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : playerState === 'playing' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={goNext}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Error state */}
        {playerState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Failed to generate narration</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">{errorMsg}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startPlayback}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
