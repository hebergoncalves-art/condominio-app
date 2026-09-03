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

## Definition of Done

Do not consider a feature complete only because the UI appears to work.

Before declaring implementation complete, verify that:

* all relevant requirements from the PRD and implementation plan are implemented;
* the implementation follows the architecture defined in this repository;
* React components do not access the database directly;
* business rules are not embedded in UI components;
* database queries are encapsulated in the Data Access Layer;
* Server Actions remain small and delegate business rules to Services when necessary;
* Services are used only when real business logic or orchestration exists;
* Server Components are preferred whenever client-side behavior is not required;
* Client Components contain only browser interaction and client-side state;
* all external input is validated on the server;
* authentication and authorization checks are implemented server-side;
* RLS and Storage policies enforce the expected authorization model;
* persistent features use the real persistence layer and are not implemented only with local state, mocks, or temporary demo data;
* loading, error, empty and unauthorized states are handled;
* relevant lint, TypeScript and automated tests pass;
* browser-visible flows are tested with Playwright when applicable;
* documentation is updated when setup, environment variables or architecture change.

Before declaring the task complete, perform a final self-review against:

1. `AGENTS.md`
2. relevant files in `instructions/`
3. the PRD
4. the implementation plan
5. tests and acceptance criteria

If any required item remains incomplete, explicitly report it instead of presenting the task as finished.
