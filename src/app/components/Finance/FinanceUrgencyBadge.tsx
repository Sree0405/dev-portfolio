import type { UrgencyLevel } from "@/app/lib/finance/constants";
import { URGENCY_CLASSES, URGENCY_LABELS } from "@/app/lib/finance/constants";
import { cn } from "@/lib/utils";

interface FinanceUrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export function FinanceUrgencyBadge({ urgency, className }: FinanceUrgencyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        URGENCY_CLASSES[urgency],
        className,
      )}
    >
      {URGENCY_LABELS[urgency]}
    </span>
  );
}
