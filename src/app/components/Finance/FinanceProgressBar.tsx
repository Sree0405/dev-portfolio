import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FinanceProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function FinanceProgressBar({ value, className, showLabel = true }: FinanceProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      <Progress value={clamped} className="h-2.5" />
      {showLabel && (
        <p className="text-right text-xs font-medium text-muted-foreground">{clamped}%</p>
      )}
    </div>
  );
}
