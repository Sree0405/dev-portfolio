# Credential Management Dashboard

Secure credentials vault module for **Sree Dev Tool**. Stores and manages website logins, server credentials, database accounts, third-party services, and development-related accounts in one centralized place.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Route & Navigation](#route--navigation)
3. [Database Schema](#database-schema)
4. [Authentication Rules](#authentication-rules)
5. [API Endpoints](#api-endpoints)
6. [Frontend Features](#frontend-features)
7. [Categories & Types](#categories--types)
8. [Demo Data](#demo-data)
9. [Dashboard Integration](#dashboard-integration)
10. [File Reference](#file-reference)

---

## Overview

The Credentials module behaves like a lightweight password manager with:

- Professional table layout (desktop) and card layout (mobile)
- Masked passwords with show/hide toggle
- Copy-to-clipboard for URL, username, and password
- Search and category filtering
- Glassmorphism modals for add/edit
- View details modal with quick actions
- Demo banner for fictional sample data

---

## Route & Navigation

| Item | Value |
|------|-------|
| Frontend route | `/dashboard/credentials` |
| Sidebar label | Credentials |
| API base | `/api/credentials` |

Sidebar order: **Dashboard → Projects → Credentials**

---

## Database Schema

```prisma
model Credential {
  id          String   @id @default(cuid())
  serviceName String
  websiteUrl  String
  username    String
  password    String
  category    String
  notes       String?
  type        DataType @default(Default)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

The `type` field uses the shared `DataType` enum (`Default` | `Demo`) for owner/demo data isolation — same pattern as Projects.

---

## Authentication Rules

### Owner (`Sree`)

- Full CRUD on credentials where `type = Default`
- Delete buttons visible

### Demo (`Demo`)

- Create, read, update on credentials where `type = Demo`
- **Cannot delete** — delete buttons hidden in UI
- Manual `DELETE /api/credentials/:id` returns:

```json
{
  "error": "Deleting demo credentials is disabled."
}
```

HTTP status: **403 Forbidden**

---

## API Endpoints

All routes require session authentication (`requireAuth`).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/credentials` | List credentials (query: `search`, `category`) |
| `GET` | `/api/credentials/:id` | Get single credential |
| `POST` | `/api/credentials` | Create credential |
| `PUT` | `/api/credentials/:id` | Update credential |
| `DELETE` | `/api/credentials/:id` | Delete credential (owner only) |

### Create / Update body

```json
{
  "serviceName": "Vercel",
  "websiteUrl": "https://vercel.com",
  "username": "you@example.com",
  "password": "secret",
  "category": "Hosting",
  "notes": "Optional notes"
}
```

The `type` field is set automatically from the session user's `dataType` — not accepted from the client.

---

## Frontend Features

### Listing layout

Responsive **card grid** (`sm:grid-cols-2`, `xl:grid-cols-3`) using `CredentialListCard` — same pattern as the Projects module. Each card shows:

| Field | Description |
|-------|-------------|
| Logo + service name | Favicon and clickable title |
| Hostname | Truncated website domain |
| Category | Badge |
| Type | Derived label (Dev Account, Hosting, etc.) |
| Username | With copy button |
| Password | Masked with show/hide + copy |
| Last updated | Formatted date |
| Actions | View, Edit, Delete (owner only) |

### Search

Filters by service name, URL, username, or category (case-insensitive).

### Category filter

Dropdown with **All Categories** plus every category from `CREDENTIAL_CATEGORIES`.

### View modal

Shows full credential details with:

- Open Website
- Copy Username
- Copy Password

### Demo notice

When logged in as Demo, an info banner explains that all credentials are fictional.

---

## Categories & Types

### Categories (stored on record)

`Development`, `Hosting`, `Database`, `Server`, `Domain`, `Email`, `Cloud`, `API`, `Personal`, `Finance`, `Social`, `Payment Gateway`, `Analytics`, `Other`

### Type column (display label)

Derived from category via `getCategoryTypeLabel()`:

| Category | Display type |
|----------|--------------|
| Development | Dev Account |
| Hosting | Hosting |
| Database | Database |
| API | API Key |
| Payment Gateway | Payment |
| … | … |

### Data type (isolation)

`Default` — owner real credentials  
`Demo` — seeded fictional credentials

---

## Demo Data

Run `npm run db:seed` to populate 12 fictional demo credentials (Vercel, Render, Neon, GitHub, Cloudflare, Railway, Firebase, Supabase, Docker Hub, DigitalOcean, AWS, Azure).

All use:

- `username`: `demo@<service>.com` (or similar)
- `password`: `DemoPassword@2026`
- `type`: `Demo`
- `notes`: Fictional demo disclaimer

---

## Dashboard Integration

The main dashboard (`/dashboard`) includes a **Stored Credentials** stat card counting credentials for the current user's `dataType`.

---

## File Reference

| Layer | Path |
|-------|------|
| Prisma model | `prisma/schema.prisma` |
| Seed data | `prisma/seed.ts` |
| Validation | `server/lib/validation.ts` |
| Categories | `server/lib/credentialCategories.ts` |
| Repository | `server/repositories/credentialRepository.ts` |
| Service | `server/services/credentialService.ts` |
| Routes | `server/routes/credentials.ts` |
| Page | `src/app/routes/dashboard/credentials/CredentialsPage.tsx` |
| List card | `src/app/components/Common/CredentialListCard.tsx` |
| Form | `src/app/components/Forms/CredentialForm.tsx` |
| Copy button | `src/app/components/Common/CopyButton.tsx` |
| Service logo | `src/app/lib/serviceLogo.ts` |
| API client | `src/app/lib/api.ts` |
| Types | `src/app/lib/types.ts` |
| Constants | `src/app/lib/constants.ts` |
