# Finance Management Dashboard

Modular **Finance Hub** for **Sree Dev Tool** — scalable personal finance tracking for freelancers with independent modules sharing a unified financial engine.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Module Registry

| Submodule | Route | Status |
|-----------|-------|--------|
| Overview | `/dashboard/finance` | Live |
| EMI | `/dashboard/finance/emi` | Live |
| Rent | `/dashboard/finance/rent` | Live |
| Subscriptions | `/dashboard/finance/subscriptions` | Live |
| Record detail | `/dashboard/finance/<module>/:id` | Live |
| Utilities, Taxes, Assets… | `/dashboard/finance/<module>` | Planned |

Each module is a dedicated page under the shared `FinanceLayout` (no in-page tabs).

---

## Architecture

### Shared financial engine

Location: `server/finance/engine.ts`

Responsibilities:

- Payment status resolution (Pending / Paid / Overdue)
- Urgency levels for color indicators (green / orange / red / dark red)
- EMI progress calculation
- Subscription renewal date generation
- Rent monthly due date generation
- EMI installment schedule generation

All modules use `FinanceRecord` + `FinancePaymentHistory` — no duplicate payment tables per module.

### Shared PDF engine

Location: `server/finance/pdf/template/renderFinanceReportTemplate.ts`

Single reusable **`FinanceReportTemplate`** used by EMI, Rent, Subscription, and future modules. Features:

- Portfolio logo + branded hero header
- Report metadata (ID, date, time, module, period)
- Information cards with rounded corners and two-column layout
- Highlighted financial summary card
- Color-coded status badges (Paid / Pending / Overdue / Active)
- Zebra-striped payment history table with wrapped notes
- Visual payment timeline
- Statistics summary grid + monthly breakdown
- Premium footer, watermark (3%), and page numbers

### Database

```prisma
model FinanceRecord {
  moduleType  String   // EMI, Rent, Subscription
  name        String
  amount      Decimal
  // Module-specific nullable fields...
  type        DataType
  payments    FinancePaymentHistory[]
}

model FinancePaymentHistory {
  recordId             String
  amount               Decimal
  dueDate              DateTime
  paidDate             DateTime?
  status               String
  periodLabel          String?
  notes                String?
  transactionReference String?
  createdBy            String?
  type                 DataType
}
```

Payment history is append-only — never overwritten when marking paid.

---

## Sidebar

- **Finance group always expanded on desktop** — no accordion/collapse
- Static indented children: Overview, EMI, Rent, Subscriptions
- Dividers above and below the Finance section
- Active child route highlighted
- Add actions live on each module page (not sidebar flyouts)

---

## Page layouts

### Overview (`/dashboard/finance`)

Dashboard stats, charts, upcoming/overdue payments, recent payments, calendar. No tabs.

### Module list pages (`/dashboard/finance/emi`, `/rent`, `/subscriptions`)

Each page includes:

- Statistics cards
- Search and status filters
- **Add** and **Print PDF** buttons
- Responsive table: Name, Amount, Status, Due Date, Next Due, Last Paid, Type, Actions (View / Edit / Delete)
- Pagination, loading skeleton, empty state
- Delete hidden for Demo user

### Detail pages (`/dashboard/finance/<module>/:id`)

- Information card (name, amount, status, dates, category, notes)
- Payment summary (total paid, remaining, current month, next due)
- Payment logs table (newest first, append-only history)
- **Mark as Paid** modal (amount, paid date, notes, transaction reference)
- **Print PDF** for full record history

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/finance/notifications` | Upcoming & overdue counts |
| GET | `/api/finance/overview` | Dashboard stats, charts, calendar |
| GET/POST | `/api/finance/emi` | Paginated list / create EMI |
| GET/PUT | `/api/finance/emi/:id` | Get / update record |
| POST | `/api/finance/emi/:id/mark-paid` | Mark paid with payment details |
| DELETE | `/api/finance/emi/:id` | Delete (owner only) |
| GET | `/api/finance/emi/report/pdf` | Module PDF report |
| GET | `/api/finance/emi/:id/pdf` | Record detail PDF |
| GET/POST | `/api/finance/rent` | Same pattern as EMI |
| GET/POST | `/api/finance/subscriptions` | Same pattern as EMI |

Report PDF query params: `range` (current_month, last_2, last_3, last_6, last_12, custom_month, custom_range), optional `month`, `from`, `to`.

---

## Color indicators

| Level | Condition |
|-------|-----------|
| Green (`safe`) | More than 10 days remaining |
| Orange (`warning`) | Within 10 days |
| Red (`due`) | Due today |
| Dark red (`overdue`) | Past due |

Used in overview, calendar, and payment history.

---

## Demo data

`npm run db:seed` creates:

- 5 EMI records with installment history
- 5 Rent records with monthly history
- 10 Subscription records with renewal history

All use `type = Demo`. Demo users cannot delete finance records (403).

---

## Adding a new finance module

1. Add module constant in `server/finance/constants.ts`
2. Extend `FinanceRecord` fields or use existing columns + validation schema
3. Add repository create/list methods using the shared engine
4. Add routes under `/api/finance/<module>` (list, CRUD, mark-paid, report PDF, detail PDF)
5. Add child route in `financeNavGroup` (`moduleConfig.ts`) + `App.tsx`
6. Add a thin page wrapper using `FinanceModuleListPage` or a dedicated page
7. Wire PDF generation through `financePdfService.ts`
8. Document in this file and [SREE_DEV_TOOL.md](./SREE_DEV_TOOL.md)

---

## File reference

| Layer | Path |
|-------|------|
| Engine | `server/finance/engine.ts` |
| PDF template | `server/finance/pdf/template/renderFinanceReportTemplate.ts` |
| PDF config | `server/finance/pdf/config.ts` |
| PDF service | `server/finance/pdf/financePdfService.ts` |
| Repository | `server/repositories/financeRepository.ts` |
| Service | `server/services/financeService.ts` |
| Routes | `server/routes/finance.ts` |
| Layout | `src/app/routes/dashboard/finance/layout/FinanceLayout.tsx` |
| Shared list | `src/app/routes/dashboard/finance/FinanceModuleListPage.tsx` |
| Detail page | `src/app/routes/dashboard/finance/FinanceRecordDetailPage.tsx` |
| Print modal | `src/app/components/Finance/FinancePrintModal.tsx` |
| Mark paid modal | `src/app/components/Finance/MarkPaidModal.tsx` |
| Nav config | `src/app/lib/finance/moduleConfig.ts` |
| Sidebar group | `src/app/components/Sidebar/DashboardSidebar.tsx` |
