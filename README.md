ToastRelay frontend rewrite built with Next.js App Router, React, TypeScript,
Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Zod, Sonner, and Lucide.

The backend lives in a separate repository. This app should consume backend
resources through `app/_queries/api_client.ts` and resource-specific query files.

## UI System

The UI library for this project is shadcn/ui.

- Keep shadcn-generated primitives in `components/ui/`.
- Do not hand-edit or rename generated shadcn primitives unless there is a deliberate project-wide reason.
- Put shared ToastRelay components in `components/reuseables/`.
- Keep route-specific components inside route-local `_components/` folders.
- Prefer shadcn/Radix primitives for dialogs, buttons, inputs, selects, tabs, tables, dropdowns, and forms.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
