import { Pencil, Trash2 } from "lucide-react";
import type { Payment } from "@/app/lib/types";
import { formatCurrency, formatDate } from "@/app/lib/format";
import { Button } from "@/components/ui/button";

interface PaymentMobileCardProps {
  payment: Payment;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  canDelete?: boolean;
}

export function PaymentMobileCard({
  payment,
  onEdit,
  onDelete,
  canDelete = true,
}: PaymentMobileCardProps) {
  return (
    <article className="dashboard-surface-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment Date</p>
          <p className="mt-1 text-sm font-medium">{formatDate(payment.paymentDate)}</p>
        </div>
        <p className="text-base font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Method: </span>
          {payment.paymentMethod}
        </p>
        {payment.reference && (
          <p>
            <span className="text-muted-foreground">Reference: </span>
            {payment.reference}
          </p>
        )}
        {payment.notes && (
          <p className="text-muted-foreground">
            <span className="text-foreground/70">Notes: </span>
            {payment.notes}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-border/40 pt-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(payment)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        {canDelete && (
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onDelete(payment)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}
