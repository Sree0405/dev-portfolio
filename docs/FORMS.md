# Forms Module

Contact form submission management for **Sree Dev Tool**. Captures inquiries from the public contact page, supports manual entries from the dashboard, and keeps owner/demo data isolated.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Overview

- Public contact page submissions are saved via `POST /api/contact` (always stored as `Default` / real data)
- Dashboard **Forms** module lists submissions with search, status filter, and pagination
- Owner (`Default`) sees only real submissions; Demo account sees fictional seeded entries only
- View modal shows full details and marks `new` submissions as `read`

---

## Route & Navigation

| Item | Value |
|------|-------|
| Dashboard route | `/dashboard/forms` |
| Public contact page | `/contact` |
| Public API | `POST /api/contact` |
| Dashboard API | `/api/forms` |

---

## Database Schema

```prisma
model ContactFormSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String   @db.Text
  source    String   @default("contact_page")
  status    String   @default("new")
  type      DataType @default(Default)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Field | Notes |
|-------|-------|
| `source` | `contact_page` or `dashboard` |
| `status` | `new`, `read`, `archived` |
| `type` | `Default` = owner/real, `Demo` = seeded showcase data |

---

## Data Isolation

| Account | Sees | Can delete |
|---------|------|------------|
| Owner | `type = Default` only | Yes |
| Demo | `type = Demo` only | No (403) |

Public contact submissions always use `type = Default`, so they appear only in the owner dashboard.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contact` | No | Save contact page submission |
| GET | `/api/forms` | Yes | Paginated list (`search`, `status`, `page`, `pageSize`) |
| GET | `/api/forms/:id` | Yes | Details (marks `new` → `read`) |
| POST | `/api/forms` | Yes | Manual add (uses session `dataType`) |
| PUT | `/api/forms/:id` | Yes | Update status/fields |
| DELETE | `/api/forms/:id` | Yes | Delete (blocked for demo) |

---

## File Reference

| Layer | Path |
|-------|------|
| Prisma model | `prisma/schema.prisma` |
| Repository | `server/repositories/formRepository.ts` |
| Service | `server/services/formService.ts` |
| Routes | `server/routes/contact.ts`, `server/routes/forms.ts` |
| Dashboard page | `src/app/routes/dashboard/forms/FormsPage.tsx` |
| Contact page | `src/components/Contact.tsx` |
| Form UI | `src/app/components/Forms/FormSubmissionForm.tsx` |
| List card | `src/app/components/Common/FormListCard.tsx` |
| Seed data | `prisma/seed.ts` |

---

## Demo Seed

Run `npm run db:seed` to create 12 fictional demo submissions (`type = Demo`). These are cleared and recreated on each seed run.
