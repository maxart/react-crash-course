export interface Section {
  id: string;
  number: number;
  title: string;
  content: string;
}

export interface ParsedContent {
  intro: string;
  sections: Section[];
}

/**
 * Parses the crash course markdown into structured sections.
 *
 * The markdown is expected to have sections starting with `## N. Title`.
 * Everything before the first section header is treated as the intro.
 *
 * To add, remove, or reorder sections — edit the markdown file.
 * The parser adapts automatically.
 */
export function parseContent(markdown: string): ParsedContent {
  const firstSectionIndex = markdown.search(/^## \d+\./m);
  const intro = firstSectionIndex > 0 ? markdown.slice(0, firstSectionIndex).trim() : '';
  const body = firstSectionIndex > 0 ? markdown.slice(firstSectionIndex) : markdown;

  const sectionRegex = /^## (\d+)\. (.+)$/gm;
  const matches: { number: number; title: string; start: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(body)) !== null) {
    matches.push({
      number: parseInt(match[1], 10),
      title: match[2].replace(/\[.*?\]\(.*?\)/g, '').trim(),
      start: match.index,
    });
  }

  const sections: Section[] = matches.map((m, i) => {
    const end = i + 1 < matches.length ? matches[i + 1].start : body.length;
    const content = body.slice(m.start, end).trim();
    const id = m.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return { id, number: m.number, title: m.title, content };
  });

  return { intro, sections };
}
