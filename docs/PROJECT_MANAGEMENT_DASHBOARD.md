# Project Management Dashboard

Full-stack project management module integrated into the existing React portfolio application. Frontend and backend run together on **one port** (`8080` by default).

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md) · **Related module:** [Credential Management](./CREDENTIAL_MANAGEMENT_DASHBOARD.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Environment Variables](#environment-variables)
6. [Getting Started](#getting-started)
7. [Authentication](#authentication)
8. [Database Schema](#database-schema)
9. [Business Logic](#business-logic)
10. [API Endpoints](#api-endpoints)
11. [Frontend Routes](#frontend-routes)
12. [UI Features](#ui-features)
13. [Production Deployment](#production-deployment)
14. [Future Scalability](#future-scalability)
15. [Development Plan (Completed)](#development-plan-completed)

---

## Overview

This module adds a secure internal dashboard for managing:

- **Projects** — CRUD with search, sort, and pagination
- **Payments** — per-project payment tracking with automatic total recalculation
- **Notes** — per-project notes with timestamps

### Key constraints

| Requirement | Implementation |
|---|---|
| No separate backend project | Express server lives in `server/` |
| Same port for frontend + API | Custom Express server with Vite middleware (dev) or static serving (prod) |
| Neon PostgreSQL | Connected via `DATABASE_URL` in `.env` |
| Prisma ORM | Schema in `prisma/schema.prisma` |
| Session auth (no JWT/OAuth) | `express-session` with HTTP-only cookies |
| Backend owns all totals | `totalPaid` and `remainingAmount` computed server-side only |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack React Query |
| Notifications | Sonner toasts |
| Backend | Express 4 |
| ORM | Prisma 6 |
| Database | Neon PostgreSQL |
| Auth | express-session + cookie-parser |

---

## Architecture

```
Browser
   │
   ▼
Express Server (port 8080)
   ├── /api/*          → REST API (auth, projects, payments, notes)
   └── /*              → Vite dev middleware (dev) or static dist (prod)
           │
           ▼
       React SPA
           │
           └── fetch("/api/...") with credentials: "include"
```

### Layered backend design

```
server/
├── routes/         HTTP handlers
├── services/       Business logic
├── repositories/   Prisma data access
├── middleware/     Auth + error handling
├── auth/           Static credential config
└── lib/            Validation + serializers
```

---

## Folder Structure

```
prisma/
└── schema.prisma

server/
├── index.ts
├── auth/
│   └── config.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── prisma/
│   └── client.ts
├── repositories/
│   ├── projectRepository.ts
│   ├── paymentRepository.ts
│   └── noteRepository.ts
├── services/
│   ├── projectService.ts
│   ├── paymentService.ts
│   └── noteService.ts
├── routes/
│   ├── index.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── payments.ts
│   └── notes.ts
├── lib/
│   ├── validation.ts
│   └── serializers.ts
└── types/
    └── express-session.d.ts

src/app/
├── lib/
│   ├── api.ts
│   ├── constants.ts
│   ├── format.ts
│   ├── types.ts
│   └── validation.ts
├── routes/
│   ├── login/
│   │   └── LoginPage.tsx
│   └── dashboard/
│       ├── layout/
│       │   └── DashboardLayout.tsx
│       └── projects/
│           ├── ProjectsPage.tsx
│           └── ProjectDetailsPage.tsx
└── components/
    ├── Common/
    ├── Dashboard/
    ├── Sidebar/
    ├── Table/
    ├── Modal/
    └── Forms/

docs/
└── PROJECT_MANAGEMENT_DASHBOARD.md
```

---

## Environment Variables

Create or update `.env` in the project root:

```env
DATABASE_URL=postgresql://...your-neon-connection-string...
SESSION_SECRET=your-secure-random-secret
PORT=8080
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `SESSION_SECRET` | Yes (prod) | Secret for signing session cookies |
| `PORT` | No | Server port (default: `8080`) |
| `NODE_ENV` | No | Set to `production` for prod builds |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client & sync database

```bash
npm run db:generate
npm run db:push
```

For migration-based workflows:

```bash
npm run db:migrate
```

### 3. Start development server

```bash
npm run dev
```

Open:

- Portfolio: `http://localhost:8080/`
- Login: `http://localhost:8080/login`
- Dashboard: `http://localhost:8080/dashboard/projects`

### 4. Production build

```bash
npm run build
npm run start
```

---

## Authentication

### Login page

**Route:** `/login`

### Static credentials

| Field | Value |
|---|---|
| Username | `Sree` |
| Password | `Srxx.im` |

### Behavior

- Session stored in HTTP-only cookie (`connect.sid`)
- No JWT, no OAuth
- `POST /api/logout` destroys the session
- Unauthenticated access to `/dashboard/*` redirects to `/login`
- After login, redirects to `/dashboard/projects`

### Protected routes

All `/api/projects`, `/api/payments`, and `/api/notes` endpoints require an active session.

---

## Database Schema

### Project

```prisma
model Project {
  id            String   @id @default(cuid())
  name          String
  clientName    String
  clientNumber  String?
  projectLinks  String?
  projectType   String
  status        String
  plannedAmount Decimal  @db.Decimal(12, 2)
  totalPaid     Decimal  @default(0) @db.Decimal(12, 2)
  payments      Payment[]
  notes         ProjectNote[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Payment

```prisma
model Payment {
  id            String   @id @default(cuid())
  projectId     String
  project       Project  @relation(...)
  amount        Decimal  @db.Decimal(12, 2)
  paymentMethod String
  reference     String?
  notes         String?
  paymentDate   DateTime
  createdAt     DateTime @default(now())
}
```

### ProjectNote

```prisma
model ProjectNote {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(...)
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Business Logic

### Remaining amount

**Never stored in the database.** Always computed on the server:

```
remainingAmount = plannedAmount - totalPaid
```

Returned in every project API response via `server/lib/serializers.ts`.

### Payment total recalculation

Whenever a payment is **created**, **updated**, or **deleted**, the backend:

1. Runs `SELECT SUM(amount)` for the project
2. Updates `Project.totalPaid`
3. Returns the updated project (with recalculated `remainingAmount`)

Implemented in `server/services/paymentService.ts`.

### Frontend rule

The frontend **never** calculates financial totals. It displays values returned by the API.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Login with username/password |
| `POST` | `/api/logout` | Destroy session |
| `GET` | `/api/me` | Get current session user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List projects (search, sort, pagination) |
| `GET` | `/api/projects/:id` | Get project by ID |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

**Query params for list:** `search`, `sortBy`, `sortOrder`, `page`, `pageSize`

### Payments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/:id/payments` | List payments (newest first) |
| `POST` | `/api/projects/:id/payments` | Add payment + recalculate totals |
| `PUT` | `/api/payments/:id` | Update payment + recalculate totals |
| `DELETE` | `/api/payments/:id` | Delete payment + recalculate totals |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Aggregated analytics (stats, charts, recent activity) |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/:id/notes` | List notes (newest first) |
| `POST` | `/api/projects/:id/notes` | Create note |
| `PUT` | `/api/notes/:id` | Update note |
| `DELETE` | `/api/notes/:id` | Delete note |

### Invoice

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/:id/invoice` | Download project invoice as PDF |

**Response headers:**
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="Invoice_<ProjectName>.pdf"`

---

## Invoice Generation (PDF)

Professional PDF invoices can be downloaded from the **Project Details** page via the **Download Invoice** button.

### Architecture

```
server/invoice/
├── config.ts                    # Branding, colors, spacing
├── assets.ts                    # Logo path resolver
├── format.ts                    # Currency/date formatting
├── invoiceNumber.ts             # Deterministic INV-000001 sequence
├── types.ts                     # InvoiceData interface
└── template/
    ├── context.ts               # Shared layout utilities
    ├── renderInvoice.ts         # Orchestrator
    ├── InvoiceHeader.ts         # Logo, business info, invoice meta
    ├── InvoiceClientCard.ts     # Bill To / From cards
    ├── InvoiceProjectCard.ts    # Project summary card
    ├── InvoiceFinancialSummary.ts
    ├── InvoicePaymentsTable.ts
    ├── InvoiceNotes.ts
    ├── InvoiceSummary.ts
    └── InvoiceFooter.ts         # Footer + page numbers
```

Business logic lives in `server/services/invoiceService.ts`. Each template component is isolated for easy customization (logo, GST, tax, themes).

### Design

- Premium Stripe/FreshBooks-inspired layout on A4 portrait
- Official logo from `public/branding/sreeBrandLogo.png`
- Clickable website link (`https://sreefolio.vercel.app`)
- Consistent 48px margins and uniform section spacing
- Modern rounded cards with light backgrounds
- Professional typography hierarchy (Helvetica)
- Color palette: dark gray text, accent blue, status badges (green/orange)
- Dynamic row heights with text wrapping (no overflow)
- Multi-page support with `Page X of Y` footer
- 4% diagonal watermark

### Invoice contents

- Company header (Sreekanth Freelancing)
- Invoice number, date, generated date
- Client & project details
- Project summary & financial summary card
- Payment history table (zebra-striped, newest first)
- Project notes (newest first)
- Invoice summary with highlighted remaining amount
- Payment status badge (`Paid` / `Partially Paid`)
- Footer with generation timestamp
- 5% watermark background

### Invoice number

Deterministic per project based on creation order: `INV-000001`, `INV-000002`, etc. The same project always receives the same invoice number.

### Branding config

Edit `server/invoice/config.ts` to update company name, tagline, website, email, phone, and location.

---

## Frontend Routes

| Route | Page | Auth |
|---|---|---|
| `/login` | Login | Public |
| `/dashboard` | Analytics overview (default landing) | Protected |
| `/dashboard/projects` | Projects table + CRUD | Protected |
| `/dashboard/projects/:id` | Project details, payments, notes | Protected |

### Dashboard Analytics

**Route:** `/dashboard` (default after login)

**API:** `GET /api/dashboard` — single request returns all stats, charts data, recent activity.

Sections:
- 8 statistic cards (projects, amounts, status counts)
- Money Yet To Receive highlight card
- Financial insights (collection rate, averages, top projects)
- Donut chart: received vs pending
- Pie chart: project status distribution
- Bar chart: revenue by project
- Line chart: monthly payments
- Latest projects table with progress bars
- Recent payments & notes

### Dashboard layout

```
DashboardLayout
├── Sidebar (sticky)
├── Header (sticky)
└── Main Content (Outlet)
```

---

## UI Features

- Modern dashboard UI using existing design system
- Sticky sidebar and header
- Responsive layout with mobile drawer sidebar
- Search projects (debounced)
- Sort by column + order
- Pagination (10 per page)
- Empty states
- Loading skeletons
- Confirmation dialogs for deletes
- Toast notifications (Sonner)
- Zod form validation
- Reusable `AppModal`, `DataTable`, and form components

### Project form fields

| Field | Required |
|---|---|
| Project Name | Yes |
| Client Name | Yes |
| Client Number | No |
| Project Type | No (defaults to Fixed Cost) |
| Status | No (defaults to Planning) |
| Total Planned Amount | Yes |

### Status options

`Planning`, `In Progress`, `Completed`, `On Hold`, `Cancelled`

### Project type options

`Fixed Cost`, `Hourly`, `Maintenance`, `Internal`, `Other`

### Payment methods

`Cash`, `Bank Transfer`, `UPI`, `Cheque`, `Other`

---

## Production Deployment

This app requires a **Node.js server** (Express). Static-only hosts (e.g. default Vercel static deploy) will **not** serve the API.

### Recommended approach

1. Build frontend: `npm run build`
2. Run server: `npm run start` (sets `NODE_ENV=production`)
3. Express serves `dist/` static files + `/api/*` routes on the same port

### Vercel note

The existing `vercel.json` only handles SPA rewrites. For production API support on Vercel, you would need serverless functions or deploy the Express app to a Node-compatible platform (Railway, Render, Fly.io, etc.).

---

## Future Scalability

The dashboard layout and sidebar are designed for plug-in modules:

- Dashboard Overview
- Clients
- Invoices
- Expenses
- Tasks
- Team Members
- Time Tracking
- Reports
- Analytics
- Documents
- Calendar
- Reminders

To add a module:

1. Add a sidebar item in `DashboardSidebar.tsx`
2. Create a route under `src/app/routes/dashboard/`
3. Add API routes under `server/routes/`
4. Follow the repository → service → route pattern

---

## Development Plan (Completed)

- [x] Configure Prisma with Neon `DATABASE_URL`
- [x] Create Prisma schema (Project, Payment, ProjectNote)
- [x] Generate Prisma client
- [x] Push schema to Neon PostgreSQL
- [x] Session-based authentication with static credentials
- [x] Protected frontend and API routes
- [x] Reusable dashboard layout (sidebar + header)
- [x] Projects CRUD with search, sort, pagination
- [x] Project details page
- [x] Payments CRUD with automatic `totalPaid` recalculation
- [x] Notes CRUD
- [x] Validation, loading states, toasts, confirmation dialogs
- [x] Reusable components (Modal, Table, Forms)
- [x] Single-port Express + Vite integration
- [x] Documentation

---

## NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Express + Vite dev server |
| `npm run build` | Build frontend to `dist/` |
| `npm run start` | Production server (requires build first) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create/run migrations |

---

## Security Notes

- Change `SESSION_SECRET` before production deployment
- Static credentials are suitable for internal/single-user use only
- Session cookies are `httpOnly` and `secure` in production
- All API routes validate input with Zod on the server
- Financial calculations are never trusted from the client
