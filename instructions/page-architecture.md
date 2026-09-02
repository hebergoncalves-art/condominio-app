---

## alwaysApply: true

# Page Structure - Project Standard

This document defines the standard for organizing pages in the project using the Next.js App Router.

The main goal is to maintain a clear separation between:

* User interface
* Entry points for user actions
* Business rules
* Database access

## Main Principle

The preferred application flow is:

```text
UI
↓
Server Action
↓
Service
↓
Data Access Layer
↓
Database
```

For simple data reads during page rendering, the flow can be:

```text
page.tsx
↓
Data Access Layer
↓
Database
```

When the read involves business rules, decisions, or multiple operations, use:

```text
page.tsx
↓
Service
↓
Data Access Layer
↓
Database
```

---

# Base Structure

```text
/page-name/
├── page.tsx
│
├── _components/
│   └── content.tsx
│
├── _actions/
│   └── update-item.ts
│
├── _services/
│   └── update-item-service.ts
│
└── _data-access/
    ├── get-item.ts
    └── update-item.ts
```

Not every page needs all of these folders.

Create only the layers required by the functionality.

---

# 1. `page.tsx` - Page Entry Point

`page.tsx` should be a Server Component by default.

Responsibilities:

* Render the page
* Fetch initial data
* Check access when necessary
* Compose Server Components and Client Components
* Pass only the required data to components

Example:

```typescript
import { AccountContent } from "./_components/account-content";
import { getUserData } from "./_data-access/get-user-data";

export default async function AccountPage() {
  const user = await getUserData();

  return <AccountContent user={user} />;
}
```

## `page.tsx` may:

* Call read functions from `_data-access`
* Call `_services` when business rules are involved
* Execute server-only code
* Render components

## `page.tsx` must not:

* Contain SQL queries or direct ORM calls
* Contain complex business rules
* Use `useState`, `useEffect`, or other client hooks
* Handle events such as `onClick`
* Become an excessively large file

---

# 2. `_components/` - User Interface

Contains components specific to the page or functionality.

Example:

```text
_components/
├── account-content.tsx
├── account-form.tsx
└── delete-account-dialog.tsx
```

The `_` prefix indicates that this folder does not represent a route.

Components may be Server Components or Client Components.

## Important Rule

Do not add `"use client"` automatically.

Prefer Server Components.

Use Client Components only when truly necessary.

---

## Server Component

Use when the component:

* Only renders content
* Does not need local state
* Does not use event handlers
* Does not use browser APIs
* Can be processed on the server

---

## Client Component

Use `"use client"` when there is a need for:

* `useState`
* `useEffect`
* `useReducer`
* `onClick`
* `onChange`
* Browser APIs
* Browser-dependent libraries
* Complex interactions
* Interactive forms

Example:

```typescript
"use client";

import { useState } from "react";
import { updateAccountAction } from "../_actions/update-account";

export function AccountForm() {
  const [loading, setLoading] = useState(false);

  // user interaction

  return (
    <form>
      {/* UI */}
    </form>
  );
}
```

## Client Components must not:

* Access the database
* Import an ORM
* Import credentials
* Execute confidential logic
* Implement important business rules

---

# 3. `_actions/` - Server Actions

Server Actions represent the server entry point for actions initiated by the user.

Examples:

* Create a record
* Update a record
* Delete a record
* Submit a form
* Change a setting
* Confirm an operation

Files in this layer use:

```typescript
"use server";
```

## Server Action Responsibilities

A Server Action may:

1. Receive data sent by the client
2. Validate the input
3. Check authentication
4. Check authorization
5. Call a Service
6. Return a safe and typed result
7. Request revalidation when necessary

## A Server Action must not be the primary database access layer

Avoid:

```typescript
"use server";

export async function updateUserAction(input) {
  // validation

  await db.update(users)...

  // other rules...

  await db.insert(logs)...

  // more rules...
}
```

This mixes:

* HTTP/RPC entry point
* Validation
* Business rules
* Data access

The Action should be small and work as a controller.

---

## Recommended Example

```typescript
"use server";

import { z } from "zod";
import { requireAuth } from "@/lib/session";
import { updateAccountService } from "../_services/update-account-service";

const schema = z.object({
  name: z.string().min(3),
});

export type UpdateAccountInput = z.infer<typeof schema>;

export type UpdateAccountResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function updateAccountAction(
  input: UpdateAccountInput
): Promise<UpdateAccountResult> {
  const session = await requireAuth();

  const validation = schema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAccountService({
      userId: session.user.id,
      name: validation.data.name,
    });

    return {
      success: true,
      message: "Account updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "The account could not be updated.",
    };
  }
}
```

Notice that the Action does not need to know how the database is updated.

It only calls:

```typescript
updateAccountService()
```

---

# 4. `_services/` - Business Rules

The Service layer contains business rules and coordinates application operations.

Not every functionality needs a Service.

Create a Service when there are:

* Business rules
* Multiple database operations
* Multi-step processes
* Integrations between different data sources
* Decisions based on application state
* Operations reused in different places

Examples:

```text
_services/
├── create-order-service.ts
├── cancel-order-service.ts
└── update-account-service.ts
```

---

## Example

```typescript
import { getUserById } from "../_data-access/get-user-by-id";
import { updateUser } from "../_data-access/update-user";

type UpdateAccountServiceInput = {
  userId: string;
  name: string;
};

export async function updateAccountService({
  userId,
  name,
}: UpdateAccountServiceInput) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.status === "blocked") {
    throw new Error("USER_BLOCKED");
  }

  await updateUser({
    id: userId,
    name,
  });
}
```

Here is the difference:

```text
Action
↓
"The user requested an account update."

Service
↓
"Is the user allowed to do this?
Which rules must be applied?
Which operations need to happen?"

DAL
↓
"How do I read or modify the data in the database?"
```

---

# 5. `_data-access/` - Data Access Layer

The DAL is the only layer of the functionality that should know the details of the database.

Responsibilities:

* SELECT
* INSERT
* UPDATE
* DELETE
* ORM queries
* SQL queries
* Record mapping
* Returning typed data

Example:

```text
_data-access/
├── get-user-by-id.ts
├── get-account-data.ts
├── update-user.ts
└── delete-user.ts
```

---

## Read Example

```typescript
import "server-only";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function getUserById(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}
```

---

## Write Example

```typescript
import "server-only";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

type UpdateUserInput = {
  id: string;
  name: string;
};

export async function updateUser({
  id,
  name,
}: UpdateUserInput) {
  await db
    .update(users)
    .set({
      name,
    })
    .where(eq(users.id, id));
}
```

The DAL can perform both reads and writes.

It is not only a layer for `GET` operations.

---

# What Not to Put in the DAL

Avoid placing rules such as:

```typescript
if (user.plan === "free" && projects.length >= 3) {
  throw new Error("Limit reached");
}
```

This is a business rule and belongs in the Service.

The DAL should primarily focus on:

```text
How do I fetch data?
How do I save data?
How do I update data?
How do I delete data?
```

Not:

```text
Is the user allowed to do this?
What business decision should we make?
```

---

# Authentication and Authorization

Authentication and authorization may exist in more than one layer because they are security requirements.

However, each layer has a different purpose.

## Action

May check:

* Is the user authenticated?
* Is the user allowed to initiate this action?

## Service

May check:

* Does the business rule allow this operation?
* Does the user have permission to access this resource?
* Is the resource in a valid state?

## Data Access

When necessary, queries should be restricted so they do not return data that does not belong to the user or tenant.

Never rely only on a Client Component for security.

---

# Simple Read Flow

For a page that only needs to display data:

```text
User
↓
page.tsx
↓
_data-access/get-data.ts
↓
Database
↓
page.tsx
↓
Component
```

Example:

```typescript
const user = await getUserData();
```

Do not create a Service just for the sake of creating one.

---

# Read Flow with Business Rules

When data needs to be combined or interpreted:

```text
page.tsx
↓
_service
↓
_data-access
↓
Database
```

Example:

```text
Dashboard
↓
getDashboardService()
↓
getUser()
getOrders()
getSubscription()
↓
calculate information
↓
return DashboardData
```

---

# Write Flow

For creating, updating, or deleting data:

```text
Client Component
↓
Server Action
↓
Service
↓
Data Access
↓
Database
```

Then:

```text
Database
↓
Data Access
↓
Service
↓
Action
↓
Client Component
```

Complete example:

```text
User clicks "Save"
        ↓
AccountForm
        ↓
updateAccountAction()
        ↓
Zod validation
        ↓
authentication
        ↓
updateAccountService()
        ↓
business rules
        ↓
updateUser()
        ↓
Database
        ↓
result
        ↓
Action
        ↓
toast / message / UI update
```

---

# When There Are No Business Rules

For extremely simple operations, an Action may call the DAL directly.

Example:

```text
Action
↓
DAL
↓
Database
```

This is acceptable when:

* The operation is simple
* There are no business rules
* There are no multiple coordinated operations
* There is no logic that will be reused

Example:

```typescript
"use server";

export async function deleteDraftAction(id: string) {
  await requireAuth();

  const validation = schema.parse({ id });

  await deleteDraft(validation.id);

  return {
    success: true,
  };
}
```

Do not create an empty Service just to add another layer.

---

# Dependency Rules

Prefer dependencies in this direction:

```text
page.tsx
│
├──> Components
│
├──> Services
│
└──> Data Access

Client Component
│
└──> Server Action

Server Action
│
└──> Service
       │
       └──> Data Access
                │
                └──> Database
```

Avoid inverted dependencies.

For example:

```text
DAL → Action
```

Not allowed.

```text
DAL → React Component
```

Not allowed.

```text
Service → Client Component
```

Not allowed.

```text
Database → UI
```

Not allowed.

---

# Complete Example: `/account`

```text
/account/
├── page.tsx
│
├── _components/
│   ├── account-content.tsx
│   └── account-form.tsx
│
├── _actions/
│   └── update-account.ts
│
├── _services/
│   └── update-account-service.ts
│
└── _data-access/
    ├── get-user-data.ts
    ├── get-user-by-id.ts
    └── update-user.ts
```

Loading flow:

```text
page.tsx
↓
getUserData()
↓
Database
↓
AccountContent
```

Update flow:

```text
AccountForm
↓
updateAccountAction()
↓
updateAccountService()
↓
updateUser()
↓
Database
```

---

# When to Create Each Folder

## `_components/`

Create when the page has page-specific components.

Responsibility:

```text
Interface and interaction
```

---

## `_actions/`

Create when there are actions initiated by the user on the client.

Examples:

* create
* update
* delete
* confirm
* submit a form

Responsibilities:

```text
Server entry point
Validation
Initial authentication/authorization
Calling the Service
Returning a safe result to the UI
```

---

## `_services/`

Create when there are business rules or coordinated operations.

Responsibility:

```text
Decide what should happen
```

Do not create empty Services just to comply with the architecture.

---

## `_data-access/`

Create when there is access to persisted data.

Responsibilities:

```text
Read
Create
Update
Delete
```

ORM code and queries should be placed here.

---

# Mental Rule for Agents

When implementing a feature, ask:

## Is it interface code?

```text
_components/
```

## Is it an action initiated by the user?

```text
_actions/
```

## Is it a business rule or business decision?

```text
_services/
```

## Is it database access?

```text
_data-access/
```

---

# Best Practices

## Server Components

* Prefer Server Components
* Fetch data on the server
* Do not use client hooks
* Do not use event handlers
* Do not access the ORM directly from the UI

---

## Client Components

* Use only when necessary
* Manage state and interaction
* Call Server Actions for mutations
* Never access the database directly
* Never contain secrets

---

## Server Actions

* Validate all external input
* Check authentication
* Check authorization when necessary
* Call Services for business rules
* Call the DAL directly only for truly simple operations
* Return only safe data
* Keep Actions small

---

## Services

* Centralize business rules
* Coordinate multiple operations
* Work with DAL functions
* Remain independent from the interface whenever possible
* Do not access React components

---

## Data Access

* Centralize database access
* Encapsulate queries
* Return well-defined types
* Fetch only the required fields
* Avoid exposing sensitive data
* Use `server-only` when appropriate
* Do not contain interface logic

---

# Validation

All untrusted input must be validated on the server.

Use Zod when appropriate.

This includes data coming from:

* Forms
* URLs
* Search Params
* External APIs
* Client Components
* Server Actions

Do not rely only on validation performed in the browser.

---

# Typing

Whenever possible:

* Type parameters
* Type return values
* Avoid `any`
* Create specific types for data transfer
* Do not return complete database records when only a few fields are required

---

# Security

Never send the following to Client Components:

* Passwords
* Hashes
* Tokens
* Secrets
* Private keys
* Unnecessary internal data

Authorization must be performed on the server.

Never rely on hiding a button in the interface as a security mechanism.

---

# Errors

Internal errors must not be sent directly to the client.

Avoid:

```typescript
return {
  error: error.message,
};
```

when the message may reveal internal details.

Prefer:

```typescript
return {
  success: false,
  message: "The operation could not be completed.",
};
```

Log technical details on the server when necessary.

---

# Data Revalidation

After operations that modify data, evaluate the need for:

* `revalidatePath`
* `revalidateTag`
* Optimistic updates
* `router.refresh()`

Choose according to the functionality's strategy.

---

# Server ↔ Client Communication

Always pay attention to the boundary between Server Components and Client Components.

Data sent to Client Components must be serializable.

Avoid passing:

* Database connections
* Regular server functions
* Complex non-serializable objects
* Secrets

Server Actions are a framework-controlled exception and must follow Next.js conventions.

---

# Hydration

When using Client Components, watch for potential hydration issues.

Avoid unnecessary differences between the HTML rendered on the server and the first render on the client.

Pay special attention to:

* Dates
* `Math.random()`
* `window`
* `localStorage`
* Screen width
* Browser-only APIs

When necessary, execute browser-dependent logic after the component mounts.

---

# Architectural Principles

## 1. Separation of Responsibilities

Each layer must have a clear purpose.

```text
Component = presentation

Action = operation entry point

Service = business rules

DAL = persistence
```

## 2. Do Not Add Unnecessary Complexity

A simple operation does not necessarily need to pass through five files.

Start simple and add layers when there is a real responsibility for them.

## 3. Avoid Duplicated Logic

If a business rule is used by more than one Action, move it to a Service.

If a query is used in more than one place, consider moving it to a shared DAL.

## 4. Do Not Mix UI with Persistence

React components must never know database details.

## 5. Prefer Easy-to-Understand Code

The architecture should help maintain the project, not create unnecessary bureaucracy.

---

# Summary

For simple reads:

```text
page.tsx
↓
DAL
↓
Database
```

For reads with business rules:

```text
page.tsx
↓
Service
↓
DAL
↓
Database
```

For data mutations:

```text
Client Component
↓
Server Action
↓
Service
↓
DAL
↓
Database
```

For simple mutations without business rules:

```text
Client Component
↓
Server Action
↓
DAL
↓
Database
```

Main rule:

```text
The UI must not access the database.

Actions must not centralize business rules.

Services decide what should happen.

The DAL knows how to access the data.
```

---

**Implementation reference:** `/src/app/(painel)/dashboard/account/`
