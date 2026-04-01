import { useMemo } from 'react';
import type { Section } from '../../lib/parseContent';

interface SearchResult {
  section: Section;
  index: number;
  snippet: string;
}

/**
 * Searches across section titles and content.
 * Returns matching sections with a context snippet around the first hit.
 */
export function useSearch(sections: Section[], query: string): SearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const q = trimmed.toLowerCase();

    return sections
      .map((section, index) => {
        const titleMatch = section.title.toLowerCase().includes(q);
        const contentLower = section.content.toLowerCase();
        const contentIndex = contentLower.indexOf(q);
        let snippet = '';

        if (contentIndex >= 0) {
          const start = Math.max(0, contentIndex - 50);
          const end = Math.min(section.content.length, contentIndex + trimmed.length + 100);
          const raw = section.content.slice(start, end);
          snippet =
            (start > 0 ? '...' : '') +
            raw.replace(/[#`*_\[\]|>]/g, '').replace(/\n+/g, ' ').trim() +
            (end < section.content.length ? '...' : '');
        }

        return { section, index, snippet, matches: titleMatch || contentIndex >= 0 };
      })
      .filter((r) => r.matches);
  }, [sections, query]);
}
