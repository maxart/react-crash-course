/** Slide definition for the animated slideshow */
export interface Slide {
  heading: string;
  bullets: string[];
  code?: string;
  codeLang?: string;
}

/** Narration + slides for a single section */
export interface SectionNarration {
  sectionId: number;
  title: string;
  narration: string;
  slides: Slide[];
}

const scripts: SectionNarration[] = [
  {
    sectionId: 1,
    title: "Mental Model Shift: Vue → React",
    narration: `Let's start with the single most important concept. In Vue, you declare reactive state, and Vue tracks dependencies automatically. When data changes, Vue knows exactly which parts of the DOM to update. React works fundamentally differently. React does not track dependencies. Instead, when state changes, React re-runs your entire component function from top to bottom. It diffs the result against the previous result, and patches the real DOM. This means every variable inside a component is recreated on every render. There's no deep reactivity — you must produce a new reference. You don't watch values — you declare effects with explicit dependencies. The re-render is the core primitive. In Vue, a re-render is expensive. In React, the re-render IS the mechanism. Think of your component as a pure function: props and state in, UI out. Each render is a snapshot.`,
    slides: [
      {
        heading: "Vue: Declarative-Reactive",
        bullets: [
          "Reactive state with ref() and reactive()",
          "Vue tracks dependencies automatically",
          "Mutations detected → surgical DOM updates",
        ],
      },
      {
        heading: "React: Declarative-Functional",
        bullets: [
          "React does NOT track dependencies",
          "State change → re-run entire component function",
          "Diff virtual DOM → patch real DOM",
        ],
      },
      {
        heading: "Key Implications",
        bullets: [
          "Every variable is recreated on every render",
          "No deep reactivity — must return new references",
          "No auto-tracking — you list dependencies explicitly",
          "The re-render IS the mechanism, not a cost",
        ],
      },
      {
        heading: "The Mental Model",
        bullets: [
          "Component = pure function",
          "(props, state) → UI",
          "Each render is a snapshot in time",
        ],
        code: `// Vue: "I mutate → Vue detects → DOM updates"\n// React: "I tell React → it re-runs → it diffs & patches"`,
      },
    ],
  },
  {
    sectionId: 2,
    title: "React Glossary",
    narration: `Here's the React vocabulary you need. JSX is like Vue's template block, but it lives inside JavaScript. A Component is just a function that returns JSX — that's your Vue single-file component equivalent. Props are immutable inputs, same as Vue. State is mutable data managed by hooks like useState — think ref() and reactive(). A Hook is a function starting with 'use' that hooks into React features — these are your composables. Context is React's provide/inject. Portals are like Teleport. Suspense works similarly to Vue's Suspense. And a Controlled Component is a form input driven by React state — since React has no v-model.`,
    slides: [
      {
        heading: "Core Terms",
        bullets: [
          "JSX → Vue's <template> (but inside JS)",
          "Component → function that returns JSX",
          "Props → immutable inputs (same as Vue)",
          "State → mutable data via hooks (like ref())",
        ],
      },
      {
        heading: "Patterns & Features",
        bullets: [
          "Hook → composable (use* functions)",
          "Context → provide/inject",
          "Portal → Teleport",
          "Suspense → same concept as Vue 3",
        ],
      },
      {
        heading: "React-Specific Concepts",
        bullets: [
          "Ref (useRef) → persists across renders, no re-render",
          "Controlled Component → form input driven by state",
          "Error Boundary → catches render errors (class component)",
          "Strict Mode → dev-only double-render to catch bugs",
        ],
      },
    ],
  },
  {
    sectionId: 3,
    title: "JSX: It's Not a Template",
    narration: `The biggest syntax shock: there's no template block. Your markup lives directly inside your JavaScript function, written in JSX. Attribute names are camelCase — class becomes className, onclick becomes onClick. Expressions use single curly braces instead of double mustache. Style is always an object. There are no v-directives. No v-if — use ternary or logical AND. No v-for — use array dot map. No v-model — you wire up value and onChange manually. But here's the power: JSX can be assigned to variables, returned from functions, and stored in arrays. It's just JavaScript expressions.`,
    slides: [
      {
        heading: "No <template> Block",
        bullets: [
          "Markup lives inside your JS function",
          "class → className",
          "onclick → onClick (camelCase everything)",
        ],
        code: `function Greeting({ name }) {\n  return <h1 className="title">Hello, {name}!</h1>;\n}`,
        codeLang: "jsx",
      },
      {
        heading: "No Directives — Just JS",
        bullets: [
          "v-if → && or ternary",
          "v-for → .map()",
          "v-model → value + onChange",
          "v-show → style={{ display }}",
        ],
        code: `{isVisible && <Modal />}\n{items.map(item => <Item key={item.id} />)}\n<input value={text} onChange={e => setText(e.target.value)} />`,
        codeLang: "jsx",
      },
      {
        heading: "JSX = JavaScript Expressions",
        bullets: [
          "Assign to variables",
          "Return from functions",
          "Store in arrays",
          "No template DSL to learn",
        ],
      },
    ],
  },
  {
    sectionId: 4,
    title: "Components: Functions All the Way Down",
    narration: `In modern React, every component is a function. Class components still work but are considered legacy. There's no single-file component format — no template, script, style separation. Everything lives in a JSX or TSX file. The children prop is React's default slot — anything between opening and closing tags becomes children. For named slots, you pass JSX as props. For scoped slots, you use the render props pattern — a prop whose value is a function that returns JSX.`,
    slides: [
      {
        heading: "Everything Is a Function",
        bullets: [
          "Every component is a function returning JSX",
          "Class components = legacy",
          "No SFC format — no <template>/<script>/<style>",
        ],
        code: `function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}`,
        codeLang: "jsx",
      },
      {
        heading: "Slots → children & Props",
        bullets: [
          "Default slot → children prop",
          "Named slots → named JSX props",
          "Scoped slots → render props (function as prop)",
        ],
        code: `function Card({ title, children }) {\n  return (\n    <div className="card">\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  );\n}`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 5,
    title: "Props: One-Way Data",
    narration: `Props work almost identically to Vue, with a few twists. You pass dynamic values with curly braces, and you can spread props with the spread operator. For default values, use destructuring defaults in the function signature. For prop validation, React uses TypeScript interfaces instead of defineProps. And here's a big one: there is no emit. In Vue, children emit events to parents. In React, parents pass callback functions as props. The convention is to prefix them with 'on' — onSubmit, onChange, onDelete.`,
    slides: [
      {
        heading: "Passing Props",
        bullets: [
          "Static strings: name=\"Max\"",
          "Dynamic values: count={42}",
          "Spread: {...props}",
          "Defaults via destructuring",
        ],
      },
      {
        heading: "No emit — Callbacks Instead",
        bullets: [
          "Parent passes handler functions as props",
          "Convention: prefix with 'on' (onSubmit, onChange)",
          "Child calls the prop function directly",
        ],
        code: `// Parent\n<Child onDelete={(id) => remove(id)} />\n\n// Child\n<button onClick={() => onDelete(item.id)}>Delete</button>`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 6,
    title: "State & Reactivity",
    narration: `This is where React and Vue diverge most sharply. Vue uses ref() and reactive() with mutable, auto-tracked state. React uses useState with immutable updates and explicit setters. The critical rule: React does not detect mutations. You must always return a new reference. Don't push to an array — spread it. Don't mutate a nested property — spread each level. For deep updates, consider the Immer library. State updates are also asynchronous and batched. If you call setCount three times with count plus one, count only increments by one because all three reads the same snapshot. Use functional updates — setCount of c arrow c plus one — to fix this.`,
    slides: [
      {
        heading: "The Immutability Rule",
        bullets: [
          "React does NOT detect mutations",
          "Must always return a new reference",
          "Use spread operator for updates",
        ],
        code: `// ❌ items.push('d'); setItems(items);\n// ✅ setItems([...items, 'd']);\n// ✅ setItems(prev => [...prev, 'd']);`,
        codeLang: "jsx",
      },
      {
        heading: "Batched & Async Updates",
        bullets: [
          "State updates are batched in event handlers",
          "Reading state after set gives stale value",
          "Use functional updates for derived state",
        ],
        code: `// All read same snapshot — result: 1, not 3\nsetCount(count + 1);\nsetCount(count + 1);\nsetCount(count + 1);\n\n// Fix: functional updates — result: 3\nsetCount(c => c + 1);\nsetCount(c => c + 1);\nsetCount(c => c + 1);`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 7,
    title: "Hooks: The Complete Guide",
    narration: `Hooks are React's answer to Vue composables. Two rules are non-negotiable: only call hooks at the top level, never inside conditions or loops. And only call hooks from React components or custom hooks. useState is like ref(). useReducer is for complex state logic, like a mini Vuex local to a component. useRef creates a mutable value that persists across renders without triggering re-renders. useMemo is the computed() of React, but you must list dependencies manually. And useCallback memoizes function references — critical when passing callbacks to optimized child components. Don't overuse useMemo or useCallback. Only reach for them when passing to memoized children, when used as dependencies of other hooks, or for genuinely expensive computations.`,
    slides: [
      {
        heading: "Rules of Hooks",
        bullets: [
          "Only call at the top level — never in loops/conditions",
          "Only call from components or custom hooks",
          "React tracks hooks by call order",
        ],
      },
      {
        heading: "The Essential Hooks",
        bullets: [
          "useState → ref()",
          "useReducer → mini Vuex/Pinia",
          "useRef → persistent mutable value (no re-render)",
          "useMemo → computed() (manual deps)",
          "useCallback → stable function reference",
          "useContext → inject()",
        ],
      },
      {
        heading: "When to Memoize",
        bullets: [
          "✅ Passing to React.memo'd children",
          "✅ Used as dependency of another hook",
          "✅ Expensive computation",
          "❌ Simple math / string concat",
          "❌ Not passed to memoized children",
        ],
      },
    ],
  },
  {
    sectionId: 8,
    title: "Effects & Lifecycle",
    narration: `Vue has onMounted, onUnmounted, watch, and watchEffect. React collapses all of this into one hook: useEffect. It runs after the component renders. The return value is a cleanup function, similar to onUnmounted. The dependency array controls when it runs — empty array means run once on mount, specific values means run when those change. Unlike Vue's watchEffect, React's useEffect requires you to list dependencies manually. For synchronous DOM measurements before paint, use useLayoutEffect instead.`,
    slides: [
      {
        heading: "useEffect = Everything",
        bullets: [
          "onMounted + onUpdated + onUnmounted in one hook",
          "Runs AFTER render (after paint)",
          "Return a cleanup function",
        ],
        code: `useEffect(() => {\n  // setup (like onMounted)\n  return () => { /* cleanup (like onUnmounted) */ };\n}, [deps]); // controls WHEN it runs`,
        codeLang: "jsx",
      },
      {
        heading: "Dependency Array Patterns",
        bullets: [
          "No array → runs every render",
          "[] → runs once on mount",
          "[userId] → runs when userId changes (like watch)",
          "You must list deps manually — no auto-tracking",
        ],
      },
    ],
  },
  {
    sectionId: 9,
    title: "Event Handling & Forms",
    narration: `React events are camelCase and receive a SyntheticEvent wrapper. There are no event modifiers — no dot-prevent, dot-stop, dot-once. You call methods on the event object manually. The big adjustment is forms: React has no v-model. You wire up controlled inputs manually — value plus onChange. For complex forms, use React Hook Form or Formik to reduce boilerplate.`,
    slides: [
      {
        heading: "Events",
        bullets: [
          "camelCase: onClick, onChange, onSubmit",
          "SyntheticEvent wrapper (cross-browser)",
          "No modifiers — call e.preventDefault() manually",
        ],
      },
      {
        heading: "Forms: No v-model",
        bullets: [
          "Controlled inputs: value + onChange",
          "Wire up each input manually",
          "Use React Hook Form for complex forms",
        ],
        code: `<input\n  value={email}\n  onChange={(e) => setEmail(e.target.value)}\n/>`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 10,
    title: "Conditional Rendering & Lists",
    narration: `No directives. It's all JavaScript. Use logical AND or ternary for conditional rendering. Use dot-map for lists. Watch out for the AND short-circuit gotcha: when count is zero, the expression renders the string "0" on screen. Fix it by comparing count greater than zero. And always provide a stable, unique key prop for list items — never use array index when the list can change.`,
    slides: [
      {
        heading: "Conditionals = JS",
        bullets: [
          "v-if → {condition && <Component />}",
          "v-if/v-else → {cond ? <A /> : <B />}",
          "v-show → style={{ display: visible ? 'block' : 'none' }}",
        ],
      },
      {
        heading: "Lists & Keys",
        bullets: [
          "v-for → .map()",
          "Always provide stable, unique key",
          "Never use array index as key for dynamic lists",
          "⚠️ {0 && <X />} renders '0' on screen!",
        ],
        code: `{users.map(user => (\n  <li key={user.id}>{user.name}</li>\n))}`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 11,
    title: "Componentization: Thinking in React",
    narration: `React's approach is more granular than Vue. The community embraces small, single-purpose components and composition over configuration. Common patterns include compound components, like Headless UI, where related components work as a cohesive unit. Polymorphic components use an 'as' prop to change the rendered element. And headless components separate logic from UI entirely. When decomposing a large component, identify independent concerns, extract presentational components first, then stateful containers, and finally custom hooks for reusable data logic. But don't over-extract — keep things inline when they're small, used once, and tightly coupled to the parent.`,
    slides: [
      {
        heading: "React Component Philosophy",
        bullets: [
          "Small, single-purpose components",
          "Composition over configuration",
          "Container/Presentational split",
        ],
      },
      {
        heading: "Common Patterns",
        bullets: [
          "Compound components (Select.Trigger, Select.Options)",
          "Polymorphic: <Button as=\"a\" href=\"/\">",
          "Headless: logic hook + consumer decides UI",
        ],
      },
      {
        heading: "Decomposition Steps",
        bullets: [
          "1. Identify independent concerns",
          "2. Extract presentational components (no state)",
          "3. Extract stateful containers (own their data)",
          "4. Extract custom hooks (reusable logic)",
          "Don't over-extract — keep small stuff inline",
        ],
      },
    ],
  },
  {
    sectionId: 12,
    title: "Styling Approaches",
    narration: `React has no style-scoped. Styling is an ecosystem decision. CSS Modules give you locally-scoped class names. Tailwind CSS is the de facto standard in 2025. styled-components and Emotion are CSS-in-JS solutions with scoping but runtime cost. Use clsx or tailwind-merge for conditional class composition.`,
    slides: [
      {
        heading: "No <style scoped>",
        bullets: [
          "CSS Modules → local scope, no runtime cost",
          "Tailwind CSS → de facto standard (2025+)",
          "styled-components / Emotion → CSS-in-JS",
          "Vanilla Extract → zero-runtime CSS-in-TS",
        ],
      },
      {
        heading: "Tailwind + Utilities",
        bullets: [
          "clsx for conditional classes",
          "tailwind-merge to resolve conflicts",
          "cn() utility = twMerge(clsx(inputs))",
        ],
        code: `import { clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nconst cn = (...inputs) => twMerge(clsx(inputs));`,
        codeLang: "jsx",
      },
    ],
  },
  {
    sectionId: 13,
    title: "State Management at Scale",
    narration: `When you need more than useState, the React ecosystem offers several options. Zustand is the closest to Pinia — minimal, hook-based, no boilerplate. Jotai uses atomic state where each piece is an "atom." Redux Toolkit is the flux architecture with great devtools. And TanStack Query handles server state — caching, refetching, and synchronization. Most projects use two or three of these together: TanStack Query for server state, Zustand for client state, and useState for local component state.`,
    slides: [
      {
        heading: "State Library Landscape",
        bullets: [
          "Zustand → like Pinia (minimal, hook-based)",
          "Jotai → atomic state (each piece = atom)",
          "Redux Toolkit → flux architecture + devtools",
          "TanStack Query → server state (cache, refetch)",
        ],
      },
      {
        heading: "Typical Combination",
        bullets: [
          "TanStack Query → server/API state",
          "Zustand or Context → client/UI state",
          "useState/useReducer → local component state",
          "Most projects use 2-3 of these together",
        ],
      },
    ],
  },
  {
    sectionId: 14,
    title: "Routing",
    narration: `Unlike Vue Router which comes with the framework, React routing is a library choice. React Router v6 is the standard for SPAs. Routes are defined as JSX elements, nested routes render via the Outlet component (like router-view in Vue). You read params with useParams, navigate with useNavigate, and handle search params with useSearchParams. There are no navigation guards — you protect routes with wrapper components that check auth and redirect.`,
    slides: [
      {
        heading: "React Router v6",
        bullets: [
          "Routing is a library, not built-in",
          "Routes defined as JSX elements",
          "Nested routes via <Outlet> (like <router-view>)",
        ],
        code: `<Routes>\n  <Route path="/" element={<Layout />}>\n    <Route index element={<Home />} />\n    <Route path="users/:id" element={<UserDetail />} />\n  </Route>\n</Routes>`,
        codeLang: "jsx",
      },
      {
        heading: "Navigation & Guards",
        bullets: [
          "useParams() → route.params",
          "useNavigate() → router.push()",
          "useSearchParams() → route.query",
          "No beforeEach — use wrapper components",
        ],
      },
    ],
  },
  {
    sectionId: 15,
    title: "Project Structure & Architecture",
    narration: `A standard Vite-based React project has src with components, features, hooks, lib, stores, and api directories. The feature-based architecture is recommended for large projects — each feature is a self-contained module with its own components, hooks, API calls, and types. Features use barrel exports, which are index.ts files that re-export only the public API. This decouples consumers from internal structure and makes refactoring safe.`,
    slides: [
      {
        heading: "Feature-Based Architecture",
        bullets: [
          "features/ — self-contained modules",
          "components/ — shared UI primitives",
          "hooks/ — global custom hooks",
          "lib/ — utilities and helpers",
        ],
      },
      {
        heading: "Barrel Exports",
        bullets: [
          "index.ts re-exports public API only",
          "Decouples consumers from internal structure",
          "Never import from internal paths",
          "Use sparingly to avoid bundle bloat",
        ],
        code: `// features/auth/index.ts\nexport { LoginForm } from './components/LoginForm';\nexport { useAuth } from './hooks/useAuth';\nexport type { User } from './types';`,
        codeLang: "tsx",
      },
    ],
  },
  {
    sectionId: 16,
    title: "TypeScript in React",
    narration: `TypeScript is the de facto standard. Define props with interfaces, use React.ReactNode for anything renderable, React.MouseEvent for typed events. Create generic components for reusable patterns like lists. Extend HTML element types using React.ButtonHTMLAttributes to get full native prop typing on custom components. This gives you type safety and autocompletion for free.`,
    slides: [
      {
        heading: "Component Props with TS",
        bullets: [
          "Use interfaces for props (preferred over type)",
          "React.ReactNode for any renderable content",
          "React.MouseEvent, React.ChangeEvent for events",
        ],
        code: `interface ButtonProps {\n  variant?: 'primary' | 'secondary';\n  onClick?: () => void;\n  children: React.ReactNode;\n}`,
        codeLang: "tsx",
      },
      {
        heading: "Advanced Patterns",
        bullets: [
          "Generic components: List<T>",
          "Extend HTML: extends ButtonHTMLAttributes",
          "ComponentProps<typeof X> to extract types",
        ],
      },
    ],
  },
  {
    sectionId: 17,
    title: "Performance & Optimization",
    narration: `React is fast by default. Don't optimize prematurely — profile first with React DevTools. React.memo prevents re-renders when props haven't changed. Pair it with useCallback in the parent to avoid breaking memo with new function references. Use React.lazy and Suspense for code-splitting heavy components. For massive lists, use TanStack Virtual for virtualization. And use useTransition to mark non-urgent state updates, keeping the UI responsive during heavy computations.`,
    slides: [
      {
        heading: "Optimization Toolkit",
        bullets: [
          "React.memo → skip re-render if props unchanged",
          "useCallback → stable function references",
          "useMemo → cached computed values",
          "Profile first with React DevTools!",
        ],
      },
      {
        heading: "Code Splitting & More",
        bullets: [
          "React.lazy + Suspense → split heavy chunks",
          "TanStack Virtual → virtualize massive lists",
          "useTransition → non-urgent state updates",
          "State colocation → keep state close to usage",
        ],
      },
    ],
  },
  {
    sectionId: 18,
    title: "Testing",
    narration: `The stack is Vitest for running tests, React Testing Library for component testing, and MSW for API mocking. The philosophy: test behavior, not implementation. Use getByRole queries — they're accessible and resilient. Prefer userEvent over fireEvent for realistic interactions. Most components need context providers, so create a custom renderWithProviders utility that wraps components in all required providers. Use MSW to intercept real network requests for realistic API testing. And remember: getBy throws when not found, queryBy returns null — use queryBy to assert absence.`,
    slides: [
      {
        heading: "Testing Stack",
        bullets: [
          "Vitest — test runner",
          "React Testing Library — component testing",
          "MSW — API mocking at network level",
          "Philosophy: test behavior, not implementation",
        ],
      },
      {
        heading: "Key Patterns",
        bullets: [
          "getByRole > getByText > getByTestId",
          "userEvent > fireEvent (realistic)",
          "Custom renderWithProviders() wrapper",
          "getBy throws, queryBy returns null",
        ],
      },
      {
        heading: "MSW for API Mocking",
        bullets: [
          "Intercepts real fetch/XHR requests",
          "Define handlers per endpoint",
          "Override per-test for edge cases",
          "Much more realistic than module mocks",
        ],
      },
    ],
  },
  {
    sectionId: 19,
    title: "The Next.js Bridge",
    narration: `Next.js is to React what Nuxt is to Vue. The App Router uses file-based routing — folder structure IS the route map. All components are Server Components by default, running on the server with zero client JavaScript. Add 'use client' at the top of a file for interactivity. Server Actions handle mutations without API routes. The golden rule: keep Client Components at the leaves, push interactivity down, keep data fetching on the server. Layouts persist across navigation and don't re-render when switching between child pages.`,
    slides: [
      {
        heading: "Next.js ≈ Nuxt for React",
        bullets: [
          "File-based routing (folder structure = routes)",
          "All components are Server Components by default",
          "Zero client JS unless you opt in",
        ],
      },
      {
        heading: "Server vs Client Components",
        bullets: [
          "Server: async, direct DB access, no hooks",
          "Client: 'use client' directive, interactive",
          "Golden rule: Client Components at the leaves",
          "Push interactivity down, data fetching up",
        ],
        code: `'use client'; // opt into client component\nimport { useState } from 'react';`,
        codeLang: "tsx",
      },
      {
        heading: "Key Features",
        bullets: [
          "Layouts persist across navigation",
          "Server Actions for mutations (no API routes)",
          "loading.tsx / error.tsx for automatic boundaries",
          "Middleware for auth redirects",
        ],
      },
    ],
  },
  {
    sectionId: 20,
    title: "Gotchas & Foot-Guns",
    narration: `These are the things that will bite you from Vue. Number one: stale closures. Every render creates a new closure, so async operations may read old values. Fix with useRef. Number two: object references in dependencies create infinite loops. Use primitives instead. Number three: always clean up effects — remove event listeners, abort fetch requests. Number four: don't set state during render — that's an infinite loop. Use useMemo instead. Number five: Strict Mode double-renders in development to catch impure side effects. Don't panic when console logs fire twice.`,
    slides: [
      {
        heading: "Top 5 Gotchas",
        bullets: [
          "#1 Stale closures — async reads old values",
          "#2 Object refs in deps → infinite loops",
          "#3 Missing useEffect cleanup → memory leaks",
          "#4 setState during render → infinite loop",
          "#5 StrictMode double-render (dev only!)",
        ],
      },
      {
        heading: "More Traps",
        bullets: [
          "{0 && <X />} renders '0' on screen",
          "Key prop forces complete remount",
          "children can be string, array, or null",
          "No scoped CSS — classes can clash globally",
        ],
      },
    ],
  },
  {
    sectionId: 21,
    title: "Onboarding to a Large Codebase",
    narration: `Day one: understand the architecture. Check the entry point — main.tsx reveals all providers, and providers show you the entire infrastructure. Map the routing to understand URL structure. Identify the state strategy — search for create(), createSlice(), createContext(), or queryKey to find state management patterns. Day two: read custom hooks and identify the UI component library. Day three: pick one feature and trace it end-to-end — from URL to route to component to API call to state update. This teaches you more than any documentation.`,
    slides: [
      {
        heading: "Day 1: Architecture",
        bullets: [
          "Check main.tsx — providers reveal everything",
          "Map the routing (Routes, file-based, or config)",
          "Identify state strategy (Zustand? Redux? Query?)",
          "Check project structure pattern",
        ],
      },
      {
        heading: "Day 2: Abstractions",
        bullets: [
          "Read custom hooks — they encode team patterns",
          "Identify UI component library (shadcn? MUI? custom?)",
          "Check for code generation (GraphQL, OpenAPI, Prisma)",
        ],
      },
      {
        heading: "Day 3: Trace a Feature",
        bullets: [
          "URL → Route → Component → API → State → UI",
          "Follow one feature end-to-end",
          "This teaches more than any documentation",
          "Install React DevTools immediately",
        ],
      },
    ],
  },
  {
    sectionId: 22,
    title: "Maintaining Large Projects",
    narration: `Enforce consistent patterns with ESLint, especially eslint-plugin-react-hooks — that's non-negotiable. Co-locate related code: tests, styles, and types next to their components. Limit component size to 200 lines, hooks to 100. For refactoring, migrate incrementally: class to function components when you touch a file, Redux to Zustand one slice at a time, useEffect fetching to React Query for massive boilerplate reduction. Set up error boundaries at multiple levels for granular error recovery. Use path aliases and enforce conventions with tooling, not code reviews.`,
    slides: [
      {
        heading: "Code Health",
        bullets: [
          "eslint-plugin-react-hooks — non-negotiable",
          "Co-locate tests, styles, types with components",
          "Components < 200 lines, hooks < 100 lines",
          "Barrel exports only at feature boundaries",
        ],
      },
      {
        heading: "Refactoring Strategies",
        bullets: [
          "Class → Function: incrementally when you touch a file",
          "Redux → Zustand: one slice at a time",
          "useEffect → React Query: massive boilerplate reduction",
          "Error Boundaries at multiple levels",
        ],
      },
      {
        heading: "Scaling Tips",
        bullets: [
          "Path aliases (@/ → src/)",
          "Enforce rules with tooling, not reviews",
          "Monitor bundle size in CI",
          "Document conventions in CONTRIBUTING.md",
        ],
      },
    ],
  },
  {
    sectionId: 23,
    title: "Ecosystem & Libraries",
    narration: `Here's your essential toolkit. TanStack Query for data fetching. Zustand for client state. React Hook Form plus Zod for forms and validation. Tailwind for styling. shadcn/ui for components. Framer Motion for animation. TanStack Table for tables. Vitest plus React Testing Library for testing. And for full-stack TypeScript, look at tRPC. These libraries represent the modern React ecosystem consensus.`,
    slides: [
      {
        heading: "Must-Have Libraries",
        bullets: [
          "TanStack Query — data fetching gold standard",
          "Zustand — minimal client state",
          "React Hook Form + Zod — forms & validation",
          "Tailwind CSS + shadcn/ui — styling & components",
        ],
      },
      {
        heading: "More Essentials",
        bullets: [
          "Framer Motion — animation",
          "TanStack Table — headless tables",
          "Vitest + RTL + MSW — testing",
          "tRPC — full-stack type safety",
          "date-fns / dayjs — avoid Moment.js",
        ],
      },
    ],
  },
  {
    sectionId: 24,
    title: "Vue 3 → React Translation Table",
    narration: `Let's wrap up with the key translations. ref() becomes useState(). computed() becomes useMemo(). watch() becomes useEffect(). onMounted becomes useEffect with an empty array. defineProps becomes function parameters with TypeScript. defineEmits becomes callback props. v-model becomes value plus onChange. v-if becomes ternary. v-for becomes dot-map. Slots become children or render props. provide/inject becomes Context. Teleport becomes createPortal. Pinia becomes Zustand. And composables become custom hooks. You've got this — the concepts are the same, just expressed differently.`,
    slides: [
      {
        heading: "State & Reactivity",
        bullets: [
          "ref() → useState()",
          "computed() → useMemo()",
          "watch() → useEffect()",
          "reactive() → useState() with object spread",
        ],
      },
      {
        heading: "Template & Components",
        bullets: [
          "v-if → ternary / &&",
          "v-for → .map()",
          "v-model → value + onChange",
          "<slot> → children prop",
          "provide/inject → Context API",
        ],
      },
      {
        heading: "Ecosystem",
        bullets: [
          "Pinia → Zustand",
          "Vue Router → React Router",
          "Nuxt → Next.js",
          "Composables → Custom hooks",
          "You've got this! 🚀",
        ],
      },
    ],
  },
];

export default scripts;
