import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface UtilityToolShellProps {
  children: ReactNode;
  className?: string;
}

export function UtilityToolShell({ children, className }: UtilityToolShellProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

interface UtilityFieldProps {
  label: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function UtilityField({ label, children, actions }: UtilityFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {actions}
      </div>
      {children}
    </div>
  );
}

export const utilityTextareaClass =
  "min-h-[140px] w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 font-mono text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

export const utilityInputClass =
  "h-10 w-full rounded-lg border border-border/60 bg-background/60 px-3 font-mono text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

export const utilityOutputClass =
  "min-h-[120px] w-full overflow-auto rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-all";
