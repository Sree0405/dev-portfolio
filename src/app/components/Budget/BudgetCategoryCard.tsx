import { formatCurrency } from "@/app/lib/format";
import type { BudgetCategory } from "@/app/lib/budget/types";
import { BUDGET_STATUS_STYLES } from "@/app/lib/budget/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BudgetCategoryCardProps {
  category: BudgetCategory;
}

export function BudgetCategoryCard({ category }: BudgetCategoryCardProps) {
  const styles = BUDGET_STATUS_STYLES[category.status];
  const progressValue = Math.min(category.progress, 100);

  return (
    <article
      className={cn(
        "dashboard-surface-card rounded-xl border p-4 transition-colors",
        styles.card,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{category.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{category.percentage}% allocated</p>
        </div>
        <Badge variant="outline" className={cn("shrink-0", styles.text)}>
          {styles.label}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Allocated</p>
          <p className="font-medium">{formatCurrency(category.plannedAmount)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Spent</p>
          <p className="font-medium">{formatCurrency(category.actualAmount)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Remaining</p>
          <p className={cn("font-medium", category.remaining < 0 && "text-red-400")}>
            {formatCurrency(category.remaining)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Progress value={progressValue} className={cn("h-2.5", styles.bar)} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{category.progress}% used</span>
          {category.status === "exceeded" && (
            <span className="font-medium text-red-400">
              Budget Exceeded {formatCurrency(category.overBy)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
