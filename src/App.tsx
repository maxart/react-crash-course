import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import courseContent from './content/course.md?raw';
import { parseContent } from './lib/parseContent';
import { useProgress } from './features/progress';
import { SearchModal } from './features/search';
import { narrationScripts } from './features/video';
import type { SectionNarration } from './features/video';
import { Sidebar } from './components/Sidebar';
import { MobileHeader, HeroSection, SectionBlock } from './components/layout';
import { useDarkMode } from './hooks/useDarkMode';
import { useScrollSpy } from './hooks/useScrollSpy';

// Lazy-load VideoPlayer — it's only needed when user clicks "Watch video"
const VideoPlayer = lazy(() =>
  import('./features/video/VideoPlayer').then((m) => ({ default: m.VideoPlayer })),
);

// ─── Error fallback ────────────────────────────────────────────

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <div role="alert" className="p-8 text-center">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Pre-build a Set of section numbers that have video narration ──

const videoSectionIds = new Set(narrationScripts.map((s) => s.sectionId));

// ─── App ────────────────────────────────────────────────────────

function App() {
  // Parse content once at mount — useMemo with [] deps never recomputes.
  const { sections } = useMemo(() => parseContent(courseContent), []);

  // Custom hooks — each encapsulates a single concern.
  const { darkMode, toggleDark } = useDarkMode();
  const { completedSections, toggleComplete, progress } = useProgress(sections.length);
  const { activeSection, setActiveSection } = useScrollSpy(sections.length);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<SectionNarration | null>(null);

  // ── Stable callbacks (useCallback) — never recreated unless deps change ──

  const handleToggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);
  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);
  const handleCloseSearch = useCallback(() => setSearchOpen(false), []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      if (prev) {
        // Expanding → show full sidebar
        setSidebarOpen(true);
      } else {
        // Collapsing → hide full sidebar so the rail can render
        setSidebarOpen(false);
      }
      return !prev;
    });
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      setActiveSection(index);
      const el = document.getElementById(`section-${index}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth < 1024) setSidebarOpen(false);
    },
    [setActiveSection],
  );

  const handleSearchNavigate = useCallback(
    (index: number) => {
      setSearchOpen(false);
      scrollToSection(index);
    },
    [scrollToSection],
  );

  const handleWatchVideo = useCallback((sectionNumber: number) => {
    const script = narrationScripts.find((s) => s.sectionId === sectionNumber);
    if (script) setActiveVideo(script);
  }, []);

  const handleCloseVideo = useCallback(() => setActiveVideo(null), []);

  // ── Keyboard shortcuts ──

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Derived values ──

  const activeTitle = sections[activeSection]?.title ?? 'React Crash Course';
  const completedCount = completedSections.size;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Mobile header — extracted component */}
      <MobileHeader
        title={activeTitle}
        progress={progress}
        darkMode={darkMode}
        onToggleSidebar={handleToggleSidebar}
        onToggleDark={toggleDark}
        onSearchOpen={handleOpenSearch}
      />

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          completedSections={completedSections}
          isOpen={sidebarOpen}
          collapsed={sidebarCollapsed}
          onNavigate={scrollToSection}
          onSearchOpen={handleOpenSearch}
          onToggleDark={toggleDark}
          onToggleCollapse={handleToggleCollapse}
          darkMode={darkMode}
          progress={progress}
          completedCount={completedCount}
        />
      </ErrorBoundary>

      {/* Main content */}
      <main className={`transition-all duration-300 ${
        sidebarOpen && !sidebarCollapsed ? 'lg:ml-80' : sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-0'
      } pt-14 lg:pt-0`}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
          {/* Hero — extracted component */}
          <HeroSection sectionCount={sections.length} progress={progress} />

          {/* Sections — each is an extracted, memoized component */}
          {sections.map((section, index) => (
            <ErrorBoundary key={section.id} FallbackComponent={ErrorFallback}>
              <SectionBlock
                section={section}
                index={index}
                isComplete={completedSections.has(index)}
                isLast={index === sections.length - 1}
                hasVideo={videoSectionIds.has(section.number)}
                onToggleComplete={toggleComplete}
                onWatchVideo={handleWatchVideo}
              />
            </ErrorBoundary>
          ))}

          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-800 pt-10 pb-16 mt-10">
            <div className="text-center">
              <p className="text-sm text-gray-400 dark:text-gray-600">
                The React Bible — Built for Vue developers, by developers who&apos;ve made the switch.
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-700 mt-2">
                Last updated March 2026 — React 19 / Next.js 15 era
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* Search modal — feature module */}
      <SearchModal
        isOpen={searchOpen}
        onClose={handleCloseSearch}
        sections={sections}
        onNavigate={handleSearchNavigate}
      />

      {/* Video player modal — lazy-loaded */}
      {activeVideo && (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleCloseVideo}>
          <Suspense fallback={null}>
            <VideoPlayer narration={activeVideo} onClose={handleCloseVideo} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;
