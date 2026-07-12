import { Pencil, Trash2 } from "lucide-react";
import type { ProjectNote } from "@/app/lib/types";
import { formatDate, formatTime } from "@/app/lib/format";
import { Button } from "@/components/ui/button";

interface NoteMobileCardProps {
  note: ProjectNote;
  onEdit: (note: ProjectNote) => void;
  onDelete: (note: ProjectNote) => void;
  canDelete?: boolean;
}

export function NoteMobileCard({
  note,
  onEdit,
  onDelete,
  canDelete = true,
}: NoteMobileCardProps) {
  return (
    <article className="dashboard-surface-card rounded-xl p-4">
      <p className="text-xs font-medium text-muted-foreground">
        {formatDate(note.createdAt)} • {formatTime(note.createdAt)}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{note.content}</p>

      <div className="mt-4 flex gap-2 border-t border-border/40 pt-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(note)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        {canDelete && (
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onDelete(note)}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}
