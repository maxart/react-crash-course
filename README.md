# The React Bible: A Crash Course for Vue 3 Developers

An interactive, feature-rich web application that teaches React 18+ to experienced Vue 3 developers. Rather than starting from zero, it maps concepts you already know from Vue to their React equivalents, then dives deep into what's genuinely different.

## What This Covers

24 comprehensive sections spanning the full Vue-to-React journey:

| # | Section | What You'll Learn |
|---|---------|-------------------|
| 1 | Mental Model Shift | Reactive vs. Functional paradigm - the key insight |
| 2 | Glossary | React terminology mapped to Vue equivalents |
| 3 | JSX | It's not a template - it's JavaScript |
| 4 | Components | Functions all the way down |
| 5 | Props | One-way data flow, callbacks instead of emit |
| 6 | State & Reactivity | useState, immutability, and why you can't mutate |
| 7 | Hooks | Complete guide: useState, useRef, useMemo, useCallback, useEffect |
| 8 | Effects & Lifecycle | Forget mounted/unmounted - think in synchronization |
| 9 | Event Handling & Forms | No v-model, controlled inputs |
| 10 | Conditional Rendering & Lists | No v-if/v-for, ternaries and map |
| 11 | Componentization | Thinking in React patterns |
| 12 | Styling | CSS Modules, Tailwind, CSS-in-JS |
| 13 | State Management | Zustand, Jotai, Redux, TanStack Query |
| 14 | Routing | React Router v6 |
| 15 | Project Structure | Feature-based architecture |
| 16 | TypeScript in React | Type-safe components, hooks, and generics |
| 17 | Performance | React.memo, useMemo, useCallback, code-splitting |
| 18 | Testing | Vitest, React Testing Library, MSW |
| 19 | The Next.js Bridge | Server Components, Actions, App Router |
| 20 | Gotchas & Foot-Guns | Stale closures, dependency arrays, and more |
| 21 | Onboarding to Large Codebases | Reading and understanding existing React projects |
| 22 | Maintaining Large Projects | Patterns, refactoring, error boundaries |
| 23 | Ecosystem Cheat Sheet | Essential libraries and when to use them |
| 24 | Vue to React Translation Table | Side-by-side feature mapping reference |

## Features

- **Progress Tracking** - Mark sections complete with localStorage persistence. Visual progress bar shows your completion percentage.
- **Full-Text Search** - Press `Cmd/Ctrl+K` to search across all sections. Keyboard navigation with arrow keys and contextual snippets.
- **Video Narration** - 24 pre-generated audio narrations with synchronized slide decks for each section.
- **Dark Mode** - Respects system preference with manual toggle. Persisted to localStorage.
- **Responsive Design** - Collapsible sidebar on desktop, mobile header with hamburger menu, touch-friendly throughout.
- **Syntax Highlighting** - Code blocks with Prism-based highlighting and one-click copy.

## Tech Stack

- **React 18** with TypeScript
- **Vite 6** for dev server and builds
- **Tailwind CSS 3** for styling
- **react-markdown** + **remark-gfm** for content rendering
- **react-syntax-highlighter** for code blocks
- **ElevenLabs** for audio narration generation (one-time, pre-built)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd react-crash-course-site
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview   # preview the production build locally
```

The build output is in `dist/` and can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, S3, etc.).

## Project Structure

```
src/
  App.tsx                        # Root component - orchestrates all features
  main.tsx                       # React entry point
  index.css                      # Global styles + Tailwind directives
  content/
    course.md                    # Full course content (markdown)
  components/
    Sidebar.tsx                  # Navigation with progress indicators
    content/
      MarkdownRenderer.tsx       # Markdown-to-React with syntax highlighting
    layout/
      HeroSection.tsx            # Landing section with stats
      MobileHeader.tsx           # Mobile navigation
      SectionBlock.tsx           # Individual course section container
  features/
    progress/
      useProgress.ts             # Hook: localStorage-persisted progress
    search/
      SearchModal.tsx            # Search UI with keyboard navigation
      useSearch.ts               # Hook: fuzzy search across sections
    video/
      VideoPlayer.tsx            # Modal player with slide renderer
      narrationScripts.ts        # Script + slide definitions for 24 sections
  lib/
    parseContent.ts              # Markdown parser (section extraction)
public/
  audio/
    section-1.mp3 ... section-24.mp3   # Pre-generated narrations
```

## Architecture

The application follows a **feature-based architecture** with custom hooks encapsulating each concern:

- **`useProgress`** - Completion state with localStorage sync
- **`useSearch`** - Case-insensitive search with memoized results
- **`useDarkMode`** - Theme with system preference detection
- **`useScrollSpy`** - IntersectionObserver-based active section tracking

Heavy components (`MarkdownRenderer`, `VideoPlayer`) are lazy-loaded via `React.lazy` + `Suspense` to keep the initial bundle small.

No global state management library is needed - all state is local or persisted to localStorage.

## Course Content

The course source material lives in `react-crash-course.md` at the project root. The site parses a copy of this content at `src/content/course.md` at runtime using a regex-based section extractor.

Content is written in GitHub Flavored Markdown with code blocks in JavaScript, TypeScript, Vue, JSX, TSX, HTML, CSS, JSON, and Bash.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
