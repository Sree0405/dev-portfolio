import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Overdue: "border-red-500/30 bg-red-500/10 text-red-400",
};

export function FinanceStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[status] ?? "")}>
      {status}
    </Badge>
  );
}
