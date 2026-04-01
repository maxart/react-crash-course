export function ProgressDots({
  total,
  current,
  onNavigate,
}: {
  total: number;
  current: number;
  onNavigate: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 h-2.5 bg-blue-500'
              : i < current
                ? 'w-2.5 h-2.5 bg-blue-300 dark:bg-blue-700'
                : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
