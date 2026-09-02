---
applyTo: "src/app/**/*.{ts,tsx}"
---

When working with Next.js pages or routes:

- Prefer Server Components.
- Keep page-specific components inside `_components`.
- Put Server Actions inside `_actions`.
- Put reads/data fetching inside `_data-access`.
- Keep UI separate from business logic.
- Validate external input using Zod.

For the complete project convention, read:

`instructions/page-architecture.md`