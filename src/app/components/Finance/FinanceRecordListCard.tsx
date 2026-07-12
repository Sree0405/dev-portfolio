import { Link } from "react-router-dom";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/lib/format";
import type { FinanceModuleKey } from "@/app/lib/finance/moduleConfig";
import { FINANCE_MODULE_CONFIG } from "@/app/lib/finance/moduleConfig";
import type { FinanceRecord } from "@/app/lib/finance/types";
import { FinancePaymentHistory } from "@/app/components/Finance/FinancePaymentHistory";
import { FinanceProgressBar } from "@/app/components/Finance/FinanceProgressBar";
import { FinanceStatusBadge } from "@/app/components/Finance/FinanceStatusBadge";
import { FinanceUrgencyBadge } from "@/app/components/Finance/FinanceUrgencyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FinanceRecordListCardProps {
  record: FinanceRecord;
  moduleKey: FinanceModuleKey;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function FinanceRecordListCard({
  record,
  moduleKey,
  canDelete,
  onEdit,
  onDelete,
}: FinanceRecordListCardProps) {
  const config = FINANCE_MODULE_CONFIG[moduleKey];
  const urgency = record.currentPayment?.urgency ?? "safe";
  const detailUrl = `${config.routeBase}/${record.id}`;

  return (
    <article className="dashboard-surface-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{record.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(record.amount)}
            {moduleKey === "Subscription" && record.billingCycle
              ? ` / ${record.billingCycle}`
              : "/mo"}
            {record.dueDay ? ` · Due day ${record.dueDay}` : ""}
          </p>
        </div>
        {record.status === "Paid" ? (
          <FinanceStatusBadge status={record.status} />
        ) : (
          <FinanceUrgencyBadge urgency={urgency} />
        )}
      </div>

      {moduleKey === "EMI" && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Installment
              </p>
              <p className="font-medium">
                {record.currentInstallment ?? 1}/{record.totalMonths ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Remaining
              </p>
              <p className="font-medium">{record.remainingMonths ?? "—"} mo</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(record.totalAmount ?? 0)}</p>
            </div>
          </div>
          <div className="mt-4">
            <FinanceProgressBar value={record.progress ?? 0} />
          </div>
        </>
      )}

      {moduleKey === "Rent" && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {record.dueDate ? formatDate(record.dueDate) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Next Due</p>
            <p className="font-medium">{record.nextDue ? formatDate(record.nextDue) : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last Paid</p>
            <p className="font-medium">{record.lastPaid ? formatDate(record.lastPaid) : "—"}</p>
          </div>
        </div>
      )}

      {moduleKey === "Subscription" && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Category</p>
            <p className="font-medium">{record.category ?? "Other"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Renewal</p>
            <p className="font-medium">
              {record.renewalDate ? formatDate(record.renewalDate) : "—"}
            </p>
          </div>
          <div className="sm:col-span-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Status</p>
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {record.subscriptionStatus ?? record.status}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Payment History
        </p>
        <FinancePaymentHistory payments={record.payments} limit={4} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-3">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={detailUrl}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        {record.websiteUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={record.websiteUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {canDelete && (
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </article>
  );
}
