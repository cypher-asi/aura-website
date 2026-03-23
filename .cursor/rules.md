# TypeScript & React Rules

## TypeScript

### General

- Use TypeScript strict mode. Never use `any`; prefer `unknown` when the type is truly indeterminate.
- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and mapped types.
- Use `const` by default. Only use `let` when reassignment is necessary. Never use `var`.
- Prefer `as const` assertions over enums for small, fixed sets of values.
- Use explicit return types on exported functions and public methods.
- Avoid non-null assertions (`!`). Use narrowing, optional chaining (`?.`), or nullish coalescing (`??`) instead.

### Functions & Types

- Prefer named functions over anonymous arrow functions at the module level for better stack traces.
- Use discriminated unions over optional fields when the presence of one field implies another.
- Avoid `namespace`; use ES modules exclusively.
- Prefer `satisfies` over type casts when validating a value conforms to a type without widening.
- Generic type parameters should be descriptive (`TItem`, `TResponse`) rather than single letters when not obvious.

### Patterns

- Use `Record<string, T>` or `Map` over index signatures when keys are dynamic.
- Prefer `readonly` on properties and parameters that should not be mutated.
- Avoid class inheritance; prefer composition and plain objects/functions.
- Use branded types or template literal types for stringly-typed identifiers (e.g., `UserId`, `SessionToken`).

### Error Handling

- Never swallow errors silently. Log or re-throw with context.
- Use typed error classes or discriminated-union result types (`{ ok: true; data: T } | { ok: false; error: E }`) instead of throwing for expected failures.
- Validate external data at the boundary (API responses, user input) using runtime validation (Zod, etc.) and infer types from the schema.

---

## React

### Components

- Use functional components exclusively. No class components.
- Every React component lives in its own folder (`ComponentName/`), containing at minimum `ComponentName.tsx` and `ComponentName.css`. Co-locate tests and types in the same folder.
- Prefer named exports over default exports for components.
- Keep components small and focused. Extract a sub-component when a JSX block exceeds ~50 lines or is reused.
- Type props with an `interface` named `<Component>Props` (e.g., `interface SidebarProps`).
- Destructure props in the function signature.
- Use `React.FC` sparingly—prefer explicit typed props with a return type annotation when needed.

### Hooks

- Follow the Rules of Hooks: only call at the top level, only call from React functions.
- Extract reusable logic into custom hooks prefixed with `use`.
- Use `useCallback` and `useMemo` only when there is a measured or obvious performance benefit. Do not wrap everything by default.
- Prefer derived/computed values over state when the value can be calculated from existing state or props.
- Keep `useEffect` minimal: one effect per concern. Always include a cleanup function when subscribing to external resources.
- Never set state inside `useEffect` just to transform props—compute inline or use `useMemo`.

### State Management

- Colocate state as close as possible to where it's used.
- Use Zustand stores for cross-component or global state. Prefer selectors to avoid unnecessary re-renders.
- Avoid deeply nested state objects; prefer flat, normalized structures.
- Use React Router v7 for URL-driven state (search params, path params).

### Performance

- Wrap expensive child trees in `React.memo` only after profiling.
- Use virtualization (e.g., `@tanstack/react-virtual`) for long lists.
- Lazy-load routes and heavy components with `React.lazy` + `Suspense`.
- Avoid inline object/array literals in JSX props when identity matters for memoization.

### Patterns & Conventions

- Use the "container/presentational" pattern when a clear data-fetching/UI split helps readability.
- Prefer composition (`children`, render props) over prop drilling for shared layout.
- Use `key` props correctly: stable, unique identifiers—never array indices on reorderable lists.
- Event handler props should be prefixed with `on` (e.g., `onSelect`); handler implementations with `handle` (e.g., `handleSelect`).
- Avoid string refs and `findDOMNode`. Use `useRef` exclusively.

### Testing

- Write unit tests with Vitest + React Testing Library. Test behavior, not implementation details.
- Use `screen.getByRole` and accessible queries over test-ids whenever possible.
- Use Playwright for end-to-end tests covering critical user flows.

### Styling

- Each component folder must contain its own `ComponentName.css` file imported by the component. No shared or cross-component stylesheets.
- Keep styles scoped to the component. Avoid global CSS outside of resets and design tokens.
- Use CSS custom properties for theming and shared values.
