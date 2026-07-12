import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "./CountUp";

interface StatCardProps {
  label: string;
  value: number;
  displayValue?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  accent?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const accentStyles = {
  default: "border-border/60 bg-card/50",
  primary: "border-primary/30 bg-primary/5",
  success: "border-emerald-500/30 bg-emerald-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
  danger: "border-red-500/30 bg-red-500/5",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-red-500/15 text-red-400",
};

export function StatCard({
  label,
  value,
  displayValue,
  prefix,
  suffix,
  decimals = 0,
  icon: Icon,
  accent = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors sm:p-4 md:p-5 min-w-0 overflow-hidden",
        accentStyles[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 truncate text-xl font-semibold text-foreground md:text-2xl">
            {displayValue ?? (
              <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
            )}
          </p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconStyles[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
