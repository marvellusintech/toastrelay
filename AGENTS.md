<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ToastRelay Project Notes

- UI primitives come from shadcn/ui.
- Treat `components/ui/` as generated/vendor component code.
- Build product-specific composition in `components/reuseables/` or route-local `_components/`.
- Prefer shadcn/Radix primitives before creating custom controls from scratch.
