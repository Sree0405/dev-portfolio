import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DevUtilityDefinition } from "@/app/lib/devUtilities/registry";
import { cn } from "@/lib/utils";

interface DevUtilityCardProps {
  utility: DevUtilityDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: (utilityId: string) => void;
  compact?: boolean;
}

export function DevUtilityCard({
  utility,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}: DevUtilityCardProps) {
  const Icon = utility.icon;

  return (
    <article
      className={cn(
        "group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm transition hover:border-primary/30 hover:bg-card/80",
        compact ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>{utility.name}</h3>
            {!compact ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{utility.description}</p>
            ) : null}
          </div>
        </div>
        {onToggleFavorite ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onToggleFavorite(utility.id)}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <Star className={cn("h-4 w-4", isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          </Button>
        ) : null}
      </div>

      {!compact ? (
        <div className="mt-4 flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {utility.category}
          </Badge>
          <Button variant="sreeDev" size="sm" asChild>
            <Link to={`/dashboard/dev-utilities/${utility.id}`}>Open</Link>
          </Button>
        </div>
      ) : (
        <Button variant="link" size="sm" className="mt-2 h-auto px-0" asChild>
          <Link to={`/dashboard/dev-utilities/${utility.id}`}>Open utility</Link>
        </Button>
      )}
    </article>
  );
}
