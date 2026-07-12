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
| **Finance Hub** | `/dashboard/finance` | [Finance Management Dashboard](./FINANCE_MANAGEMENT_DASHBOARD.md) |
| **Budget Planner** | `/dashboard/budget-planner` | Monthly income planning & spending tracker |

When adding a new module, register it in this table and create a matching `docs/<MODULE>_DASHBOARD.md` file.

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

1. **Database** — Add Prisma model(s) with `type DataType @default(Default)` where data isolation is needed.
2. **Validation** — Add Zod schemas in `server/lib/validation.ts` and mirror in `src/app/lib/validation.ts` if forms are used.
3. **Backend** — Create repository, service, and route; register in `server/routes/index.ts`.
4. **Frontend** — Create page, form(s), API methods, types; add route in `src/App.tsx`.
5. **Navigation** — Add entry to `dashboardNavItems.ts` (sidebar + mobile nav pick it up automatically).
6. **Dashboard stats** — Extend `dashboardRepository.ts` / `dashboardService.ts` if the home page needs a new metric.
7. **Demo seed** — Add fictional `Demo` data in `prisma/seed.ts` if the module should be explorable via the demo account.
8. **Documentation** — Create `docs/<MODULE>_DASHBOARD.md` and add a row to the Module Registry above.

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
```

---

## Security Notes

- Credentials and other sensitive data are stored in PostgreSQL and scoped by session `dataType`.
- Passwords are masked in the UI by default; reveal requires explicit user action.
- Demo credentials are intentionally fictional and seeded with `type = Demo`.
- Never commit `.env` or real credentials to the repository.
