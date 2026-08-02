# Pending — user-blocked + parked work

> **For the next session:** Fill Answer blocks below. Do **not** invent metrics, quotes, traffic, or revenue. Wire only what the user pastes.

**Hiring score context:** ~7.7 / 10. Next real jump (~8.0+) needs sections A–C below.

---

## A. Action queue (do these when unblocked)

### A1. Public resume PDF (parked — needs LaTeX or Dev Tool)

- [ ] Replace [`public/resume/Sreekanth_SDE.pdf`](public/resume/Sreekanth_SDE.pdf) so download matches aligned templates
- Templates already updated: `server/resume/defaultTemplate.ts`, `src/app/lib/resume/defaultTemplate.ts`
- Local compile failed: `pdflatex` missing (`npm run resume:compile-public` → `LATEX_NOT_INSTALLED`)
- **How:** Dev Tool → Resume → use new default / compile → overwrite `public/resume/Sreekanth_SDE.pdf`  
  Or install a TeX distribution, then `npm run resume:compile-public`

### A2. Hard Experience metrics (EWall platform) — see §1–§4 below

### A3. Named stakeholder quote — see §3 below

### A4. Dev Tool GitHub framing — done (monorepo)

- Sree Dev Tool has **no separate repo** — source is [`github.com/Sree0405/dev-portfolio`](https://github.com/Sree0405/dev-portfolio)
- Portfolio now links Code / case study to that monorepo; copy clarifies ops **data** stays private via demo isolation
- Optional later: README section in the monorepo pointing reviewers at `server/` + `src/app/` for the dashboard

---

## B. Done recently (do not redo)

- Resume LaTeX defaults aligned with portfolio (platform modules, 2 named clients, Dev Tool / My3DUI / Fieldstack)
- Contact **Before we talk** interview path
- Case-study tradeoffs deepened (Dev Tool / My3DUI / Fieldstack)
- Reviews module (auto-publish + Dev Tool Show/Hide)
- Phase 4: Dev Tool case study **Where to review code** links

---

## C. Office / EWall platform hard evidence (fill below)

**Related files (wire targets when answers arrive):**
- [`src/components/experience/Experience.tsx`](src/components/experience/Experience.tsx) — EWall stats, Junior/Intern impact bullets
- [`src/components/experience/ExperienceHero.tsx`](src/components/experience/ExperienceHero.tsx) — hero highlights
- [`src/components/About.tsx`](src/components/About.tsx) — About ownership line
- [`src/components/hero/heroData.ts`](src/components/hero/heroData.ts) — hero description / meta (only if numbers fit)
- [`src/components/portfolio/DocumentMeta.tsx`](src/components/portfolio/DocumentMeta.tsx) — `/experience` description if needed

**Already on the site (do not weaken; only strengthen with verified numbers):**
- Kitchen Module — end-to-end ownership
- Voting Module
- Contract & Location Management
- Timezone Management
- Campaign Module + ScreenCloud + Print System
- Auth / RBAC edges
- Dense admin perf (memoization, lazy routes, code splitting)
- Linux deploy via Nginx + PM2
- Mentoring / code review (qualitative — needs count if possible)
- Path: Intern (May 2025 — Aug 2025) → Junior (Aug 2025 — Present)

---

## Status legend

- `[ ]` awaiting user answer
- `[x]` answered — ready to implement
- `[~]` partial / needs clarification
- `[done]` wired into the portfolio

---

## 1. EWall platform — modules & ownership

### 1.1 Module list you fully owned (confirm / edit)

```
Answer:
- Kitchen: 
- Voting: 
- Contract & Location: 
- Timezone: 
- Campaign + ScreenCloud + Print: 
- Auth / RBAC (shared edges): 
- Other modules (name them): 
```

### 1.2 Count of modules / screens you can defend in interview

```
Answer:
- Modules owned end-to-end (number): 
- Named list (final): 
- Anything you did NOT own (so we don't overclaim): 
```

### 1.3 Kitchen Module — deeper proof (optional but high ROI)

```
Answer:
- What kitchen operators do in the module (1–2 sentences): 
- Hardest bug or constraint you fixed: 
- UI / API / DB pieces you personally wrote: 
- Still pending / unfinished Kitchen work (if any): 
```

---

## 2. Hard metrics (do not invent)

### 2.1 Team & mentoring

```
Answer:
- Team size you worked with day to day: 
- Freshers / juniors you mentored (number): 
- Code review: roughly how often (e.g. weekly): 
```

### 2.2 Release / deploy

```
Answer:
- Typical release cadence (e.g. weekly / as-needed): 
- Your role in release (build, deploy yourself, hand off, etc.): 
- Confirm stack: Nginx + PM2 + Linux (yes/no / nuance): 
```

### 2.3 Production scope (only safe claims)

```
Answer:
- Live in client / ops environments? (yes/no + wording you're OK saying): 
- Any safe numeric signal (users, locations, campaigns, tickets reduced)? 
  Only if you can defend it in interview — otherwise leave blank:
- 
```

### 2.4 Timeline confirmations

```
Answer:
- Intern dates (current site: May 2025 — Aug 2025): OK? 
- Junior dates (current site: Aug 2025 — Present): OK? 
- Company legal name (current: EWall Solutions Pvt. Ltd.): OK? 
```

---

## 3. Named stakeholder quote (optional, high ROI)

```
Answer:
- Quote (exact words you're allowed to publish): 
- Name: 
- Role / title: 
- Company (EWall / client / other): 
- Permission to show publicly on portfolio? (yes/no): 
```

Wire target when filled: Experience page callout and/or Home Reviews (manual entry via Dev Tool is fine too).

---

## 4. Freelance clients (office-adjacent honesty)

Keep separate from EWall platform work; fill if you want live-since dates.

```
Answer:
- Sri Thanigai — live since (date) / anything measurable: 
- GB Fitness — live since (date) / anything measurable: 
```

Wire: [`Experience.tsx`](src/components/experience/Experience.tsx) freelance chapter + [`projectData.ts`](src/components/projects/projectData.ts) outcomes if needed.

---

## 5. Explicitly out of scope until user says otherwise

- Invented % improvements, revenue, MAU, “millions of users”
- Claiming company-wide architecture ownership (site already says module-level Junior scope)
- Publishing private EWall platform source / screenshots that violate NDA — ask user first
- Public Dev Tool GitHub extract (separate backlog; not office work)

---

## 6. Implementation checklist (agent — after answers)

When user pastes filled Answer blocks:

1. Update EWall `stats` strip with 2–3 hard numbers (e.g. modules owned, mentored, release cadence)
2. Tighten Junior impact bullets with Kitchen/other details — no fluff
3. Sync ExperienceHero + About + DocumentMeta
4. Keep Ownership Scope note: Junior title, module-level claims
5. Mark items `[done]` in this file after wiring
6. Re-score hiring band briefly for the user (~7.6 → ?)

---

## 7. Quick paste template for the user

Copy, fill, send in chat:

```
platform modules owned: 
Kitchen notes: 
Mentored: 
Release cadence: 
Deploy role: 
Safe production signal: 
Quote (optional): "…" — Name, Role
Sri Thanigai live since: 
GB Fitness live since: 
```
