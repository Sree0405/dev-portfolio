# Developer Portfolio & Sree Dev Tool

A high-performance, immersive developer portfolio built with **React**, **Three.js**, and **Vite**, paired with **Sree Dev Tool** — a private, session-authenticated dashboard for managing freelance business operations.

The public site showcases projects, skills, and experience with interactive 3D visuals and smooth animations. Behind `/login`, the dashboard provides full-stack modules for projects, credentials, finance, resumes, developer utilities, and an in-browser code playground — all on a single Express server with Neon PostgreSQL.

---

## Features

### Public Portfolio

- Immersive 3D experience powered by Three.js and React Three Fiber
- Project documentation, skills, experience, and contact pages
- Responsive layouts with Tailwind CSS and shadcn/ui
- Smooth animations via Framer Motion and GSAP

### Sree Dev Tool (Private Dashboard)

| Module | Route | Description |
|--------|-------|-------------|
| **Dashboard** | `/dashboard` | Analytics home — stats, charts, recent activity |
| **Projects** | `/dashboard/projects` | Project CRUD, payments, notes, PDF invoices |
| **Credentials** | `/dashboard/credentials` | Password vault with masked secrets & copy actions |
| **Resume** | `/dashboard/resume` | Overleaf-style LaTeX editor with live preview & PDF export |
| **Dev Utilities** | `/dashboard/dev-utilities` | 12 client-side tools (JSON, JWT, UUID, Base64, etc.) |
| **Playground** | `/dashboard/playground` | Monaco-based IDE with sandboxed JS/TS execution |
| **Finance Hub** | `/dashboard/finance` | EMI, rent, and subscription tracking with PDF reports |
| **Budget Planner** | `/dashboard/budget-planner` | Monthly income planning & spending tracker |

---

## Architecture

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

- **Single port** — frontend and API share port `8080` (no separate backend project)
- **Session auth** — HTTP-only cookies via `express-session` (no JWT/OAuth)
- **Data isolation** — Owner and Demo accounts use separate `DataType` scopes (`Default` | `Demo`)
- **Layered backend** — `routes → services → repositories → Prisma`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| 3D | Three.js, React Three Fiber, Drei |
| Routing | React Router v6 |
| Forms & validation | React Hook Form, Zod |
| Data fetching | TanStack React Query |
| Editor | Monaco Editor, CodeMirror, latex.js |
| Backend | Express 5 |
| ORM | Prisma 6 |
| Database | Neon PostgreSQL |
| Auth | express-session, cookie-parser |
| Build | Vite, tsx |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A [Neon](https://neon.tech/) PostgreSQL database (for dashboard features)

### 1. Clone and install

```bash
git clone <YOUR_GIT_URL>
cd Developer-Portfolio
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
SESSION_SECRET=change-this-to-a-long-random-string
OWNER_USERNAME=Sree
OWNER_PASSWORD=your-secure-owner-password
DEMO_PASSWORD=Demo@2026
PORT=8080
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Yes (prod) | Secret for signing session cookies |
| `OWNER_USERNAME` | Yes (prod) | Owner account username |
| `OWNER_PASSWORD` | Yes (prod) | Owner account password |
| `DEMO_PASSWORD` | No | Demo account password (default: `Demo@2026`) |
| `PORT` | No | Server port (default: `8080`) |

### 3. Database setup

```bash
npm run db:generate
npm run db:push
npm run db:seed    # Optional — seeds demo data for the Demo account
```

### 4. Start development

```bash
npm run dev
```

Open:

- Portfolio: [http://localhost:8080/](http://localhost:8080/)
- Login: [http://localhost:8080/login](http://localhost:8080/login)
- Dashboard: [http://localhost:8080/dashboard](http://localhost:8080/dashboard)

### 5. Production build

```bash
npm run build
npm run start
```

> **Note:** This app requires a Node.js server. Static-only hosts will not serve the API. Deploy to a Node-compatible platform (Railway, Render, Fly.io, etc.) or use serverless functions for API routes.

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Express + Vite dev server |
| `npm run build` | Build frontend to `dist/` |
| `npm run start` | Production server (requires build first) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create/run migrations |
| `npm run db:seed` | Seed demo data |
| `npm run lint` | Run ESLint |

---

## Authentication

Two accounts are supported:

| Account | Username | Role | Data scope | Delete |
|---------|----------|------|------------|--------|
| Owner | `OWNER_USERNAME` (env) | `owner` | `Default` | Allowed |
| Demo | `Demo` | `demo` | `Demo` | Blocked (403) |

- Sessions use HTTP-only cookies — no JWT or OAuth
- Unauthenticated access to `/dashboard/*` redirects to `/login`
- Demo users see only fictional seeded data and cannot delete records

---

## Documentation

All dashboard documentation lives in `docs/`. Start with the core architecture guide:

| Document | Description |
|----------|-------------|
| [**Sree Dev Tool — Core Architecture**](./docs/SREE_DEV_TOOL.md) | Entry point — module registry, shared patterns, extension checklist |
| [Project Management Dashboard](./docs/PROJECT_MANAGEMENT_DASHBOARD.md) | Projects, payments, notes, invoices, analytics |
| [Credential Management Dashboard](./docs/CREDENTIAL_MANAGEMENT_DASHBOARD.md) | Credentials vault, categories, demo data |
| [Finance Management Dashboard](./docs/FINANCE_MANAGEMENT_DASHBOARD.md) | Finance Hub — EMI, rent, subscriptions, PDF reports |
| [Resume Dashboard](./docs/RESUME_DASHBOARD.md) | LaTeX editor, live preview, compile & export |
| [Dev Utilities Dashboard](./docs/DEV_UTILITIES_DASHBOARD.md) | Developer tools hub, registry, favorites |
| [Developer Playground](./docs/PLAYGROUND.md) | Monaco IDE, sandboxed execution, registries |

### Module types

| Type | Backend | Examples |
|------|---------|----------|
| **Full-stack** | Prisma + API routes | Projects, Credentials, Finance, Budget |
| **Hybrid** | Partial API + client logic | Resume, Dev Utilities |
| **Client-only** | Browser storage only | Playground |

See [Adding a New Module](./docs/SREE_DEV_TOOL.md#adding-a-new-module-checklist) for the full onboarding checklist.

---

## Project Structure

```
Developer-Portfolio/
├── docs/                    # Module documentation
├── prisma/                  # Schema & seed data
├── public/                  # Static assets (branding, latex.js vendor)
├── server/                  # Express API
│   ├── auth/                # Session users & config
│   ├── routes/              # REST endpoints per module
│   ├── services/            # Business logic
│   ├── repositories/        # Prisma data access
│   ├── finance/             # Shared finance engine & PDF templates
│   ├── invoice/             # Project invoice PDF generation
│   └── resume/              # LaTeX compile & normalization
├── src/
│   ├── pages/               # Public portfolio pages
│   ├── components/          # Shared UI (shadcn/ui, 3D scenes)
│   └── app/                 # Dashboard application
│       ├── routes/dashboard/    # Module pages
│       ├── components/          # Dashboard UI
│       ├── playground/          # Client-only IDE module
│       └── lib/                 # API client, types, registries
└── api/                     # Vercel serverless entry (if used)
```

---

## Security Notes

- Never commit `.env` or real credentials to the repository
- Change `SESSION_SECRET` and owner credentials before production deployment
- Credentials and sensitive data are scoped by session `dataType` in PostgreSQL
- Passwords are masked in the UI; reveal requires explicit user action
- Financial totals are computed server-side only — never trusted from the client
- Demo credentials are intentionally fictional and seeded with `type = Demo`

---

## License

Private project — all rights reserved.
