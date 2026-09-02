# Project Agent Instructions

This project uses:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zod

## Architecture

Follow the project architecture documented in:

- `instructions/nextjs-architecture.md`
- `instructions/page-architecture.md`

Before creating or modifying pages, routes, components,
server actions or data-access code, read the relevant
architecture instructions.

## Core principles

- Prefer Server Components.
- Use Client Components only when necessary.
- Keep business logic outside UI components.
- Keep database access outside UI components.
- Use TypeScript.
- Validate external input with Zod.
- Prefer colocating page-specific components.
- Reuse global components only when appropriate.

## Page architecture

Default page structure:

page.tsx
_components/
_actions/
_data-access/

Read:

`instructions/page-architecture.md`

before creating or significantly modifying a page.

## Workflow

Before implementing:

1. Understand the requested feature.
2. Inspect the existing implementation.
3. Identify affected files.
4. Follow existing architecture.
5. Avoid unnecessary abstractions.

After implementing:

1. Check TypeScript.
2. Run lint.
3. Run relevant tests.
4. Review for architecture violations.

## Documentation and Context7

Use the Context7 MCP when working with external libraries, frameworks, or APIs.

Consult Context7 when:

- the API or syntax is uncertain;
- the implementation depends on the installed version;
- a feature may have changed between versions;
- an error appears related to a library or framework;
- using an unfamiliar library or API;
- implementing features involving Next.js, React, Tailwind CSS, shadcn/ui, Zod, authentication libraries, database libraries, ORMs, or other third-party packages.

Prefer the documentation that matches the versions installed in this project.

Do not use Context7 unnecessarily for simple project logic that is already clear from the repository.

When Context7 is used, always follow the project's architecture and instructions defined in this repository.