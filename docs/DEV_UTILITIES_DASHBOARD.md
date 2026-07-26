# Dev Utilities Dashboard

Collection of small, frequently used developer tools for **Sree Dev Tool**.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Route & Navigation](#route--navigation)
3. [Database Schema](#database-schema)
4. [Authentication Rules](#authentication-rules)
5. [API Endpoints](#api-endpoints)
6. [Utilities Catalog](#utilities-catalog)
7. [Frontend Features](#frontend-features)
8. [Adding a New Utility](#adding-a-new-utility)
9. [File Reference](#file-reference)

---

## Overview

Dev Utilities provides a hub of client-side developer tools with:

- Responsive **grid layout** with search
- **Favorites** (star toggle, persisted per workspace)
- **Recently used** utilities (last 10, persisted per workspace)
- **Copy-to-clipboard** on supported tools
- Individual tool pages with consistent shell UI
- Modular registry — new utilities can be added without restructuring the module

**Important:** Tool inputs and generated outputs are **not** stored in the database. Only favorites and recent-usage metadata are persisted.

---

## Route & Navigation

| Item | Value |
|------|-------|
| Hub route | `/dashboard/dev-utilities` |
| Tool route | `/dashboard/dev-utilities/:utilityId` |
| Sidebar label | Dev Utilities |
| API base | `/api/dev-utilities` |

Sidebar and mobile **More** menu include Dev Utilities.

---

## Database Schema

```prisma
model DevUtilityFavorite {
  id        String   @id @default(cuid())
  utilityId String
  type      DataType @default(Default)
  createdAt DateTime @default(now())

  @@unique([type, utilityId])
  @@index([type])
}

model DevUtilityRecent {
  id        String   @id @default(cuid())
  utilityId String
  type      DataType @default(Default)
  usedAt    DateTime @default(now())

  @@index([type, usedAt])
}
```

Both tables scope by `DataType` (`Default` | `Demo`) so Demo and Owner workspaces keep separate favorites and history.

---

## Authentication Rules

### Owner (Free user)

- Full access to all utilities
- Favorites and recent usage saved under `type = Default`

### Demo (`Demo`)

- Full access to all utilities (same tools as owner)
- Favorites and recent usage saved under `type = Demo`
- **No delete restrictions** — utilities are tools, not deletable records

Demo banner on the hub page explains that preferences are saved for the demo workspace.

---

## API Endpoints

All routes require session authentication (`requireAuth`).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/dev-utilities/preferences` | Get favorites + recent utility IDs |
| `PUT` | `/api/dev-utilities/favorites/:utilityId` | Toggle favorite |
| `POST` | `/api/dev-utilities/recent/:utilityId` | Record utility usage (trim to 10) |

### Preferences response

```json
{
  "favorites": ["json-formatter", "jwt-decoder"],
  "recent": ["uuid-generator", "base64-codec", "json-formatter"]
}
```

### Toggle favorite response

```json
{
  "utilityId": "json-formatter",
  "isFavorite": true
}
```

Valid `utilityId` values are enforced server-side via `devUtilityIdSchema` (Zod enum).

---

## Utilities Catalog

| ID | Name | Category |
|----|------|----------|
| `json-formatter` | JSON Formatter & Validator | Data |
| `jwt-decoder` | JWT Decoder | Security |
| `uuid-generator` | UUID Generator | Data |
| `base64-codec` | Base64 Encode / Decode | Data |
| `url-codec` | URL Encode / Decode | Web |
| `password-generator` | Password Generator | Security |
| `qr-code-generator` | QR Code Generator | Web |
| `unix-timestamp` | Unix Timestamp Converter | Time |
| `markdown-preview` | Markdown Preview | Text |
| `sql-formatter` | SQL Formatter | Data |
| `html-preview` | HTML Preview | Web |
| `regex-tester` | Regex Tester | Text |

Registry source of truth: `src/app/lib/devUtilities/registry.ts`  
Server validation mirror: `server/lib/devUtilityIds.ts`

---

## Frontend Features

### Hub page (`DevUtilitiesHubPage.tsx`)

- Search across name, description, category, and keywords
- **Favorites** section (when not searching)
- **Recently Used** compact cards
- **All Utilities** grid
- Star toggle on each card

### Tool page (`DevUtilityPage.tsx`)

- Back link to hub
- Favorite toggle in header
- Auto-records recent usage on open
- Renders tool component from `utilityComponentMap.ts`

### Shared components

| Component | Purpose |
|-----------|---------|
| `DevUtilityCard` | Grid / compact card |
| `CopyButton` | Clipboard copy with toast |
| `UtilityToolShell` | Consistent tool layout |
| `DevUtilityTools.tsx` | All 12 tool implementations |

---

## Adding a New Utility

1. Add entry to `DEV_UTILITIES` in `src/app/lib/devUtilities/registry.ts`
2. Add matching ID to `DEV_UTILITY_IDS` in `server/lib/devUtilityIds.ts`
3. Implement tool component in `src/app/components/DevUtilities/DevUtilityTools.tsx`
4. Register in `src/app/components/DevUtilities/utilityComponentMap.ts`

No database migration is required for new tools — only registry and component wiring.

---

## File Reference

### Backend

| File | Purpose |
|------|---------|
| `server/routes/devUtilities.ts` | HTTP routes |
| `server/services/devUtilityService.ts` | Preferences logic |
| `server/repositories/devUtilityRepository.ts` | Prisma access |
| `server/lib/devUtilityIds.ts` | Valid utility ID enum |
| `server/lib/validation.ts` | `devUtilityIdSchema` |

### Frontend

| File | Purpose |
|------|---------|
| `src/app/routes/dashboard/devUtilities/DevUtilitiesHubPage.tsx` | Hub page |
| `src/app/routes/dashboard/devUtilities/DevUtilityPage.tsx` | Tool page |
| `src/app/lib/devUtilities/registry.ts` | Utility definitions |
| `src/app/lib/devUtilities/types.ts` | API types |
| `src/app/components/DevUtilities/DevUtilityCard.tsx` | Card UI |
| `src/app/components/DevUtilities/DevUtilityTools.tsx` | Tool implementations |
| `src/app/components/DevUtilities/utilityComponentMap.ts` | ID → component map |
| `src/app/hooks/useCopyToClipboard.ts` | Copy helper |
