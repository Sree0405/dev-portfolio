import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Planning: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "In Progress": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "On Hold": "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status] ?? "")}>
      {status}
    </Badge>
  );
}
