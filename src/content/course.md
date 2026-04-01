# The React Bible: A Crash Course for Vue 3 Developers

> **Audience:** Mid/Senior Frontend Engineers transitioning from Vue 3 to React (18+)
> **Goal:** Get you productive in React fast by mapping concepts you already know, then go deep on what's genuinely different.

---

## Table of Contents

1. [Mental Model Shift: Vue → React](#1-mental-model-shift-vue--react)
2. [Glossary: React Lingo You Need to Know](#2-glossary-react-lingo-you-need-to-know)
3. [JSX: It's Not a Template](#3-jsx-its-not-a-template)
4. [Components: Functions All the Way Down](#4-components-functions-all-the-way-down)
5. [Props: One-Way Data, No v-bind Required](#5-props-one-way-data-no-v-bind-required)
6. [State & Reactivity: The Fundamental Difference](#6-state--reactivity-the-fundamental-difference)
7. [Hooks: The Complete Guide](#7-hooks-the-complete-guide)
8. [Effects & Lifecycle: Forget mounted/unmounted](#8-effects--lifecycle-forget-mountedunmounted)
9. [Event Handling & Forms](#9-event-handling--forms)
10. [Conditional Rendering & Lists](#10-conditional-rendering--lists)
11. [Componentization: Thinking in React](#11-componentization-thinking-in-react)
12. [Styling Approaches](#12-styling-approaches)
13. [State Management at Scale](#13-state-management-at-scale)
14. [Routing](#14-routing)
15. [Project Structure & Architecture](#15-project-structure--architecture)
16. [TypeScript in React](#16-typescript-in-react)
17. [Performance & Optimization](#17-performance--optimization)
18. [Testing](#18-testing)
19. [The Next.js Bridge](#19-the-nextjs-bridge)
20. [Gotchas & Foot-Guns](#20-gotchas--foot-guns)
21. [Onboarding to a Large React Codebase](#21-onboarding-to-a-large-react-codebase)
22. [Maintaining Large React Projects](#22-maintaining-large-react-projects)
23. [Ecosystem & Libraries Cheat Sheet](#23-ecosystem--libraries-cheat-sheet)
24. [Quick Reference: Vue 3 → React Translation Table](#24-quick-reference-vue-3--react-translation-table)

---

## 1. Mental Model Shift: Vue → React

This is the single most important section. If you internalize this, everything else clicks.

### Vue is Declarative-Reactive. React is Declarative-Functional.

In Vue 3, you declare reactive state with `ref()` or `reactive()`, and the framework *tracks dependencies automatically*. When reactive data changes, Vue knows exactly which parts of the DOM to update because it intercepts property access at the proxy level.

React works fundamentally differently. **React does not track dependencies.** Instead, when state changes, React **re-runs your entire component function** from top to bottom. It then diffs the result (a virtual DOM tree) against the previous result and patches the real DOM.

```
Vue 3 mental model:
  "I mutate state → Vue detects exactly what changed → DOM updates surgically"

React mental model:
  "I tell React state changed → React re-runs my function → React diffs and patches"
```

This has massive implications:

- **Every variable you declare inside a component is recreated on every render.** There's no persistent local state without hooks.
- **There's no "deep reactivity."** You can't mutate a nested property and expect React to notice. You must produce a new reference.
- **You don't "watch" values.** You declare effects that run when dependencies change, but *you* list the dependencies—React doesn't auto-track them.
- **There's no `computed` that caches automatically.** You use `useMemo` and explicitly declare its dependencies.

### The Re-render Is the Core Primitive

In Vue, a re-render is something to be minimized—an expensive side effect of reactivity. In React, **the re-render IS the mechanism.** Your component function is like a pure function: `(props, state) → UI`. Each render is a snapshot. Learning to think in snapshots, not in mutations, is the key shift.

---

## 2. Glossary: React Lingo You Need to Know

| React Term | What It Means | Vue 3 Equivalent |
|---|---|---|
| **JSX** | JavaScript syntax extension that looks like HTML. Compiled to `React.createElement()` calls. | `<template>` block (but JSX lives inside JS) |
| **Component** | A function that returns JSX (or `null`). | SFC (`.vue` file) |
| **Props** | Immutable inputs passed from parent to child. | Props (same concept) |
| **State** | Mutable data managed by hooks (`useState`). Triggers re-render when updated. | `ref()` / `reactive()` |
| **Hook** | A function starting with `use` that lets you "hook into" React features. | Composable (`use*` functions) |
| **Re-render** | React re-executes your component function to produce new JSX. | Reactivity-triggered patch |
| **Virtual DOM / Fiber** | React's internal representation. Fiber is the reconciliation engine (React 16+). | Virtual DOM (Vue also uses one) |
| **Reconciliation** | The diffing algorithm React uses to determine minimal DOM updates. | Vue's patching algorithm |
| **Ref** (React) | A mutable container (`useRef`) that persists across renders *without* triggering re-renders. | `ref()` for DOM; `shallowRef` without auto-trigger |
| **Key** | A special prop used in lists to help React identify which items changed. | `:key` in `v-for` |
| **Fragment** | `<>...</>` — lets you return multiple elements without a wrapper div. | `<template>` as root (Vue 3 supports fragments natively) |
| **Context** | A way to pass data through the component tree without prop-drilling. | `provide` / `inject` |
| **Portal** | Renders children into a DOM node outside the parent hierarchy. | `<Teleport>` |
| **Suspense** | Shows fallback content while async children are loading. | `<Suspense>` (similar in Vue 3) |
| **Error Boundary** | A class component that catches JS errors in its child tree. | `onErrorCaptured` / `errorCaptured` hook |
| **HOC** (Higher-Order Component) | A function that takes a component and returns a new component. | Mixins (deprecated) / composables |
| **Render Prop** | A prop whose value is a function that returns JSX. | Scoped slots |
| **Controlled Component** | A form input whose value is driven by React state. | `v-model` (React has no equivalent sugar) |
| **Uncontrolled Component** | A form input that manages its own state via the DOM. | Default HTML behavior |
| **Lifting State Up** | Moving state to the nearest common ancestor. | Emitting events to parent / shared state |
| **Strict Mode** | Development-only wrapper that double-invokes functions to catch side-effects. | No direct equivalent |
| **RSC** (React Server Components) | Components that run on the server and send serialized UI to the client. | Nuxt server components |
| **SSR / SSG / ISR** | Server-Side Rendering / Static Site Generation / Incremental Static Regeneration. | Same concepts in Nuxt |

---

## 3. JSX: It's Not a Template

The biggest syntax shock: **there's no `<template>` block.** Your markup lives directly inside your JavaScript function, written in JSX.

### JSX vs Vue Template

```jsx
// React — JSX
function Greeting({ name }) {
  const greeting = `Hello, ${name}!`;
  return <h1 className="title">{greeting}</h1>;
}
```

```vue
<!-- Vue 3 — SFC Template -->
<script setup>
const props = defineProps({ name: String });
const greeting = computed(() => `Hello, ${props.name}!`);
</script>
<template>
  <h1 class="title">{{ greeting }}</h1>
</template>
```

### Key Differences

**Attribute names are camelCase:**
- `class` → `className`
- `for` → `htmlFor`
- `tabindex` → `tabIndex`
- `onclick` → `onClick`
- **All event handlers:** `on` + PascalCase event name

**Expressions use `{}` instead of `{{ }}`:**
```jsx
<p>{user.name}</p>           // Vue: {{ user.name }}
<p>{isActive ? 'Yes' : 'No'}</p>
```

**Style is an object, not a string:**
```jsx
<div style={{ color: 'red', fontSize: '14px' }} />
// Vue: <div :style="{ color: 'red', fontSize: '14px' }" />
// Note: identical object syntax, but React ALWAYS uses the object form.
```

**Boolean attributes:**
```jsx
<input disabled />           // Same as disabled={true}
<input disabled={false} />   // Removes the attribute
// Vue: <input :disabled="true" />
```

**Comments in JSX:**
```jsx
return (
  <div>
    {/* This is a JSX comment */}
    <p>Hello</p>
  </div>
);
```

**No v-directives.** Everything is JavaScript:
```jsx
// No v-if — use ternary or &&
{isVisible && <Modal />}
{isAdmin ? <AdminPanel /> : <UserPanel />}

// No v-for — use .map()
{items.map(item => <Item key={item.id} data={item} />)}

// No v-model — wire up value + onChange manually
<input value={text} onChange={e => setText(e.target.value)} />

// No v-show — use inline style or className
<div style={{ display: isVisible ? 'block' : 'none' }} />
```

**JSX can be assigned to variables, returned from functions, stored in arrays:**
```jsx
const header = <h1>Hello</h1>;
const content = isLoading ? <Spinner /> : <DataTable data={rows} />;
const listItems = items.map(i => <li key={i.id}>{i.name}</li>);

return (
  <div>
    {header}
    {content}
    <ul>{listItems}</ul>
  </div>
);
```

This is the power of JSX: it's just JavaScript expressions. No template DSL to learn.

---

## 4. Components: Functions All the Way Down

In modern React, **every component is a function.** Class components still work but are considered legacy.

### Basic Component

```jsx
// Greeting.jsx (or Greeting.tsx)
export default function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Usage
<Greeting name="Max" age={30} />
```

**Vue equivalent:**
```vue
<!-- Greeting.vue -->
<script setup>
defineProps({ name: String, age: Number });
</script>
<template>
  <div>
    <h1>Hello, {{ name }}</h1>
    <p>Age: {{ age }}</p>
  </div>
</template>
```

### No SFC File Format

React has **no single-file component format.** There's no `<template>`, `<script>`, `<style>` separation. Everything lives in a `.jsx` / `.tsx` file. You import styles separately.

```
Vue file:       Component.vue (template + script + style in one file)
React file:     Component.tsx (everything is JS/TS, styles imported)
```

### Children: React's Equivalent to Slots

The `children` prop is React's default slot:

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage — anything between opening/closing tags becomes `children`
<Card title="Profile">
  <p>This is the card body content.</p>
  <button>Click me</button>
</Card>
```

**Named slots → Named props (render props pattern):**

```jsx
// Vue named slots:
// <template #header>...</template>
// <template #footer>...</template>

// React equivalent — pass JSX as props:
function Layout({ header, footer, children }) {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
}

<Layout
  header={<h1>My App</h1>}
  footer={<p>© 2026</p>}
>
  <p>Main content here</p>
</Layout>
```

**Scoped slots → Render props:**

```jsx
// Vue scoped slot:
// <DataList v-slot="{ item }">{{ item.name }}</DataList>

// React render prop:
function DataList({ items, renderItem }) {
  return <ul>{items.map(item => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}

<DataList
  items={users}
  renderItem={(user) => <span>{user.name} ({user.email})</span>}
/>
```

---

## 5. Props: One-Way Data, No v-bind Required

Props work almost identically to Vue, with a few twists.

### Passing Props

```jsx
// Static string
<Greeting name="Max" />

// Dynamic values — always use {}
<Greeting name={userName} />
<Counter count={42} />
<Toggle isActive={true} />

// Spread props (like v-bind="$attrs")
const props = { name: "Max", age: 30 };
<Greeting {...props} />
```

### Default Props

```jsx
// Method 1: Destructuring defaults (preferred)
function Button({ variant = 'primary', size = 'md', children }) {
  return <button className={`btn-${variant} btn-${size}`}>{children}</button>;
}

// Method 2: defaultProps (legacy, avoid in new code)
Button.defaultProps = { variant: 'primary' };
```

### Prop Validation

Vue uses `defineProps` with type annotations. React uses TypeScript (or PropTypes, which are legacy):

```tsx
// React + TypeScript (the standard approach)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'md', disabled = false, onClick, children }: ButtonProps) {
  return (
    <button className={`btn-${variant} btn-${size}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

### There Is No `emit` — Callbacks Instead

In Vue, children emit events to parents. In React, **parents pass callback functions as props:**

```jsx
// Vue: emit('update:count', newCount)  or  emit('delete', id)

// React: parent passes the handler as a prop
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} onIncrement={() => setCount(c => c + 1)} />;
}

function Child({ count, onIncrement }) {
  return <button onClick={onIncrement}>Count: {count}</button>;
}
```

Convention: callback props are prefixed with `on` (e.g., `onSubmit`, `onChange`, `onDelete`).

---

## 6. State & Reactivity: The Fundamental Difference

This is where React and Vue diverge most sharply.

### Vue 3 Reactivity vs React State

```js
// Vue 3 — reactive, mutable, auto-tracked
const count = ref(0);
count.value++;  // Vue detects this, updates DOM

const user = reactive({ name: 'Max', age: 30 });
user.age = 31;  // Vue detects this too, nested reactivity
```

```jsx
// React — immutable updates, explicit setter, triggers full re-render
const [count, setCount] = useState(0);
setCount(count + 1);        // Schedule re-render with new value
setCount(prev => prev + 1); // Functional update (preferred for derived state)

const [user, setUser] = useState({ name: 'Max', age: 30 });
// WRONG: user.age = 31;  ← React will NOT detect this
// RIGHT: produce a new object
setUser(prev => ({ ...prev, age: 31 }));
```

### The Immutability Rule

**React does not detect mutations. You must always return a new reference.**

```jsx
// ❌ WRONG — mutating state
const [items, setItems] = useState(['a', 'b', 'c']);
items.push('d');       // Mutating the array in place
setItems(items);       // Same reference — React skips re-render!

// ✅ RIGHT — new array
setItems([...items, 'd']);
setItems(prev => [...prev, 'd']);

// ❌ WRONG — mutating nested object
const [form, setForm] = useState({ user: { name: 'Max', address: { city: 'NYC' } } });
form.user.address.city = 'LA';  // Mutation!

// ✅ RIGHT — immutable spread (tedious for deep nesting)
setForm(prev => ({
  ...prev,
  user: {
    ...prev.user,
    address: {
      ...prev.user.address,
      city: 'LA'
    }
  }
}));

// ✅ BETTER — use Immer (very popular in React ecosystem)
import { produce } from 'immer';
setForm(produce(draft => {
  draft.user.address.city = 'LA'; // Immer handles immutability under the hood
}));
```

### State Updates Are Asynchronous and Batched

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // count is STILL 0 here! All three read the same snapshot.
    // Result: count becomes 1, not 3.

    // Fix: use functional updates
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    // Now count becomes 3
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

React batches state updates within the same event handler and applies them together in a single re-render. This is different from Vue where `ref.value++` is synchronously reflected.

---

## 7. Hooks: The Complete Guide

Hooks are React's answer to Vue 3 composables. They're the mechanism for adding state, side effects, and reusable logic to function components.

### Rules of Hooks (Non-Negotiable)

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions.
2. **Only call hooks from React function components or custom hooks** — never from plain JS functions.

```jsx
// ❌ WRONG
function MyComponent({ isAdmin }) {
  if (isAdmin) {
    const [data, setData] = useState(null); // Conditional hook — BREAKS React
  }
}

// ✅ RIGHT
function MyComponent({ isAdmin }) {
  const [data, setData] = useState(null); // Always called
  // Use the condition INSIDE the component logic instead
}
```

Why? React identifies hooks by their **call order**. If the order changes between renders, React loses track of which state belongs to which hook.

### useState — The ref() of React

```jsx
const [value, setValue] = useState(initialValue);
```

```jsx
// Primitive state
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);

// Object state
const [form, setForm] = useState({ email: '', password: '' });

// Lazy initialization (like a factory function for expensive initial values)
const [data, setData] = useState(() => computeExpensiveInitialState());
```

### useReducer — For Complex State Logic

When state transitions are complex, `useReducer` is cleaner than `useState`. Think of it as a mini Vuex/Pinia store local to a component.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return { count: 0 };
    default:          throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### useRef — Persistent Mutable Value (No Re-render)

`useRef` creates a mutable object that persists across renders but **does not trigger re-renders** when changed.

Two primary uses:

```jsx
// 1. DOM access (like Vue's template refs)
function TextInput() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// 2. Mutable value that survives re-renders (like a class instance variable)
function Timer() {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return <button onClick={() => clearInterval(intervalRef.current)}>Stop</button>;
}
```

### useMemo — The computed() of React

Caches a computed value. **Unlike Vue's `computed`, you must list dependencies manually.**

```jsx
// Vue
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// React
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
```

#### When to Use useMemo (Decision Framework)

Coming from Vue, you might be tempted to `useMemo` everything since `computed()` is used freely in Vue. But React's `useMemo` has a cost (memory for caching + comparison overhead), so it's only worth it in specific situations:

**✅ USE useMemo when:**

```jsx
// 1. Expensive computation (filtering, sorting, transforming large datasets)
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// 2. Creating objects/arrays passed to memoized children
//    Without useMemo, this creates a new array reference every render,
//    defeating React.memo on <ExpensiveList>
const activeUsers = useMemo(
  () => users.filter(u => u.isActive),
  [users]
);
return <ExpensiveList items={activeUsers} />;  // React.memo'd

// 3. Value used as a dependency of another hook
const config = useMemo(() => ({ threshold: 10, mode }), [mode]);
useEffect(() => {
  initializeSDK(config);
}, [config]); // Without useMemo, this effect runs every render

// 4. Creating context values (prevents re-rendering all consumers)
const authValue = useMemo(() => ({ user, login, logout }), [user]);
return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
```

**❌ SKIP useMemo when:**

```jsx
// 1. Simple/cheap calculations — string concatenation, basic math
//    The memoization overhead costs MORE than just recalculating
const fullName = `${firstName} ${lastName}`;  // Just compute it
const total = price * quantity;                // Just compute it

// 2. Primitive values — React compares these by value anyway
const isAdmin = role === 'admin';  // No need to memoize a boolean

// 3. Values only used in JSX, not passed to memoized children
//    If nothing downstream is memoized, there's no benefit
const label = `${count} items`;  // Just compute it
return <span>{label}</span>;     // <span> isn't React.memo'd
```

**Rule of thumb:** Profile first. If the component re-renders in under 16ms (check React DevTools Profiler), you probably don't need `useMemo`. Add it when you measure a real slowdown, not preventatively.

### useCallback — Memoize a Function Reference

Returns a memoized version of the callback that only changes when its dependencies change. Important when passing callbacks to optimized child components.

```jsx
// Without useCallback: handleClick is a NEW function every render
// With useCallback: same reference if `id` hasn't changed
const handleClick = useCallback(() => {
  deleteItem(id);
}, [id]);
```

#### When to Use useCallback (Decision Framework)

This is the hook Vue engineers struggle with most. In Vue, methods don't get recreated on every render, so there's no equivalent problem. In React, every function declared inside a component is a **new reference on every render**.

**✅ USE useCallback when:**

```jsx
// 1. Passing a callback to a React.memo'd child component
//    Without useCallback, the new function reference breaks memo
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);
return <MemoizedItemList onDelete={handleDelete} />;

// 2. Callback is a dependency of useEffect or useMemo
const fetchData = useCallback(async () => {
  const data = await api.getUsers(filters);
  setUsers(data);
}, [filters]);

useEffect(() => {
  fetchData();  // Without useCallback, this effect runs every render
}, [fetchData]);

// 3. Callback is passed to a third-party library that compares references
//    (e.g., event handlers in map libraries, chart callbacks)
const onMarkerClick = useCallback((id: string) => {
  setSelected(id);
}, []);
```

**❌ SKIP useCallback when:**

```jsx
// 1. Passing to native HTML elements — they don't benefit from stable refs
<button onClick={() => setCount(c => c + 1)}>+</button>  // Fine!
<input onChange={(e) => setName(e.target.value)} />        // Fine!

// 2. The child component isn't memoized — a stable ref changes nothing
<UnmemoizedChild onAction={() => doSomething()} />  // No benefit

// 3. The callback has many dependencies that change frequently
//    If deps change every render, useCallback is pure overhead
const handleSubmit = useCallback(() => {
  submit(a, b, c, d, e);  // If all 5 change often, skip useCallback
}, [a, b, c, d, e]);
```

**The useCallback + React.memo dance:** These two hooks work as a pair. `useCallback` alone does nothing useful — it only helps when the receiving component is wrapped in `React.memo`. Think of it as: `React.memo` says "only re-render if props change," and `useCallback` ensures the function prop doesn't change unnecessarily.

```jsx
// The full pattern:
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Stable reference — won't change unless nothing in deps changes
  const handleReset = useCallback(() => setCount(0), []);

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      {/* Without useCallback + memo, ExpensiveChild re-renders on every keystroke */}
      <ExpensiveChild count={count} onReset={handleReset} />
    </div>
  );
}

const ExpensiveChild = memo(function ExpensiveChild({ count, onReset }) {
  // Expensive rendering logic...
  return <div>{count} <button onClick={onReset}>Reset</button></div>;
});
```

### useContext — provide/inject of React

```jsx
// 1. Create context
const ThemeContext = createContext('light');

// 2. Provide (wrap a subtree)
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume (anywhere in the subtree)
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className={theme}
      onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    >
      Toggle ({theme})
    </button>
  );
}
```

**Gotcha:** When the context value changes, **every consumer re-renders**, regardless of whether they use the specific property that changed. This is why you should either split contexts or memoize the value:

```jsx
// Split contexts for independent values
const ThemeContext = createContext('light');
const AuthContext = createContext(null);

// Or memoize compound values
function App() {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}><Page /></ThemeContext.Provider>;
}
```

---

## 8. Effects & Lifecycle: Forget mounted/unmounted

In Vue 3, you have `onMounted`, `onUnmounted`, `onUpdated`, `watch`, `watchEffect`. React collapses all of this into one hook: `useEffect`.

### useEffect — The Swiss Army Knife

```jsx
useEffect(() => {
  // This runs AFTER the component renders (paint to screen).
  // Similar to onMounted + onUpdated combined.

  return () => {
    // This runs on cleanup — before the effect re-runs or on unmount.
    // Similar to onUnmounted.
  };
}, [dependencies]); // Dependency array controls WHEN the effect runs.
```

### Dependency Array Patterns

```jsx
// Runs EVERY render (no dependency array — rarely what you want)
useEffect(() => { ... });

// Runs ONCE after initial render (empty array = onMounted)
useEffect(() => {
  fetchData();
  return () => cleanup(); // onUnmounted
}, []);

// Runs when specific values change (like watch())
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

### Vue watch() → React useEffect

```js
// Vue 3
watch(userId, (newId, oldId) => {
  fetchUser(newId);
});
```

```jsx
// React
useEffect(() => {
  fetchUser(userId);
}, [userId]);
// Note: you don't get the "old value" by default. Use a ref if you need it.
```

### Vue watchEffect → React useEffect (sort of)

Vue's `watchEffect` auto-tracks dependencies. React's `useEffect` requires you to list them. This is an intentional design choice — React wants you to be explicit about what triggers an effect.

### useLayoutEffect — Before Paint

`useLayoutEffect` fires synchronously after DOM mutations but **before the browser paints**. Use it for DOM measurements (reading element dimensions, scrolling). It's the closest thing to `onMounted` with synchronous DOM access.

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setContainerHeight(height);
}, []);
```

### Common Patterns

```jsx
// Data fetching
useEffect(() => {
  let cancelled = false;

  async function load() {
    const data = await fetchUsers();
    if (!cancelled) setUsers(data);
  }
  load();

  return () => { cancelled = true; }; // Prevent state update on unmounted component
}, []);

// Event listeners
useEffect(() => {
  const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY });
  window.addEventListener('mousemove', handler);
  return () => window.removeEventListener('mousemove', handler);
}, []);

// Subscribing to external stores
useEffect(() => {
  const unsub = store.subscribe((state) => setLocalState(state));
  return unsub;
}, []);
```

---

## 9. Event Handling & Forms

### Event Handling

```jsx
// React events are camelCase and receive SyntheticEvent (a cross-browser wrapper)
<button onClick={handleClick}>Click</button>
<button onClick={(e) => handleClick(e, itemId)}>Click</button>

// Prevent default / stop propagation
function handleSubmit(e) {
  e.preventDefault();    // Same API
  e.stopPropagation();   // Same API
}
```

**No event modifiers.** Vue's `.prevent`, `.stop`, `.once` don't exist in React. You call methods on the event object manually.

### Forms: There Is No v-model

This is a big adjustment. React has no two-way binding sugar. You wire up controlled inputs manually:

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

For complex forms, reach for a library like **React Hook Form** or **Formik** — they reduce boilerplate significantly and handle validation, dirty checking, and submission.

```jsx
// React Hook Form (the most popular choice)
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => login(data.email, data.password);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password', { required: true, minLength: 8 })} />
      {errors.password && <span>Password must be 8+ characters</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 10. Conditional Rendering & Lists

### Conditional Rendering

No directives. It's all JavaScript.

```jsx
// v-if → && or ternary
{isLoggedIn && <Dashboard />}
{isAdmin ? <AdminPanel /> : <UserPanel />}

// v-if / v-else-if / v-else → early return or IIFE
function StatusBadge({ status }) {
  if (status === 'active') return <span className="green">Active</span>;
  if (status === 'pending') return <span className="yellow">Pending</span>;
  return <span className="red">Inactive</span>;
}

// v-show → style display toggle (component stays mounted)
<div style={{ display: isVisible ? 'block' : 'none' }}>
  Hidden but still in DOM
</div>
```

**Gotcha with `&&`:** `{count && <p>Count: {count}</p>}` will render `0` on screen when count is 0, because `0` is falsy but is a valid React child. Fix: `{count > 0 && <p>Count: {count}</p>}`.

### Lists

```jsx
// v-for → .map()
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}
```

**The `key` prop is critical.** React uses it to match elements across renders. Always use a stable, unique identifier (database ID, UUID). **Never use array index as key** when the list can be reordered, filtered, or items inserted — this causes subtle bugs with component state and animations.

---

## 11. Componentization: Thinking in React

### The React Component Philosophy

React's approach to componentization is more granular than what you typically see in Vue projects. The React community embraces:

1. **Small, single-purpose components** — a button, an input field, a badge.
2. **Composition over configuration** — instead of one `<DataTable>` with 50 props, you compose `<Table>`, `<TableHead>`, `<TableRow>`, `<TableCell>`.
3. **Container/Presentational split** (or smart/dumb components) — though hooks have blurred this line.

### Decomposition Strategy

```
Before (monolithic):
  <UserDashboard />  ← 500 lines, does everything

After (composed):
  <UserDashboard>
    <DashboardHeader user={user} />
    <StatsGrid>
      <StatCard title="Revenue" value={stats.revenue} />
      <StatCard title="Orders" value={stats.orders} />
    </StatsGrid>
    <RecentActivity activities={activities} />
    <UserDashboard.Sidebar>        ← Compound component pattern
      <QuickActions />
      <Notifications />
    </UserDashboard.Sidebar>
  </UserDashboard>
```

### Common Component Patterns

**Compound Components** (like Headless UI / Radix):
```jsx
// Used together as a cohesive unit
<Select>
  <Select.Trigger>Choose a fruit</Select.Trigger>
  <Select.Options>
    <Select.Option value="apple">Apple</Select.Option>
    <Select.Option value="banana">Banana</Select.Option>
  </Select.Options>
</Select>
```

**Polymorphic Components** (the `as` prop):
```jsx
function Button({ as: Component = 'button', ...props }) {
  return <Component {...props} />;
}

<Button>Regular button</Button>
<Button as="a" href="/about">Link styled as button</Button>
<Button as={Link} to="/about">Router Link styled as button</Button>
```

**Headless Components** (logic without UI):
```jsx
function useToggle(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  return { isOpen, toggle, close, open };
}

// Consumer decides the UI
function Accordion({ title, children }) {
  const { isOpen, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>{title} {isOpen ? '▲' : '▼'}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### Real-World Decomposition Walkthrough

This is the exercise that makes componentization click. Let's take a monolithic component and break it down step by step, the way you would in a real codebase.

**Before — a 200+ line monolith:**

```jsx
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchUser().then(setUser); }, []);
  useEffect(() => { fetchActivities(filter).then(setActivities); }, [filter]);
  useEffect(() => { fetchStats().then(setStats); }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <header>
        <img src={user.avatar} />
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Revenue</span><span>${stats?.revenue}</span>
        </div>
        <div className="stat-card">
          <span>Orders</span><span>{stats?.orders}</span>
        </div>
        <div className="stat-card">
          <span>Customers</span><span>{stats?.customers}</span>
        </div>
      </div>

      <div>
        <h2>Recent Activity</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="orders">Orders</option>
          <option value="reviews">Reviews</option>
        </select>
        <ul>
          {activities.map(a => (
            <li key={a.id}>
              <span>{a.type}</span>
              <span>{a.description}</span>
              <span>{a.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {isEditing && <div className="modal">...edit form...</div>}
    </div>
  );
}
```

**Step 1 — Identify independent concerns.** Ask: "What parts can change independently?" Here we have: user profile header, stats grid, activity feed with filter, edit modal. Each has its own data and behavior.

**Step 2 — Extract presentational components (no state, just props):**

```jsx
// Pure display — reusable anywhere stats are shown
function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function UserHeader({ user, onEdit }) {
  return (
    <header>
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </header>
  );
}

function ActivityItem({ activity }) {
  return (
    <li>
      <span>{activity.type}</span>
      <span>{activity.description}</span>
      <span>{activity.date}</span>
    </li>
  );
}
```

**Step 3 — Extract stateful containers (own their data fetching):**

```jsx
function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities(filter).then(setActivities);
  }, [filter]);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2>Recent Activity</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="orders">Orders</option>
          <option value="reviews">Reviews</option>
        </select>
      </div>
      <ul>
        {activities.map(a => <ActivityItem key={a.id} activity={a} />)}
      </ul>
    </section>
  );
}
```

**Step 4 — Extract custom hooks for reusable data logic:**

```jsx
function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(u => { setUser(u); setIsLoading(false); });
  }, []);

  return { user, isLoading };
}

function useStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchStats().then(setStats); }, []);
  return stats;
}
```

**After — the composed dashboard:**

```jsx
function UserDashboard() {
  const { user, isLoading } = useUser();
  const stats = useStats();
  const { isOpen: isEditing, open: startEdit, close: stopEdit } = useToggle();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <UserHeader user={user} onEdit={startEdit} />
      <div className="stats-grid">
        <StatCard label="Revenue" value={`$${stats?.revenue}`} />
        <StatCard label="Orders" value={stats?.orders} />
        <StatCard label="Customers" value={stats?.customers} />
      </div>
      <ActivityFeed />
      {isEditing && <EditProfileModal user={user} onClose={stopEdit} />}
    </div>
  );
}
```

**What changed:** Each piece is independently testable, reusable, and understandable. `StatCard` can be used on any page. `ActivityFeed` manages its own filter state without polluting the parent. `useUser` can be called from any component that needs the current user. The dashboard itself is now a composition of pieces, not a monolith.

### When to Extract vs When to Keep Inline

Not everything needs to be a separate component. Here's a practical framework:

**Extract when:** the piece has its own state, is reused elsewhere, exceeds ~50 lines, or has distinct responsibility (data fetching, form handling, complex rendering logic).

**Keep inline when:** it's a small chunk of JSX (under ~20 lines), only used once, and tightly coupled to the parent's state. Over-extracting creates "component spaghetti" where you jump between 15 files to understand one screen.

---

## 12. Styling Approaches

React has no `<style scoped>`. Styling is an ecosystem decision.

| Approach | Description | Scoped? | Runtime Cost? |
|---|---|---|---|
| **CSS Modules** | Import `.module.css` files, get locally-scoped class names | Yes | No |
| **Tailwind CSS** | Utility-first CSS, extremely popular in React | N/A | No |
| **styled-components** | CSS-in-JS, tagged template literals | Yes | Yes |
| **Emotion** | CSS-in-JS, similar to styled-components | Yes | Yes |
| **Vanilla Extract** | Zero-runtime CSS-in-TS | Yes | No |
| **Plain CSS/SCSS** | Global stylesheets | No | No |

### CSS Modules (Most Common Without a Framework)

```jsx
// Button.module.css
// .primary { background: blue; color: white; }
// .large { padding: 12px 24px; }

import styles from './Button.module.css';

function Button({ variant, size }) {
  return (
    <button className={`${styles.primary} ${size === 'lg' ? styles.large : ''}`}>
      Click me
    </button>
  );
}
```

### Tailwind (The De Facto Standard in 2025+)

```jsx
function Button({ variant = 'primary', children }) {
  const base = 'px-4 py-2 rounded font-semibold transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return <button className={`${base} ${variants[variant]}`}>{children}</button>;
}
```

Use **clsx** or **tailwind-merge** for conditional class composition:
```jsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs)); // Common utility

<button className={cn('px-4 py-2', isActive && 'bg-blue-600', isDisabled && 'opacity-50')} />
```

---

## 13. State Management at Scale

### When You Need More Than useState

**Local state (useState/useReducer):** Use for state that belongs to a single component or small subtree.

**Context + useReducer:** Use for medium-complexity shared state (theme, auth, locale). Be aware of re-render implications.

**Dedicated state libraries:** Use when you have complex, app-wide state that many components read/write.

### The React State Library Landscape

| Library | Vue Equivalent | Philosophy |
|---|---|---|
| **Zustand** | Pinia (closest match) | Minimal, hook-based, no boilerplate |
| **Jotai** | No direct equiv | Atomic state (each piece of state is an "atom") |
| **Redux Toolkit** | Vuex | Flux architecture, actions/reducers, great devtools |
| **TanStack Query** | Vue Query / Pinia Colada | Server state management (caching, refetching, etc.) |
| **Recoil** | — | Facebook's atomic state (declining in popularity) |

### Zustand — The Pinia of React

```jsx
import { create } from 'zustand';

// Define the store (like defineStore in Pinia)
const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,

  fetchUser: async (id) => {
    set({ isLoading: true });
    const user = await api.getUser(id);
    set({ user, isLoading: false });
  },

  logout: () => set({ user: null }),
}));

// Use in any component — no Provider needed!
function Profile() {
  const user = useUserStore(state => state.user);       // Subscribes to just `user`
  const logout = useUserStore(state => state.logout);

  if (!user) return <p>Not logged in</p>;
  return <div>{user.name} <button onClick={logout}>Logout</button></div>;
}
```

### TanStack Query (React Query) — For Server State

This is the React ecosystem's answer to data fetching. If you've used Vue Query, it's nearly identical.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 min
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => fetch(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => deleteMutation.mutate(u.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 14. Routing

### React Router (v6+)

React's routing is a library choice, not built-in (unlike Nuxt for Vue).

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Layout.jsx — nested routes render via <Outlet>
import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
      <main>
        <Outlet /> {/* Vue equivalent: <router-view /> */}
      </main>
    </div>
  );
}
```

### Route Params & Navigation

```jsx
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();                         // Vue: useRoute().params.id
  const navigate = useNavigate();                      // Vue: useRouter().push()
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get('tab') || 'profile';   // Vue: useRoute().query.tab

  return (
    <div>
      <h1>User {id}</h1>
      <button onClick={() => navigate('/users')}>Back to list</button>
      <button onClick={() => navigate(-1)}>Go back</button>
      <button onClick={() => setSearchParams({ tab: 'settings' })}>Settings tab</button>
    </div>
  );
}
```

### Route Guards

No `beforeEach` or navigation guards. Protect routes with wrapper components:

```jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Usage
<Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

## 15. Project Structure & Architecture

### Standard React Project (Vite-based)

```
my-app/
├── public/                    # Static assets (like Vue's public/)
│   └── favicon.ico
├── src/
│   ├── assets/                # Images, fonts, etc.
│   ├── components/            # Shared/reusable components
│   │   ├── ui/                # Design system primitives (Button, Input, Card)
│   │   ├── layout/            # Layout components (Header, Footer, Sidebar)
│   │   └── common/            # Business-agnostic shared components
│   ├── features/              # Feature-based modules ★
│   │   ├── auth/
│   │   │   ├── components/    # Feature-specific components
│   │   │   ├── hooks/         # Feature-specific hooks
│   │   │   ├── api.ts         # API calls for this feature
│   │   │   ├── types.ts       # TypeScript types
│   │   │   └── index.ts       # Public API (barrel export)
│   │   ├── dashboard/
│   │   └── users/
│   ├── hooks/                 # Global custom hooks
│   ├── lib/                   # Utilities, helpers, configs
│   ├── stores/                # Global state (Zustand stores)
│   ├── api/                   # API client, interceptors
│   ├── types/                 # Global TypeScript types
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── router.tsx             # Route definitions
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

### Feature-Based Architecture (Recommended for Large Projects)

The `features/` pattern (sometimes called "vertical slices") is the most scalable approach. Each feature is a self-contained module:

```
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthGuard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSession.ts
│   ├── api.ts
│   ├── store.ts
│   ├── types.ts
│   └── index.ts          # Only export what other features need
```

**Rule:** Features can import from `components/`, `hooks/`, `lib/`, and `stores/`. Features should **never** import directly from other features — use the barrel export (`index.ts`) if cross-feature access is needed.

### Barrel Exports

A **barrel export** is an `index.ts` file that re-exports selected items from a module's internal files. It acts as the module's **public API** — consumers import from the barrel instead of reaching into internal files directly.

**Why they exist:** Without barrels, other parts of the codebase import deeply nested paths like `import { LoginForm } from '../features/auth/components/LoginForm'`. This couples consumers to the module's internal folder structure. If you later move `LoginForm.tsx` to a different subfolder, every import breaks. A barrel decouples the public interface from the internal layout.

```tsx
// features/auth/index.ts — the barrel file
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export type { User, Session } from './types';
// Internal components like AuthFormField are NOT exported — they're implementation details
```

```tsx
// Consumer code — imports from the barrel, never from internal paths
import { LoginForm, useAuth } from '@/features/auth';        // ✅ Clean
import { LoginForm } from '@/features/auth/components/LoginForm'; // ❌ Reaching into internals
```

**Vue equivalent:** Vue projects sometimes use the same pattern with `index.ts` files, but it's less common because Vue's single-file components naturally bundle template + script + style together. In React's file-per-concern world, barrels become more important for organizing the many smaller files.

**When to use barrels:**
- At **feature boundaries** (`features/auth/index.ts`, `features/dashboard/index.ts`) — always a good idea. They define what each feature exposes to the rest of the app.
- At **shared component library boundaries** (`components/ui/index.ts`) — convenient for grouping design system primitives.

**When NOT to use barrels:**
- Inside a feature for every subfolder (`features/auth/hooks/index.ts` re-exporting a single hook) — unnecessary indirection.
- At the top level re-exporting everything (`src/index.ts` that re-exports all features) — this defeats tree-shaking and can cause circular dependency issues.

**The bundle bloat gotcha:** Barrel files can hurt bundle size if bundlers can't tree-shake them properly. When you `import { LoginForm } from '@/features/auth'`, a naive bundler may pull in everything the barrel exports — including `useAuth` and the `User` type module. Modern bundlers (Vite/Rollup, webpack 5) handle this well in most cases, but if you notice unexpectedly large bundles, barrels are a common culprit. The fix: use direct imports for the problematic module, or split the barrel into smaller ones.

---

## 16. TypeScript in React

TypeScript is the de facto standard in React projects (even more so than in Vue). Here are the patterns you'll see everywhere.

### Component Props

```tsx
// Interface for props (preferred over type for components)
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;  // Optional
  variant?: 'compact' | 'full';
  children?: React.ReactNode;        // For slot-like content
}

function UserCard({ user, onEdit, onDelete, variant = 'full', children }: UserCardProps) {
  // ...
}
```

### Common React Types

```tsx
React.ReactNode        // Anything renderable: string, number, JSX, null, array
React.ReactElement     // Specifically a JSX element
React.FC<Props>        // Function Component type (controversial — many teams avoid it)
React.ComponentProps<typeof Button>  // Extract props from an existing component
React.MouseEvent<HTMLButtonElement>  // Typed event
React.ChangeEvent<HTMLInputElement>  // Input change event
React.FormEvent<HTMLFormElement>     // Form submit event
React.RefObject<HTMLDivElement>      // Typed ref
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return <ul>{items.map(item => <li key={keyExtractor(item)}>{renderItem(item)}</li>)}</ul>;
}

// Usage — TypeScript infers T from the items array
<List
  items={users}
  keyExtractor={u => u.id}
  renderItem={u => <span>{u.name}</span>}
/>
```

### Extending HTML Elements

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

function Button({ variant = 'primary', isLoading, children, ...rest }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} disabled={isLoading} {...rest}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
// Now <Button type="submit" onClick={...} variant="primary"> works with full HTML typing
```

---

## 17. Performance & Optimization

### When to Optimize

React is fast by default for most UIs. Don't optimize prematurely. Profile first with **React DevTools Profiler**.

### React.memo — Prevent Unnecessary Re-renders

`React.memo` is the equivalent of marking a component as "only re-render when props change" (shallow comparison).

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  // This only re-renders when `items` or `onSelect` change (by reference)
  return items.map(item => <Item key={item.id} data={item} onSelect={onSelect} />);
});
```

**Pair with `useCallback`/`useMemo` in the parent** to avoid breaking memo with new references:

```jsx
function Parent() {
  const [items, setItems] = useState([]);
  const handleSelect = useCallback((id) => { /* ... */ }, []);

  return <ExpensiveList items={items} onSelect={handleSelect} />;
}
```

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart data={chartData} />
    </Suspense>
  );
}
```

### Virtualization for Large Lists

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Key Performance Rules

1. **State colocation** — keep state as close to where it's used as possible. Don't lift everything to the top.
2. **Avoid inline object/array literals in JSX** — `style={{ color: 'red' }}` creates a new object every render. Extract to a constant or use `useMemo`.
3. **Split contexts** — don't put everything in one context. Changes to any value re-render all consumers.
4. **Debounce expensive operations** — use `useDeferredValue` or `useTransition` for non-urgent updates.

```jsx
// useTransition — mark a state update as non-urgent
function Search() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value);                         // Urgent: update input immediately
    startTransition(() => setFilteredItems(filter(e.target.value))); // Non-urgent: can be interrupted
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <Results items={filteredItems} />}
    </>
  );
}
```

---

## 18. Testing

### Testing Stack

| Tool | Purpose | Vue Equivalent |
|---|---|---|
| **Vitest** | Test runner | Vitest (same!) |
| **React Testing Library** | Component testing | Vue Testing Library |
| **MSW** (Mock Service Worker) | API mocking | MSW (same!) |
| **Playwright / Cypress** | E2E testing | Same |
| **jest-dom** | Custom matchers (`toBeInTheDocument`, `toHaveClass`, etc.) | Same |

### The Testing Philosophy Shift from Vue

In Vue Testing Library, you're already close to React's testing philosophy — test behavior, not internals. But React testing has a few differences worth calling out:

1. **No `wrapper.vm` equivalent.** You can't access component internals. This is by design — React Testing Library actively discourages testing implementation details.
2. **No `wrapper.setProps()`.** To test with different props, re-render the component or use a wrapper that passes new props.
3. **Async behavior is more prominent.** React's batched state updates mean you'll use `waitFor`, `findBy*`, and `act()` more often than in Vue tests.
4. **Providers matter.** Most React components depend on context providers (router, query client, theme). You'll need to wrap components in these for tests.

### React Testing Library Basics

The philosophy: test **behavior**, not implementation. Don't test state or internal hooks — test what the user sees and does.

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

test('increments count when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter initialCount={0} />);

  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /increment/i }));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

test('fetches and displays users', async () => {
  render(<UserList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Max')).toBeInTheDocument();
  });
});
```

### Query Priority — Which Query to Use

React Testing Library provides multiple ways to find elements. Use them in this priority order (most to least recommended):

```tsx
// 1. getByRole — the best query. Finds by ARIA role. Accessible by default.
screen.getByRole('button', { name: /submit/i })
screen.getByRole('heading', { level: 2 })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('checkbox', { name: /agree to terms/i })

// 2. getByLabelText — for form elements with associated labels
screen.getByLabelText(/email address/i)

// 3. getByPlaceholderText — when no label exists
screen.getByPlaceholderText(/search.../i)

// 4. getByText — for non-interactive elements
screen.getByText(/no results found/i)

// 5. getByTestId — last resort. Requires adding data-testid to markup.
screen.getByTestId('user-avatar')
```

**Avoid** `container.querySelector` — it couples tests to DOM structure.

### `userEvent` vs `fireEvent`

Always prefer `userEvent` over `fireEvent`. It simulates real user interactions (focus, keydown, keyup, click) rather than just dispatching a single DOM event:

```tsx
const user = userEvent.setup();

// ✅ userEvent — simulates real typing (focus → keydown → input → keyup for each character)
await user.type(screen.getByRole('textbox'), 'hello');

// ❌ fireEvent — dispatches a single change event (unrealistic)
fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });

// ✅ userEvent — simulates real click (mousedown → mouseup → click)
await user.click(screen.getByRole('button'));

// userEvent handles edge cases: clearing input, selecting options, keyboard navigation
await user.clear(screen.getByRole('textbox'));
await user.selectOptions(screen.getByRole('combobox'), 'admin');
await user.keyboard('{Enter}');
```

### Testing Components That Need Providers

Most React components depend on context providers. Create a custom render function that wraps components in all required providers:

```tsx
// test-utils.tsx — your project's custom render
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,         // Don't retry failed queries in tests
        gcTime: Infinity,     // Don't garbage-collect during tests
      },
    },
  });
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Re-export everything from RTL, but override render
export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { screen, waitFor, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

Now use it in tests:

```tsx
import { renderWithProviders, screen, userEvent } from '../test-utils';
import { UserProfile } from './UserProfile';

test('displays user profile', async () => {
  renderWithProviders(<UserProfile userId="123" />);
  expect(await screen.findByText('Max')).toBeInTheDocument();
});
```

**Vue equivalent:** This is like creating a `mountWithPlugins()` helper that wraps components in `createApp()` with router, pinia, etc.

### Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => { result.current.increment(); });

  expect(result.current.count).toBe(1);
});
```

**Testing hooks that need providers:** Pass a wrapper option:

```tsx
test('useAuth returns current user', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider initialUser={mockUser}>{children}</AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.user).toEqual(mockUser);
});
```

### Mocking Modules with Vitest

```tsx
import { vi, describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';
import * as api from './api';

// Mock the entire module
vi.mock('./api');

describe('UserList', () => {
  test('renders users from API', async () => {
    // Type-safe mock with vi.mocked()
    vi.mocked(api.fetchUsers).mockResolvedValue([
      { id: '1', name: 'Max', email: 'max@test.com' },
      { id: '2', name: 'Alice', email: 'alice@test.com' },
    ]);

    render(<UserList />);

    expect(await screen.findByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('shows error state on API failure', async () => {
    vi.mocked(api.fetchUsers).mockRejectedValue(new Error('Network error'));

    render(<UserList />);

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

### MSW (Mock Service Worker) — Realistic API Mocking

MSW intercepts actual network requests at the service worker level. This means your components make real `fetch` calls and MSW intercepts them — much more realistic than mocking modules.

```tsx
// mocks/handlers.ts — define API mocks
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Max', email: 'max@test.com' },
      { id: '2', name: 'Alice', email: 'alice@test.com' },
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 });
  }),
];

// mocks/server.ts — set up for tests
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts — wire it up globally
import { server } from './mocks/server';

beforeAll(() => server.listen());          // Start intercepting
afterEach(() => server.resetHandlers());   // Reset to default handlers between tests
afterAll(() => server.close());            // Clean up
```

Override handlers per test when you need specific scenarios:

```tsx
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

test('shows empty state when no users exist', async () => {
  // Override just for this test
  server.use(
    http.get('/api/users', () => HttpResponse.json([]))
  );

  render(<UserList />);
  expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
});
```

### Testing Async Operations

React's asynchronous state updates require careful handling in tests:

```tsx
// Use findBy* queries for elements that appear asynchronously
// findBy* = getBy* + waitFor — waits up to 1 second by default
test('loads data asynchronously', async () => {
  render(<Dashboard />);

  // This waits for the element to appear
  const heading = await screen.findByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});

// Use waitFor for assertions that need to pass eventually
test('updates count after debounced search', async () => {
  const user = userEvent.setup();
  render(<SearchPage />);

  await user.type(screen.getByRole('searchbox'), 'react');

  await waitFor(() => {
    expect(screen.getByText(/3 results/i)).toBeInTheDocument();
  }, { timeout: 2000 }); // Increase timeout for debounced operations
});

// Use waitForElementToBeRemoved for disappearing elements
test('hides loading spinner after data loads', async () => {
  render(<UserList />);

  expect(screen.getByRole('progressbar')).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

  expect(screen.getByText('Max')).toBeInTheDocument();
});
```

### Common Testing Gotchas (React-Specific)

**1. The `act()` warning:** If you see "An update was not wrapped in act()", it means a state update happened outside of React's awareness. `userEvent` and `waitFor` handle this automatically. You usually only need manual `act()` for hooks testing.

**2. `getBy*` throws, `queryBy*` returns null:** Use `queryBy*` to assert something does NOT exist:

```tsx
// ✅ Assert absence
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// ❌ This throws before the assertion runs
expect(screen.getByText('Error')).not.toBeInTheDocument();
```

**3. Cleanup is automatic.** Unlike Vue Test Utils where you might need to manually destroy, React Testing Library unmounts after each test automatically (when using Vitest/Jest with its setup).

**4. Testing React Router navigation:**

```tsx
import { MemoryRouter } from 'react-router-dom';

test('navigates to user detail on click', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/users']}>
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByText('Max'));
  expect(await screen.findByText(/user detail/i)).toBeInTheDocument();
});
```

**5. Testing components that use `lazy()` + `Suspense`:** Wrap in Suspense in your test or use `findBy*` to wait for the lazy component to load.

### What to Test (and What Not To)

**Test:**
- User interactions (clicks, typing, form submission)
- Conditional rendering (loading → data → error states)
- Data displayed after fetching
- Accessibility (elements have proper roles, labels)

**Don't test:**
- Internal state values (`useState` return values)
- Whether a specific hook was called
- Implementation details (CSS classes for styling, internal component structure)
- Third-party library internals

---

## 19. The Next.js Bridge

Next.js is to React what Nuxt is to Vue. If you've used Nuxt, many concepts map directly. But Next.js (App Router, v13+) introduced paradigms that go beyond anything in Nuxt.

### Next.js App Router Project Structure

```
my-next-app/
├── app/                        # App Router (replaces pages/)
│   ├── layout.tsx              # Root layout (wraps all pages)
│   ├── page.tsx                # Home page (/)
│   ├── loading.tsx             # Loading UI (automatic Suspense boundary)
│   ├── error.tsx               # Error UI (automatic error boundary)
│   ├── not-found.tsx           # 404 page
│   ├── globals.css
│   ├── dashboard/
│   │   ├── layout.tsx          # Nested layout for /dashboard/*
│   │   ├── page.tsx            # /dashboard
│   │   └── settings/
│   │       └── page.tsx        # /dashboard/settings
│   ├── users/
│   │   ├── page.tsx            # /users
│   │   └── [id]/
│   │       └── page.tsx        # /users/:id (dynamic route)
│   └── api/                    # API routes
│       └── users/
│           └── route.ts        # API endpoint: /api/users
├── components/                  # Shared components
├── lib/                        # Utilities
├── public/                     # Static files
└── next.config.ts
```

### Key Concepts

**File-based routing:** Like Nuxt. `app/about/page.tsx` → `/about`.

**Layouts:** Persistent wrappers that don't re-render when navigating between child pages (like Nuxt layouts but more granular).

```tsx
// app/layout.tsx — Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

**Server Components (default):** In the App Router, **all components are Server Components by default.** They run on the server, can directly access databases, and send zero JavaScript to the client.

```tsx
// app/users/page.tsx — This is a Server Component!
// It runs on the server. No useState, no useEffect, no browser APIs.
export default async function UsersPage() {
  const users = await db.query('SELECT * FROM users'); // Direct DB access!

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

**Client Components:** Opt in with `'use client'` at the top of the file. Required when you need interactivity (state, effects, event handlers, browser APIs).

```tsx
'use client'; // ← This makes it a Client Component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

**The golden rule:** Keep Client Components at the leaves of your component tree. Push interactivity down, keep data fetching on the server.

### Server Actions

Server-side mutations without API routes:

```tsx
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  await db.insert('users', { name });
  revalidatePath('/users');
}

// app/users/new/page.tsx
import { createUser } from '../actions';

export default function NewUserPage() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Data Fetching in Next.js

```tsx
// Server Component — just use async/await
async function UsersPage() {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // ISR: revalidate every hour
  });
  const users = await res.json();
  return <UserList users={users} />;
}

// Client Component — use TanStack Query or SWR
'use client';
import useSWR from 'swr';

function UserSearch() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSWR(
    query ? `/api/users?q=${query}` : null,
    fetcher
  );
  // ...
}
```

### Middleware

```ts
// middleware.ts (in project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
```

### Vue/Nuxt → React/Next.js Quick Map

| Nuxt | Next.js |
|---|---|
| `pages/index.vue` | `app/page.tsx` |
| `pages/users/[id].vue` | `app/users/[id]/page.tsx` |
| `layouts/default.vue` | `app/layout.tsx` |
| `middleware/auth.ts` | `middleware.ts` |
| `server/api/users.ts` | `app/api/users/route.ts` |
| `useFetch()` / `useAsyncData()` | `fetch()` in Server Components / React Query in Client |
| `definePageMeta({ layout: 'admin' })` | Nested `layout.tsx` files |
| `<NuxtLink>` | `<Link>` from `next/link` |
| `<NuxtPage>` | `{children}` in layouts |

---

## 20. Gotchas & Foot-Guns

These are the things that will bite you coming from Vue. Ranked by how likely they are to waste your time.

### 1. Stale Closures (The #1 React Bug)

Every render creates a new closure. If an async operation captures a value from a previous render, it reads stale data.

```jsx
function Chat() {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    setTimeout(() => {
      console.log(message); // ⚠️ This logs the message from when the timeout was SET,
                            // not the current message. It's a snapshot.
    }, 3000);
  };

  // Fix: use a ref to always read the latest value
  const messageRef = useRef(message);
  messageRef.current = message;

  const sendMessageFixed = () => {
    setTimeout(() => {
      console.log(messageRef.current); // ✅ Always the latest
    }, 3000);
  };
}
```

### 2. Object/Array References in Dependencies

```jsx
// ❌ BUG: effect runs every render because {userId} is a new object each time
useEffect(() => {
  fetchData(filters);
}, [{ userId: 1 }]); // New object reference every render!

// ✅ Fix: use primitives in dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // Primitive comparison works correctly
```

### 3. Forgetting Cleanup in useEffect

```jsx
// ❌ Memory leak: event listener never removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Always clean up
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 4. Setting State During Render

```jsx
// ❌ INFINITE LOOP
function Bad({ items }) {
  const [sorted, setSorted] = useState([]);
  setSorted([...items].sort()); // Setting state during render = infinite loop!

  // ✅ Use useMemo instead
  const sorted = useMemo(() => [...items].sort(), [items]);
}
```

### 5. Strict Mode Double-Rendering

In development, React Strict Mode intentionally double-invokes:
- Component function bodies
- `useState` initializer functions
- `useReducer` reducers
- `useEffect` setup and cleanup

This catches side effects that aren't properly cleaned up. **Don't panic when you see console.logs fire twice in dev.**

### 6. Async State Updates After Unmount

```jsx
// ❌ Warning: "Can't perform a React state update on an unmounted component"
useEffect(() => {
  fetchData().then(data => setData(data)); // Component may have unmounted!
}, []);

// ✅ Use an abort controller or cancelled flag
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal }).then(setData).catch(() => {});
  return () => controller.abort();
}, []);
```

### 7. The && Short-Circuit Gotcha

```jsx
{count && <Badge count={count} />}
// When count = 0, renders "0" on screen instead of nothing!

// Fix:
{count > 0 && <Badge count={count} />}
// or
{count ? <Badge count={count} /> : null}
```

### 8. Key Prop on Dynamic Components

When you want React to **completely remount** a component (destroy and recreate), change its key:

```jsx
// This forces UserProfile to remount when userId changes, resetting all internal state
<UserProfile key={userId} userId={userId} />
```

### 9. Children Type Ambiguity

`children` can be a string, a number, a ReactElement, an array, null, or undefined. If you iterate over it, use `React.Children.toArray(children)`.

### 10. CSS className Conflicts

React doesn't scope styles. If two components both use `.button` in global CSS, they clash. Use CSS Modules, Tailwind, or CSS-in-JS.

---

## 21. Onboarding to a Large React Codebase

A systematic approach for your first week on a new React project.

### Day 1: Understand the Architecture

#### 1. Check the Entry Point

Open `main.tsx` (or `index.tsx`) — the very first file that runs. In React, the entry point reveals the app's entire infrastructure at a glance because everything is set up through **providers** — wrapper components that make services available to the entire component tree.

Here's what a real-world entry point looks like and what each provider does:

```tsx
// main.tsx — A typical production React entry point
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './features/auth';
import { ThemeProvider } from './features/theme';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
```

**What to look for and what each provider means:**

| Provider | What It Does | Why It Matters |
|---|---|---|
| `<StrictMode>` | Development-only. Double-invokes functions to catch impure renders. | Not in production builds. If you see double console logs, this is why. |
| `<BrowserRouter>` | Enables client-side routing via React Router. All `<Link>`, `useNavigate()`, and `<Route>` components need this ancestor. | Tells you the project uses React Router for navigation. |
| `<QueryClientProvider>` | Provides a TanStack Query cache instance to the tree. Components use `useQuery()` / `useMutation()` for data fetching. | Tells you the project uses React Query for server state. Look for `queryKey` patterns to understand the cache strategy. |
| `<AuthProvider>` | Custom context provider — typically stores the current user, session token, and auth methods (`login`, `logout`). | Find this file to understand how auth works. Usually wraps a `useContext(AuthContext)` hook. |
| `<ThemeProvider>` | Provides theme values (colors, dark mode toggle) via context. Could be from a library (Chakra, MUI) or custom. | Tells you how styling/theming is managed. |

**If a provider is missing, the feature doesn't exist.** No `<BrowserRouter>`? No client-side routing (might be a Next.js project that handles routing differently). No `<QueryClientProvider>`? Data fetching is handled another way (`useEffect` + `fetch`, SWR, or server components).

**Provider order matters.** Providers deeper in the tree can access providers above them. If `AuthProvider` needs to make API calls, it must be inside `QueryClientProvider`. If routing needs auth info, `AuthProvider` goes inside `BrowserRouter`. Read the nesting order to understand dependencies between systems.

#### 2. Map the Routing

Find where routes are defined — this gives you the full URL structure and tells you which components render on which pages. Routing can be configured in three common patterns:

**Pattern A — Centralized route config (most common in SPAs):**
```tsx
// router.tsx or App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />           {/* / */}
    <Route path="dashboard" element={<Dashboard />} />  {/* /dashboard */}
    <Route path="users" element={<Users />} />    {/* /users */}
    <Route path="users/:id" element={<UserDetail />} />  {/* /users/123 */}
    <Route path="settings/*" element={<Settings />} />   {/* /settings/* (nested) */}
  </Route>
  <Route path="login" element={<Login />} />      {/* /login (outside layout) */}
  <Route path="*" element={<NotFound />} />        {/* catch-all 404 */}
</Routes>
```

Look for: `<Routes>`, `<Route>`, `createBrowserRouter`, or a `router.tsx` / `routes.tsx` file.

**Pattern B — File-based routing (Next.js App Router):**
```
app/
├── page.tsx              → /
├── dashboard/page.tsx    → /dashboard
├── users/page.tsx        → /users
├── users/[id]/page.tsx   → /users/:id
└── settings/
    ├── page.tsx          → /settings
    └── profile/page.tsx  → /settings/profile
```

No explicit route config file — the folder structure IS the route map. Look at the `app/` directory tree.

**Pattern C — Config object (newer React Router v6.4+ with data loaders):**
```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'users', element: <Users />, loader: usersLoader },
      { path: 'users/:id', element: <UserDetail />, loader: userLoader },
    ],
  },
]);
```

If you see `loader` functions alongside routes, the project uses React Router's data loading API — fetching happens before the component renders, similar to Nuxt's `asyncData`.

**What `:id` means:** A dynamic segment. `users/:id` matches `users/123`, `users/abc`, etc. The component reads it with `useParams()`.

**What `*` means:** A wildcard/splat. `settings/*` matches any path starting with `/settings/` and renders the `<Settings>` component, which can define its own nested routes.

#### 3. Identify the State Strategy

React projects typically use a mix of state solutions. Your job is to identify which ones are in play and what each manages.

**Where to look:**

| Clue | State Solution | What to Search For |
|---|---|---|
| `create()` from zustand | **Zustand** — lightweight store, like Pinia | Files in `stores/`, `state/`, or `*Store.ts` |
| `configureStore()`, `createSlice()` | **Redux Toolkit** — flux-based, global store | `store.ts`, `slices/` directory, `useSelector`, `useDispatch` |
| `createContext()` + `useContext()` | **React Context** — built-in, for low-frequency updates | Often in `providers/` or `contexts/` directory |
| `useQuery()`, `useMutation()` | **TanStack Query** — server state cache | API layer files, `queryKey` arrays, `queryClient.invalidateQueries()` |
| `atom()`, `useAtom()` | **Jotai** — atomic state | `atoms/` directory or co-located atom definitions |
| `useSWR()` | **SWR** — Vercel's data fetching library | Similar to React Query but lighter API |

**Most projects use 2-3 of these together.** A typical combination:

- **TanStack Query** for server state (API data, caching, refetching)
- **Zustand** (or Context) for client state (UI state, user preferences, modals)
- **useState/useReducer** for local component state (form inputs, toggles)

The key question to answer: *when a developer needs to add new state, which tool do they reach for and where do they put it?*

**How to find stores quickly:** Search the codebase for `create(` (Zustand), `createSlice(` (Redux), `createContext(` (Context), or `queryKey` (React Query). This surfaces the state layer immediately.

#### 4. Check the Project Structure

The folder structure tells you the team's architectural philosophy and where to find (and add) code.

**Pattern A — Feature-based (recommended for large projects):**
```
src/
├── features/
│   ├── auth/          ← Everything auth-related lives here
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── index.ts   ← Public API (barrel export)
│   ├── dashboard/
│   └── users/
├── components/        ← Shared UI primitives (Button, Modal, etc.)
├── lib/               ← Pure utilities, no React
└── App.tsx
```

**What it means:** Code is organized by *what it does*, not *what it is*. All auth code (components, hooks, API calls, types) lives in `features/auth/`. To work on auth, you only need to look in one folder. This scales well — each feature is a self-contained module.

**Pattern B — Component-type-based (common in smaller projects):**
```
src/
├── components/        ← ALL components, flat or grouped
├── hooks/             ← ALL custom hooks
├── services/          ← ALL API calls
├── store/             ← ALL state management
├── types/             ← ALL TypeScript types
├── utils/             ← ALL helper functions
└── pages/             ← Route-level components
```

**What it means:** Code is organized by *what it is* (component, hook, service, etc.). To work on a feature, you jump between 4-5 folders. This is simple to understand but gets hard to navigate as the project grows — you end up with 50 files in `components/` and have to mentally group them.

**Pattern C — Flat (small apps, prototypes):**
```
src/
├── App.tsx
├── Dashboard.tsx
├── UserList.tsx
├── useAuth.ts
├── api.ts
└── types.ts
```

**What it means:** Everything is in `src/` with no nesting. Fast to navigate but doesn't scale. If you see this with more than 20 files, the project could use restructuring.

**What to check immediately:** Look at where the most recent PRs/commits added files. That shows the team's *actual* convention, which may differ from what the folder structure implies.

### Day 2: Read the Abstractions

#### 5. Read Custom Hooks

Custom hooks (files starting with `use`) are the most important code to read. They encode the team's patterns, business logic, and often reveal how data flows through the app. Look in `hooks/`, `lib/`, or co-located in feature directories.

Common categories you'll encounter:

- **Data hooks:** `useUsers()`, `useCurrentUser()` — wrap API calls, return data + loading state
- **Auth hooks:** `useAuth()`, `usePermissions()` — expose session/user, gate features
- **UI hooks:** `useModal()`, `useToast()`, `useMediaQuery()` — reusable UI behavior
- **Form hooks:** `useLoginForm()`, `useCheckout()` — encapsulate form state + validation + submission

#### 6. Read the UI Component Library

Identify which component library the project uses. This determines how you build UI:

| Library | How to Spot It | What It Means |
|---|---|---|
| **shadcn/ui** | `components/ui/` directory with files like `button.tsx`, `dialog.tsx` | Components are copied into the project (not a package). You own and customize the code directly. |
| **Material UI (MUI)** | `import { Button } from '@mui/material'` | Google's Material Design. Heavy, opinionated, has its own styling system (`sx` prop, `styled()`). |
| **Chakra UI** | `import { Box, Flex } from '@chakra-ui/react'` | Accessible, uses style props (`<Box p={4} bg="gray.100">`). |
| **Radix UI** | `import * as Dialog from '@radix-ui/react-dialog'` | Headless (unstyled) primitives. The project adds its own styles. |
| **Ant Design** | `import { Table, Form } from 'antd'` | Enterprise-focused, data-heavy components. Common in B2B apps. |
| **Homegrown** | `import { Button } from '@/components/ui'` (not from node_modules) | Custom design system. Read it carefully — it defines the project's visual language. |

#### 7. Check for Code Generation

Search for config files that indicate auto-generated code:

- `codegen.ts` or `codegen.yml` → **GraphQL Codegen** (generates typed hooks from `.graphql` files)
- `orval.config.ts` or `openapi-ts.config.ts` → **OpenAPI Codegen** (generates typed API clients from a Swagger/OpenAPI spec)
- `prisma/schema.prisma` → **Prisma** (generates a typed database client)
- `.graphqlrc.yml` → GraphQL tooling in general

If you see auto-generated files (usually in a `generated/` or `__generated__/` directory), **never edit them directly**. Edit the source (schema, spec) and re-run the generator.

### Day 3: Trace a Feature End-to-End

#### 8. Pick One Feature and Follow the Data

Choose a user-visible feature (e.g., "user creates a project") and trace the complete path through the codebase:

```
URL (/projects/new)
  → Route definition (which component renders?)
    → Page component (what does it render?)
      → Form component (how is input collected?)
        → Submit handler (what happens on submit?)
          → API call (what endpoint? what payload?)
            → Server response
          → State update (how is the cache/store updated?)
        → UI feedback (success toast? redirect? error display?)
```

This gives you a mental model of how the project's layers connect. Pay attention to: where types are defined, how errors are handled, and what happens after a successful mutation (does it invalidate a cache? redirect? show a toast?). This single exercise teaches you more about the codebase than reading documentation.

### Tools to Install Immediately

- **React DevTools** — browser extension that adds a "Components" and "Profiler" tab. Inspect any component's current props, state, and hooks. The Profiler shows what re-rendered and why — invaluable for performance debugging.
- **Redux DevTools** (if using Redux) — time-travel debugging. See every dispatched action, the state before and after, and replay sequences.
- **TanStack Query DevTools** (if using React Query) — renders an in-app panel showing every cached query, its status (fresh/stale/fetching), and lets you manually invalidate or refetch.

### Things to Ask the Team

- What's the convention for where new components go? (Feature folder? Shared components? Both?)
- Are there established patterns for loading/error/empty states? (Skeleton screens? Error boundaries? Dedicated components?)
- How is auth handled? (JWT in cookies? Auth0/Clerk? Session-based? Where's the middleware?)
- Is there a design system, component library, or Storybook instance?
- What's the deployment pipeline? (Vercel? Docker? CI/CD with GitHub Actions?)
- Are there any "gotchas" or legacy patterns to avoid when writing new code?

---

## 22. Maintaining Large React Projects

### Code Health Practices

**Enforce consistent patterns with ESLint:**
- `eslint-plugin-react-hooks` (enforces rules of hooks) — **non-negotiable**
- `eslint-plugin-react` (general React rules)
- `@typescript-eslint` (TypeScript rules)

**Keep dependencies fresh:** Use `npm outdated` or Renovate/Dependabot. React's ecosystem moves fast; falling behind on major versions creates painful migration debt.

**Monitor bundle size:** Use `@next/bundle-analyzer` (for Next.js) or `rollup-plugin-visualizer` (for Vite). Set a bundle budget and check it in CI.

### Patterns for Maintainability

**Co-locate related code:** Tests next to components, styles next to components, types next to the code that uses them.

```
UserCard/
├── UserCard.tsx
├── UserCard.test.tsx
├── UserCard.module.css
└── index.ts
```

**Limit component size:** If a component exceeds 200 lines, extract sub-components or custom hooks. If a hook exceeds 100 lines, it's probably doing too much.

**Use barrel exports sparingly:** They can cause unexpected bundle bloat. Only use them at feature boundaries, not for every folder.

**Avoid prop drilling beyond 2 levels:** If you're passing a prop through 3+ components that don't use it, use Context or a state management library.

**Standardize data fetching:** Pick one approach (React Query, SWR, or server components) and use it everywhere. Don't mix `useEffect` + `fetch` with React Query in the same codebase.

### Performance Monitoring

- **React Profiler** in DevTools for component render times
- **Lighthouse** for overall page performance
- **Web Vitals** (LCP, FID, CLS) — Next.js has built-in reporting via `next/web-vitals`
- **Sentry** or similar for production error tracking

### Refactoring Strategies

**1. Class Components → Function Components**

Do it incrementally — refactor a class when you're already modifying that file. Don't rewrite the whole codebase at once. The mapping is straightforward:

```jsx
// Before: Class component
class UserProfile extends React.Component {
  state = { isEditing: false };

  componentDidMount() { this.fetchUser(); }
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) this.fetchUser();
  }
  componentWillUnmount() { this.cleanup(); }

  fetchUser = () => { /* ... */ };
  cleanup = () => { /* ... */ };

  render() {
    return <div>{this.props.name} {this.state.isEditing && <EditForm />}</div>;
  }
}

// After: Function component
function UserProfile({ userId, name }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUser(userId);
    return () => cleanup();
  }, [userId]);  // Handles mount, update, AND unmount in one hook

  return <div>{name} {isEditing && <EditForm />}</div>;
}
```

Key translations: `this.state` → `useState`, `this.props` → function params, `componentDidMount` + `componentDidUpdate` + `componentWillUnmount` → `useEffect`, `this.method` → `const method` or `useCallback`.

**2. Redux → Zustand/Jotai**

Migrate one slice at a time. Zustand and Redux can coexist in the same app:

```jsx
// Step 1: Create a Zustand store that mirrors one Redux slice
const useUserStore = create((set) => ({
  user: null,
  fetchUser: async (id) => {
    const user = await api.getUser(id);
    set({ user });
  },
}));

// Step 2: Update components one by one
// Before: const user = useSelector(state => state.user.current);
// After:  const user = useUserStore(state => state.user);

// Step 3: Once all consumers are migrated, remove the Redux slice
```

**3. Pages Router → App Router (Next.js)**

Can be done page by page. Both routers work in the same project simultaneously — Next.js merges `pages/` and `app/` routes. Migrate one route at a time, starting with the simplest pages.

**4. useEffect Data Fetching → React Query**

This is one of the highest-impact refactors. Replace manual loading/error/data state management with React Query:

```jsx
// Before: 15 lines of boilerplate per data fetch
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;
  setIsLoading(true);
  fetchUsers()
    .then(data => { if (!cancelled) setUsers(data); })
    .catch(err => { if (!cancelled) setError(err); })
    .finally(() => { if (!cancelled) setIsLoading(false); });
  return () => { cancelled = true; };
}, []);

// After: 3 lines with React Query — plus you get caching, refetching, deduplication
const { data: users = [], isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### Error Handling at Scale

Large React apps need a consistent error handling strategy. The three layers:

**Layer 1 — Error Boundaries (catch render errors):**

```jsx
// ErrorBoundary.tsx — the only class component you'll still need
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Send to error tracking service (Sentry, etc.)
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Use at multiple levels for granular error recovery
<ErrorBoundary fallback={<AppCrashScreen />}>
  <Layout>
    <ErrorBoundary fallback={<SectionError />}>
      <Dashboard />
    </ErrorBoundary>
    <ErrorBoundary fallback={<SectionError />}>
      <ActivityFeed />
    </ErrorBoundary>
  </Layout>
</ErrorBoundary>
```

**Layer 2 — Data fetching errors (React Query handles this):**

```jsx
// Global error handler for all queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      onError: (error) => showToast(`Failed to load data: ${error.message}`),
    },
    mutations: {
      onError: (error) => showToast(`Action failed: ${error.message}`),
    },
  },
});
```

**Layer 3 — Form/input validation errors (React Hook Form + Zod):**

```jsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Scaling Tips (Lessons from Large Codebases)

**Establish conventions early and document them.** Create a `CONTRIBUTING.md` or `docs/conventions.md` that covers: where new components go, naming conventions, how to add a new API endpoint, state management decision tree, and testing expectations.

**Use path aliases.** Avoid `../../../components/Button` imports. Configure `@/` as a path alias to `src/`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```tsx
// Before: import { Button } from '../../../components/ui/Button';
// After:  import { Button } from '@/components/ui/Button';
```

**Enforce rules with tooling, not code reviews.** Configure ESLint rules for import boundaries (e.g., features can't import from other features directly), maximum file length, hook dependency exhaustiveness, and accessibility. Automate what you can — humans miss things in review that linters catch consistently.

**Monitor bundle size in CI.** Set a budget and fail the build if it's exceeded. A single accidental import of a heavy library can add 200KB to your bundle without anyone noticing.

---

## 23. Ecosystem & Libraries Cheat Sheet

### Must-Have Libraries (Most React Projects Use These)

| Category | Library | Notes |
|---|---|---|
| **Routing** | React Router / Next.js | React Router for SPAs, Next.js for SSR/SSG |
| **Server State** | TanStack Query | Data fetching, caching, sync. The gold standard. |
| **Client State** | Zustand | Minimal, scalable, great DX |
| **Forms** | React Hook Form | Performance-first, minimal re-renders |
| **Validation** | Zod | Schema validation, pairs perfectly with RHF |
| **Styling** | Tailwind CSS | Near-universal adoption in 2025+ |
| **UI Components** | shadcn/ui | Copy-paste Radix+Tailwind components. Not a dependency. |
| **Animation** | Framer Motion | The standard for React animation |
| **Tables** | TanStack Table | Headless, powerful, framework-agnostic |
| **Date/Time** | date-fns or dayjs | Avoid Moment.js (large, mutable) |
| **Icons** | Lucide React | Clean, consistent SVG icon set |
| **HTTP Client** | ky or axios | ky is lighter; many teams use plain fetch |
| **Testing** | Vitest + RTL + MSW | Fast, ergonomic, realistic |
| **Linting** | ESLint + Prettier + Biome | Biome is gaining traction as all-in-one |
| **Auth** | NextAuth.js (Auth.js) / Clerk | For Next.js projects |

### Libraries to Know About

| Category | Library | Notes |
|---|---|---|
| **Full-Stack Type Safety** | tRPC | End-to-end TypeScript, no codegen |
| **GraphQL** | urql or Apollo | Apollo is heavier but more mature |
| **Drag & Drop** | dnd-kit | Modern, accessible, performant |
| **Virtualization** | TanStack Virtual | For rendering massive lists/grids |
| **PDF** | react-pdf | Render PDFs in React |
| **Rich Text** | Tiptap / Slate / Lexical | Lexical is Meta's editor framework |
| **Diagrams** | ReactFlow | Node-based UIs, flowcharts |
| **State Machines** | XState | For complex state logic |
| **Feature Flags** | LaunchDarkly / Statsig | Feature rollout management |
| **i18n** | next-intl / react-i18next | Internationalization |
| **Monitoring** | Sentry | Error tracking + performance |
| **Analytics** | Vercel Analytics / PostHog | Web analytics |

---

## 24. Quick Reference: Vue 3 → React Translation Table

| Vue 3 | React | Notes |
|---|---|---|
| `<template>` | JSX in function body | No template block |
| `<script setup>` | Function body before return | Everything is JS |
| `<style scoped>` | CSS Modules / Tailwind | No built-in scoping |
| `ref()` | `useState()` | Must use setter, immutable |
| `reactive()` | `useState()` with object | Spread to update |
| `computed()` | `useMemo()` | Must list dependencies manually |
| `watch()` | `useEffect()` | Must list dependencies manually |
| `watchEffect()` | `useEffect()` | No auto-tracking |
| `onMounted()` | `useEffect(() => {}, [])` | Empty dependency array |
| `onUnmounted()` | `useEffect(() => () => cleanup, [])` | Return cleanup function |
| `defineProps()` | Function params + TypeScript | Destructure in function signature |
| `defineEmits()` | Callback props (`onX`) | Pass functions as props |
| `v-model` | `value` + `onChange` | No two-way binding sugar |
| `v-if` / `v-else` | `&&` / ternary / early return | Plain JavaScript |
| `v-for` | `.map()` | Always provide `key` |
| `v-show` | `style={{ display }}` | Toggle display property |
| `v-bind` | Spread `{...props}` | Or individual props |
| `v-on` | `onClick`, `onChange`, etc. | CamelCase event props |
| `<slot>` | `children` prop | Default slot |
| `<slot name="x">` | Named props (render props) | Pass JSX as props |
| `<slot :data="x">` | Render props | Pass function returning JSX |
| `provide()` / `inject()` | `createContext` + `useContext` | Context API |
| `<Teleport>` | `createPortal()` | From `react-dom` |
| `<Suspense>` | `<Suspense>` | Similar API |
| `<KeepAlive>` | No built-in equivalent | Use state preservation or libraries |
| `<Transition>` | Framer Motion / CSS | No built-in transition component |
| `nextTick()` | `flushSync()` or `useEffect` | Different mental model |
| `defineExpose()` | `useImperativeHandle` + `forwardRef` | Expose methods to parent |
| Pinia store | Zustand store | Similar API surface |
| Vuex | Redux Toolkit | Flux-based |
| Vue Router | React Router | Similar concepts, different API |
| Nuxt | Next.js | Meta-framework equivalent |
| Composable (`use*`) | Custom hook (`use*`) | Nearly identical pattern |
| Plugin system | Provider pattern / Context | Wrap app in providers |
| Directive | Custom hook or HOC | No directive system |
| Mixin | Custom hook | Mixins are dead in React too |

---

## Final Advice for Vue Engineers

1. **Embrace the re-render.** Stop trying to prevent them. React is designed around re-renders. Only optimize when you measure a problem.

2. **Think immutably.** You cannot mutate state. Ever. If you catch yourself writing `state.x = y`, stop. Use the setter function with a new object/array.

3. **Dependencies are your responsibility.** React doesn't auto-track. When you write `useEffect` or `useMemo`, you must declare what it depends on. ESLint will help, but you need to understand why.

4. **Composition is king.** Small components, custom hooks, render props. React favors lots of small, composable pieces over fewer large ones.

5. **The ecosystem is your framework.** React itself is tiny. Your "framework" is React + Router + State Library + Data Fetching + Form Library + Styling. Embrace the choices; they give you flexibility.

6. **TypeScript is non-negotiable** in serious React projects. If the project doesn't use it, that's a red flag.

7. **Read the React docs.** The new docs at [react.dev](https://react.dev) are exceptional — they explain concepts in depth with interactive examples. The "Escape Hatches" section alone is worth an afternoon.

---

*Last updated: March 2026. React 19 / Next.js 15 era.*
