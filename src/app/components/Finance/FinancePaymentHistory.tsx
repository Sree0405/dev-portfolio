import { formatCurrency, formatDate } from "@/app/lib/format";
import type { FinancePayment } from "@/app/lib/finance/types";
import { FinanceUrgencyBadge } from "@/app/components/Finance/FinanceUrgencyBadge";
import { Badge } from "@/components/ui/badge";

interface FinancePaymentHistoryProps {
  payments: FinancePayment[];
  limit?: number;
}

export function FinancePaymentHistory({ payments, limit = 6 }: FinancePaymentHistoryProps) {
  const items = payments.slice(0, limit);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No payment history yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((payment) => (
        <div
          key={payment.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">{payment.periodLabel ?? formatDate(payment.dueDate)}</p>
            <p className="text-xs text-muted-foreground">Due {formatDate(payment.dueDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatCurrency(payment.amount)}</span>
            {payment.status === "Paid" ? (
              <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400">
                Paid
              </Badge>
            ) : (
              <FinanceUrgencyBadge urgency={payment.urgency} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
