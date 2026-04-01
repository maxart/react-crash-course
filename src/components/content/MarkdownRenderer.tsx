import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { memo, useState, useCallback, useRef, useEffect } from 'react';

// ─── Constants ──────────────────────────────────────────────────

const LANG_NAMES: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'React JSX',
  ts: 'TypeScript',
  tsx: 'React TSX',
  vue: 'Vue',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  bash: 'Shell',
  sh: 'Shell',
  text: 'Text',
};

/** Shared style object — extracted to avoid creating a new object per render. */
const HIGHLIGHTER_STYLE = {
  margin: 0,
  borderRadius: 0,
  padding: '1.25rem',
  fontSize: '0.85rem',
  lineHeight: '1.6',
  background: '#1e1e2e',
} as const;

const CODE_TAG_PROPS = {
  style: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
} as const;

// ─── CodeBlock ──────────────────────────────────────────────────

const CodeBlock = memo(function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup the timeout if the component unmounts before it fires.
  // Addresses Section 8 / Gotcha #3 — always clean up side-effects.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    // Clear any pending timer before starting a new one
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const displayLang = LANG_NAMES[language] || language || 'Code';

  return (
    <div className="code-block-wrapper group">
      <div className="code-header">
        <span className="lang-label">{displayLang}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
            copied
              ? 'text-green-400 bg-green-500/10'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 opacity-0 group-hover:opacity-100'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={HIGHLIGHTER_STYLE}
        codeTagProps={CODE_TAG_PROPS}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
});

// ─── MarkdownRenderer ───────────────────────────────────────────

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renders a markdown section with syntax-highlighted code blocks,
 * styled tables, and properly scoped links.
 *
 * Wrapped in React.memo — since the `content` string for a given section
 * never changes, this avoids re-parsing markdown on parent re-renders.
 */
const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Strip the section header (parent renders it) and trailing hr (parent renders section divider).
  const bodyContent = content.replace(/^## \d+\. .+\n+/, '').replace(/\n---\s*$/, '');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Strip the <pre> wrapper — CodeBlock provides its own container.
        pre({ children }) {
          return <>{children}</>;
        },

        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const text = String(children).replace(/\n$/, '');

          // Fenced code block (has language tag or multi-line content)
          if (match || text.includes('\n')) {
            return <CodeBlock language={match?.[1] || 'text'}>{text}</CodeBlock>;
          }

          // Inline code
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        // Internal anchors become plain text; external links open in new tab
        a({ href, children, ...props }) {
          if (href?.startsWith('#')) {
            return <span className="text-blue-600 dark:text-blue-400 font-medium">{children}</span>;
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },

        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
              {children}
            </blockquote>
          );
        },

        // Scrollable wrapper prevents tables from breaking layout on mobile
        table({ children }) {
          return (
            <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
              <table className="w-full text-sm">{children}</table>
            </div>
          );
        },

        hr() {
          return <div className="my-10 border-t border-gray-200 dark:border-gray-800" />;
        },
      }}
    >
      {bodyContent}
    </ReactMarkdown>
  );
});

// Default export required for React.lazy() in SectionBlock
export default MarkdownRenderer;
