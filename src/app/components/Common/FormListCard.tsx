import { Eye, Mail, Trash2 } from "lucide-react";
import type { FormSubmission } from "@/app/lib/types";
import { formatDate } from "@/app/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormListCardProps {
  form: FormSubmission;
  onView: (form: FormSubmission) => void;
  onDelete: (form: FormSubmission) => void;
  canDelete?: boolean;
}

function statusVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "new":
      return "default";
    case "read":
      return "secondary";
    default:
      return "outline";
  }
}

export function FormListCard({ form, onView, onDelete, canDelete = true }: FormListCardProps) {
  return (
    <article className="dashboard-surface-card flex h-full flex-col rounded-xl border border-border/60 p-4 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant(form.status)} className="capitalize">
              {form.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {form.source.replace(/_/g, " ")}
            </Badge>
          </div>
          <h3 className="mt-3 truncate text-base font-semibold">{form.subject}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{form.name}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
          <Mail className="h-4 w-4 text-primary" />
        </div>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {form.message}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
        <span className="truncate text-xs text-muted-foreground">{formatDate(form.createdAt)}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => onView(form)}>
            <Eye className="mr-1.5 h-4 w-4" />
            View
          </Button>
          {canDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 text-destructive hover:text-destructive")}
              onClick={() => onDelete(form)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
