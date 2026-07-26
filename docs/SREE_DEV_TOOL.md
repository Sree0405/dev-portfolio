# Sree Dev Tool — Core Architecture

High-level documentation for the **Sree Dev Tool** internal dashboard embedded in the React portfolio application. This document is the entry point for all dashboard modules and describes how to extend the platform in a scalable, repeatable way.

---

## Overview

**Sree Dev Tool** is a private, session-authenticated dashboard for managing freelance business operations. It runs on the same Express server as the portfolio (port **8080** by default) and uses Neon PostgreSQL via Prisma.

Each feature area is implemented as an independent **module** with its own:

- Prisma model(s)
- Repository + service + route layers
- Frontend route under `/dashboard/*`
- Sidebar navigation entry
- Dedicated documentation file in `docs/`

---

## Module Registry

| Module | Route | Documentation |
|--------|-------|---------------|
| **Dashboard** (analytics home) | `/dashboard` | [Project Management Dashboard](./PROJECT_MANAGEMENT_DASHBOARD.md#frontend-routes) |
| **Projects** | `/dashboard/projects` | [Project Management Dashboard](./PROJECT_MANAGEMENT_DASHBOARD.md) |
| **Credentials** | `/dashboard/credentials` | [Credential Management Dashboard](./CREDENTIAL_MANAGEMENT_DASHBOARD.md) |
| **Resume** | `/dashboard/resume` | [Resume Dashboard](./RESUME_DASHBOARD.md) |
| **Dev Utilities** | `/dashboard/dev-utilities` | [Dev Utilities Dashboard](./DEV_UTILITIES_DASHBOARD.md) |
| **Playground** | `/dashboard/playground` | [Developer Playground](./PLAYGROUND.md) |
| **Finance Hub** | `/dashboard/finance` | [Finance Management Dashboard](./FINANCE_MANAGEMENT_DASHBOARD.md) |
| **Budget Planner** | `/dashboard/budget-planner` | Monthly income planning & spending tracker |

When adding a new module:

1. Register it in this table.
2. Create a dedicated doc in `docs/` (see [Module documentation](#module-documentation) below).

---

## Module Types

Not every module needs the full backend stack. Pick the pattern that fits:

| Type | Backend (Prisma/API) | Example modules | Doc naming |
|------|----------------------|-----------------|------------|
| **Full-stack** | Yes — model, repository, service, route | Projects, Credentials, Finance | `docs/<NAME>_DASHBOARD.md` |
| **Client-only** | No — browser-only logic & storage | Playground | `docs/<NAME>.md` or `docs/<NAME>_MODULE.md` |
| **Hybrid** | Partial — some API, some client-only | Resume, Dev Utilities | `docs/<NAME>.md` |

---

## Shared Architecture

```
Browser (React SPA)
       │
       ▼
Express (port 8080)
  ├── /api/*     → REST API (auth, modules)
  └── /*         → Vite (dev) or static dist (prod)
       │
       ▼
Prisma → Neon PostgreSQL
```

### Backend layers (per module)

```
routes/<module>.ts
    → services/<module>Service.ts
        → repositories/<module>Repository.ts
            → prisma/client
```

### Frontend layers (per module)

```
src/app/routes/dashboard/<module>/<Module>Page.tsx
src/app/components/Forms/<Module>Form.tsx   (if CRUD forms needed)
src/app/lib/api.ts                          (API client methods)
src/app/lib/types.ts                        (shared types)
src/app/components/Sidebar/dashboardNavItems.ts
```

For larger **client-only** modules, colocate feature code under a dedicated folder (example: `src/app/playground/`) and keep the route page thin. See [Developer Playground](./PLAYGROUND.md#module-structure).

---

## Authentication & Data Isolation

Two accounts are supported:

| Account | Username | Role | Data type | Delete |
|---------|----------|------|-----------|--------|
| Owner | `OWNER_USERNAME` (env) | `owner` | `Default` | Allowed |
| Demo | `Demo` | `demo` | `Demo` | Blocked (403) |

Every data model that belongs to a user context includes a `type` field (`DataType` enum: `Default` | `Demo`). All repository queries filter by the session user's `dataType`. Demo users never see owner data and vice versa.

Reusable helpers:

- `server/middleware/auth.ts` — `requireAuth`, `getSessionUser`, `blockDemoDelete`
- `server/auth/config.ts` — auth user resolution, demo delete error messages
- `src/app/hooks/useAuth.ts` — `canDelete`, `isDemo`, `isOwner`

---

## Reusable UI Components

Shared components live under `src/app/components/`:

| Component | Path | Purpose |
|-----------|------|---------|
| `AppModal` | `Modal/AppModal.tsx` | Dialog wrapper for create/edit flows |
| `ConfirmDialog` | `Common/ConfirmDialog.tsx` | Delete confirmation |
| `CopyButton` | `Common/CopyButton.tsx` | Clipboard copy with toast |
| `DataTable` | `Table/DataTable.tsx` | Generic table renderer |
| `EmptyState` | `Common/EmptyState.tsx` | Empty list states |
| `TableSkeleton` | `Common/LoadingSkeleton.tsx` | Loading placeholders |
| `DashboardHeader` | `Dashboard/DashboardHeader.tsx` | Page title + actions |
| `StatCard` | `Dashboard/StatCard.tsx` | Dashboard metric cards |

Button styling: use `variant="sree-dev"` for primary module actions.

---

## Adding a New Module (Checklist)

### Full-stack module (Projects, Credentials, Finance, …)

1. **Database** — Add Prisma model(s) with `type DataType @default(Default)` where data isolation is needed.
2. **Validation** — Add Zod schemas in `server/lib/validation.ts` and mirror in `src/app/lib/validation.ts` if forms are used.
3. **Backend** — Create repository, service, and route; register in `server/routes/index.ts`.
4. **Frontend** — Create page, form(s), API methods, types; add route in `src/App.tsx`.
5. **Navigation** — Add entry to `dashboardNavItems.ts` (sidebar + mobile nav pick it up automatically).
6. **Dashboard stats** — Extend `dashboardRepository.ts` / `dashboardService.ts` if the home page needs a new metric.
7. **Demo seed** — Add fictional `Demo` data in `prisma/seed.ts` if the module should be explorable via the demo account.
8. **Documentation** — Create `docs/<MODULE>_DASHBOARD.md` and add a row to the [Module Registry](#module-registry).

### Client-only module (Playground, …)

1. **Feature folder** — Create `src/app/<module>/` with components, hooks, registries, and a public `index.ts` API.
2. **Route page** — Add a thin page under `src/app/routes/dashboard/<module>/`.
3. **Navigation** — Add entry to `dashboardNavItems.ts`.
4. **Route** — Register in `src/App.tsx`.
5. **Documentation** — Create `docs/<MODULE>.md` (architecture, registries, file reference) and add a row to the [Module Registry](#module-registry).

> Example: [Developer Playground](./PLAYGROUND.md)

### Module documentation

Every new module **must** include a doc file in `docs/` that covers at minimum:

- Overview and route/navigation
- Architecture or folder structure
- How to extend the module (registries, APIs, hooks)
- File reference (key paths)
- Link back to this file (`SREE_DEV_TOOL.md`)

---

## Environment & Scripts

See [Project Management Dashboard — Getting Started](./PROJECT_MANAGEMENT_DASHBOARD.md#getting-started) for setup instructions.

Common commands:

```bash
npm run dev          # Start Express + Vite
npm run db:push      # Push schema to Neon
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed demo data
```

---

## Folder Structure (Dashboard)

```
server/
  auth/           Session users & config
  middleware/     Auth middleware
  repositories/   Data access per module
  services/       Business logic per module
  routes/         Express routers

src/app/
  routes/dashboard/     Module pages
  components/         Shared UI
  lib/                  API client, types, constants
  hooks/                useAuth

prisma/
  schema.prisma
  seed.ts

docs/
  SREE_DEV_TOOL.md                      ← This file (core index)
  PROJECT_MANAGEMENT_DASHBOARD.md       ← Projects module
  CREDENTIAL_MANAGEMENT_DASHBOARD.md    ← Credentials module
  FINANCE_MANAGEMENT_DASHBOARD.md       ← Finance Hub modules
  RESUME_DASHBOARD.md                   ← Resume (LaTeX editor) module
  DEV_UTILITIES_DASHBOARD.md            ← Dev Utilities module
  PLAYGROUND.md                         ← Developer Playground (client-only IDE)
```

---

## Security Notes

- Credentials and other sensitive data are stored in PostgreSQL and scoped by session `dataType`.
- Passwords are masked in the UI by default; reveal requires explicit user action.
- Demo credentials are intentionally fictional and seeded with `type = Demo`.
- Never commit `.env` or real credentials to the repository.
