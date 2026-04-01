import { useState, useEffect } from 'react';

export function useScrollSpy(sectionCount: number) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.replace('section-', ''), 10);
            if (!isNaN(index)) setActiveSection(index);
          }
        }
      },
      { rootMargin: '-10% 0px -75% 0px' },
    );

    // Delay slightly so section DOM nodes have mounted.
    const timer = setTimeout(() => {
      for (let i = 0; i < sectionCount; i++) {
        const el = document.getElementById(`section-${i}`);
        if (el) observer.observe(el);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sectionCount]);

  return { activeSection, setActiveSection } as const;
}
