# Hooks Folder

Use this folder for reusable client-side React behavior. API endpoints, fetch
functions, React Query cache keys, and mutations should live in `app/_queries/`.

Good fits for `hooks/`:

- Browser/UI state such as media queries, mounted state, disclosure state, tabs, filters, and debounced input.
- Product-specific view state such as active event tabs or dashboard filters.
- Hooks that compose local state with existing app stores.
- Session composition, such as `use-auth-session.ts`, when it combines query state with the auth store.

Avoid putting these here:

- Raw `fetch` calls to backend resources.
- Endpoint strings and backend payload mapping.
- Query invalidation rules. Keep those in `app/_queries/`.

The existing `use-event-queries.ts` file is a compatibility bridge for old
imports. New API hooks should be imported directly from their resource module,
for example `@/app/_queries/events`.
