import { memo, lazy, Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import type { Section } from '../../lib/parseContent';

// Lazy-load MarkdownRenderer — it pulls in react-syntax-highlighter (~350kB gzipped).
// This keeps the initial bundle lean and loads the heavy dependency on demand.
const MarkdownRenderer = lazy(() => import('../content/MarkdownRenderer'));

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Confetti particle component ────────────────────────────────

const CONFETTI_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6'];
const CONFETTI_SHAPES = ['circle', 'square', 'triangle'] as const;

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: typeof CONFETTI_SHAPES[number];
  angle: number;
  velocity: number;
  spin: number;
  size: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 50,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    angle: (Math.random() * 360) * (Math.PI / 180),
    velocity: 2 + Math.random() * 4,
    spin: (Math.random() - 0.5) * 720,
    size: 4 + Math.random() * 4,
  }));
}

const ConfettiBurst = memo(function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;

  const particles = useMemo(() => createParticles(24), []);

  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map((p) => {
        const tx = Math.cos(p.angle) * p.velocity * 30;
        const ty = Math.sin(p.angle) * p.velocity * 20 - p.velocity * 15;

        const style: React.CSSProperties = {
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--spin': `${p.spin}deg`,
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.shape === 'triangle' ? 0 : p.size,
          height: p.shape === 'triangle' ? 0 : p.size,
          backgroundColor: p.shape === 'triangle' ? 'transparent' : p.color,
          borderRadius: p.shape === 'circle' ? '50%' : '0',
          borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
          borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
          borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
        } as React.CSSProperties;

        return <div key={p.id} className="confetti-particle" style={style} />;
      })}
    </div>
  );
});

// ─── Celebration messages ────────────────────────────────────────

const CELEBRATION_MESSAGES = [
  'Nailed it! 🎉',
  'You\'re on fire! \u{1F525}',
  'Big brain energy! 🧠',
  'One step closer! 🚀',
  'Crushed it! 💪',
  'Level up! ⚡',
  'Knowledge unlocked! 🔓',
  'React master loading… ⏳',
  'Vue who? 😎',
  'Unstoppable! 🏆',
];

function getRandomMessage(): string {
  return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
}

// ─── SectionBlock ────────────────────────────────────────────────

interface SectionBlockProps {
  section: Section;
  index: number;
  isComplete: boolean;
  isLast: boolean;
  hasVideo: boolean;
  onToggleComplete: (index: number) => void;
  onWatchVideo: (sectionNumber: number) => void;
}

export const SectionBlock = memo(function SectionBlock({
  section,
  index,
  isComplete,
  isLast,
  hasVideo,
  onToggleComplete,
  onWatchVideo,
}: SectionBlockProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState('');
  const prevCompleteRef = useRef(isComplete);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Detect when section goes from incomplete → complete (celebration trigger)
  useEffect(() => {
    if (isComplete && !prevCompleteRef.current) {
      setCelebrating(true);
      setCelebrationMsg(getRandomMessage());
      timerRef.current = setTimeout(() => setCelebrating(false), 1800);
    }
    prevCompleteRef.current = isComplete;
  }, [isComplete]);

  const handleBottomToggle = useCallback(() => {
    onToggleComplete(index);
  }, [onToggleComplete, index]);

  const checkboxClass = useMemo(
    () =>
      `flex-shrink-0 mt-2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        isComplete
          ? 'bg-green-500 border-green-500 text-white scale-100'
          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:scale-110'
      }`,
    [isComplete],
  );

  return (
    <section id={`section-${index}`} className="mb-16 lg:mb-24 scroll-mt-20 lg:scroll-mt-8">
      {/* Section header */}
      <div className="flex items-start gap-4 mb-8 group">
        <span className="flex-shrink-0 mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
          {section.number}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{section.title}</h2>
          {hasVideo && (
            <button
              onClick={() => onWatchVideo(section.number)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30 hover:shadow-sm transition-all duration-200 group/vid"
            >
              <svg className="w-3.5 h-3.5 group-hover/vid:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen
            </button>
          )}
        </div>
        <button
          onClick={() => onToggleComplete(index)}
          className={checkboxClass}
          title={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isComplete && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Section content — lazy-loaded */}
      <div className="prose-content">
        <Suspense fallback={<Spinner />}>
          <MarkdownRenderer content={section.content} />
        </Suspense>
      </div>

      {/* Bottom completion button */}
      <div className="relative mt-10 flex flex-col items-center">
        <ConfettiBurst active={celebrating} />

        <button
          onClick={handleBottomToggle}
          className={`
            group/btn relative flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold
            transition-all duration-300 ease-out
            ${isComplete
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-lg hover:shadow-green-500/10'
            }
            ${celebrating ? 'complete-bounce' : ''}
          `}
        >
          {/* Circle indicator */}
          <span
            className={`
              flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300
              ${isComplete
                ? 'bg-green-500 border-green-500 text-white scale-100'
                : 'border-gray-300 dark:border-gray-600 group-hover/btn:border-green-400 dark:group-hover/btn:border-green-500'
              }
            `}
          >
            {isComplete && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>

          {/* Label */}
          <span>
            {isComplete ? 'Completed!' : 'Mark section as complete'}
          </span>
        </button>

        {/* Celebration message */}
        {celebrating && (
          <span className="celebration-message mt-3 text-sm font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {celebrationMsg}
          </span>
        )}
      </div>

      {/* Section divider */}
      {!isLast && <div className="mt-16 lg:mt-20 border-t border-gray-100 dark:border-gray-800/50" />}
    </section>
  );
});
