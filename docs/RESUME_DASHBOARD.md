# Resume Dashboard

Overleaf-style LaTeX resume editor with live browser preview and PDF export for **Sree Dev Tool**.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Route & Navigation](#route--navigation)
3. [Database Schema](#database-schema)
4. [Authentication Rules](#authentication-rules)
5. [API Endpoints](#api-endpoints)
6. [Frontend Features](#frontend-features)
7. [Supported LaTeX Packages](#supported-latex-packages)
8. [Preview Engine](#preview-engine)
9. [Demo Data](#demo-data)
10. [File Reference](#file-reference)

---

## Overview

The Resume module lets users create, edit, save, and export professional resumes using LaTeX. It includes:

- Split-pane editor with **CodeMirror** (LaTeX syntax highlighting)
- **Live A4 PDF preview** powered by `latex.js` in the browser
- **Save** with optional client-generated PDF attachment (`Ctrl+S`)
- **Compile** (server LaTeX when available; falls back to preview PDF)
- **Download PDF** from saved compile or live preview
- Curated **supported package set** for reliable browser preview
- Demo banner and delete restrictions for the Demo account

Temporary editor input is held in React state only. Only resume metadata, LaTeX source, and optional compiled PDF bytes are persisted.

---

## Route & Navigation

| Item | Value |
|------|-------|
| List route | `/dashboard/resume` |
| Editor route | `/dashboard/resume/:id` |
| Sidebar label | Resume |
| API base | `/api/resumes` |

Sidebar order includes **Resume** after Credentials. Mobile overflow menu also links to Resume.

---

## Database Schema

```prisma
model Resume {
  id             String    @id @default(cuid())
  title          String
  description    String?
  latexSource    String    @db.Text
  compileStatus  String    @default("idle")
  compileLog     String?   @db.Text
  compiledPdf    Bytes?
  pdfFilename    String?
  lastCompiledAt DateTime?
  type           DataType  @default(Default)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([type, updatedAt])
}
```

The `type` field uses the shared `DataType` enum (`Default` | `Demo`) for owner/demo data isolation.

---

## Authentication Rules

### Owner (Free user)

- Full create, read, update, save, compile, and download on resumes where `type = Default`
- Delete allowed

### Demo (`Demo`)

- Create, read, update, save, compile, and download on resumes where `type = Demo`
- **Cannot delete** — delete buttons hidden in UI
- Manual `DELETE /api/resumes/:id` returns:

```json
{
  "error": "Deleting demo resumes is disabled."
}
```

HTTP status: **403 Forbidden**

---

## API Endpoints

All routes require session authentication (`requireAuth`).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/resumes` | List resumes (query: `search`) |
| `GET` | `/api/resumes/:id` | Get single resume |
| `POST` | `/api/resumes` | Create resume |
| `PUT` | `/api/resumes/:id` | Update metadata / LaTeX source |
| `PUT` | `/api/resumes/:id/save` | Save LaTeX + optional preview PDF (base64) |
| `POST` | `/api/resumes/:id/compile` | Server LaTeX compile (501/422 → client preview fallback) |
| `GET` | `/api/resumes/:id/pdf` | Download compiled PDF |
| `DELETE` | `/api/resumes/:id` | Delete resume (owner only) |

### Create body

```json
{
  "title": "My Resume",
  "description": "Optional",
  "latexSource": "\\documentclass{article}..."
}
```

If `latexSource` is omitted, the default template is applied server-side.

### Save body

```json
{
  "title": "My Resume",
  "latexSource": "...",
  "compiledPdfBase64": "optional base64 PDF from preview"
}
```

Request body limit is **15 MB** to support PDF attachments from the preview engine.

---

## Frontend Features

### List page (`ResumesPage.tsx`)

- Search with debounce
- Card grid with compile status badge
- Create modal with default LaTeX template
- Delete confirmation (owner only)

### Editor page (`ResumeEditorPage.tsx`)

- Resizable split panels: LaTeX source + live preview
- `Ctrl+S` saves and refreshes preview PDF
- Error line highlighting in CodeMirror
- A4 preview with zoom / fit-to-page
- Demo mode banner when logged in as Demo

### Key UI components

| Component | Path |
|-----------|------|
| `ResumeLatexWorkspace` | `src/app/components/Resume/ResumeLatexWorkspace.tsx` |
| `LatexEditor` | CodeMirror LaTeX editor |
| `LatexPreview` | Browser preview + PDF export |

---

## Supported LaTeX Packages

The default template uses a curated package set defined in `src/app/lib/resume/supportedPackages.ts`. Stick to these packages in the preamble for reliable browser preview.

| Package | Preview behavior |
|---------|------------------|
| `geometry` | Emulated — margins via CSS |
| `parskip` | Emulated — paragraph spacing |
| `titlesec` | Emulated — section rules & spacing |
| `enumitem` | Emulated — list options via CSS |
| `hyperref` | Native — `\href` / `\url` work |
| `xcolor` | Emulated — colors from `\definecolor` |
| `fontawesome5` | Replaced — `\fa*` icons → plain glyphs |

Server PDF compile (when TeX Live is installed) uses packages natively. Browser preview strips or emulates incompatible preamble commands while preserving document body content.

---

## Preview Engine

Preview pipeline (`prepareLatexForPreview`):

1. Normalize LaTeX source
2. Strip incompatible preamble packages
3. Replace Font Awesome macros with glyphs
4. Apply custom macros (`\hfill`, `\hrule`, etc.)
5. Parse preamble theme → CSS variables (margins, fonts, section spacing)
6. Render via `latex.js` (`public/vendor/latex.js/latex.js`)

PDF download uses `html2pdf.js` on the rendered A4 preview page.

---

## Demo Data

`prisma/seed.ts` creates one demo resume:

- Title: **Alex Developer — Demo Resume**
- Template: same supported package set as the default, with placeholder content
- `type = Demo`

Owner accounts start with an empty `Default` resume list until they create one.

---

## File Reference

### Backend

| File | Purpose |
|------|---------|
| `server/routes/resumes.ts` | HTTP routes |
| `server/services/resumeService.ts` | Business logic |
| `server/repositories/resumeRepository.ts` | Prisma access |
| `server/resume/defaultTemplate.ts` | Default + demo LaTeX bodies |
| `server/resume/supportedPackages.ts` | Shared preamble builder |
| `server/resume/normalizeLatex.ts` | Server-side LaTeX normalization |
| `server/resume/latexCompile.ts` | Optional server pdflatex |
| `server/lib/validation.ts` | `createResumeSchema`, `saveResumeSchema` |

### Frontend

| File | Purpose |
|------|---------|
| `src/app/routes/dashboard/resume/ResumesPage.tsx` | List page |
| `src/app/routes/dashboard/resume/ResumeEditorPage.tsx` | Editor page |
| `src/app/components/Resume/ResumeLatexWorkspace.tsx` | Editor + preview workspace |
| `src/app/lib/resume/defaultTemplate.ts` | Default template |
| `src/app/lib/resume/supportedPackages.ts` | Package registry + preamble |
| `src/app/lib/resume/normalizeLatex.ts` | Preview preprocessing |
| `src/app/lib/resume/latexPreviewEngine.ts` | Parse + render to DOM |
| `src/app/lib/resume/resumePreambleParser.ts` | Theme → CSS variables |
| `src/app/lib/resume/types.ts` | TypeScript types |
