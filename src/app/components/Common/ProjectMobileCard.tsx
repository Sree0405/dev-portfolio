import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/app/lib/types";
import { formatCurrency } from "@/app/lib/format";
import { StatusBadge } from "@/app/components/Common/StatusBadge";
import { Button } from "@/components/ui/button";

interface ProjectListCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  canDelete?: boolean;
}

export function ProjectListCard({
  project,
  onEdit,
  onDelete,
  canDelete = true,
}: ProjectListCardProps) {
  return (
    <article className="dashboard-surface-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/dashboard/projects/${project.id}`}
            className="block truncate text-base font-semibold text-foreground transition hover:text-primary"
          >
            {project.name}
          </Link>
          <p className="mt-1 truncate text-sm text-muted-foreground">{project.clientName}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Type</p>
          <p className="truncate font-medium text-foreground/90">{project.projectType}</p>
        </div>
        {project.clientNumber && (
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Client #</p>
            <p className="truncate font-medium text-foreground/90">{project.clientNumber}</p>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Planned</p>
          <p className="font-medium text-foreground">{formatCurrency(project.plannedAmount)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-3">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/dashboard/projects/${project.id}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(project)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        {canDelete && (
          <Button variant="outline" size="sm" onClick={() => onDelete(project)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        )}
      </div>
    </article>
  );
}

/** @deprecated Use ProjectListCard */
export const ProjectMobileCard = ProjectListCard;
