import { Link } from "react-router-dom";
import { Building2, ExternalLink, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Company } from "@/app/lib/jobTracker/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/app/components/Common/StatusBadge";

interface CompanyListCardProps {
  company: Company;
  canWrite?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

export function CompanyListCard({
  company,
  canWrite = false,
  onEdit,
  onDelete,
}: CompanyListCardProps) {
  const location = [company.headquarters, company.officeLocation].filter(Boolean).join(" · ");

  return (
    <article className="dashboard-surface-card group relative flex h-full flex-col rounded-xl border border-border/60 p-4 transition hover:border-primary/30">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/dashboard/companies/${company.id}`} className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {company.applied ? (
              <Badge variant="default">Applied</Badge>
            ) : (
              <Badge variant="outline">Not Applied</Badge>
            )}
            {company.productCategory ? (
              <Badge variant="secondary" className="max-w-full truncate">
                {company.productCategory}
              </Badge>
            ) : null}
            {company.companyType ? (
              <Badge variant="outline" className="max-w-full truncate">
                {company.companyType}
              </Badge>
            ) : null}
            {company.companySize ? (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {company.companySize}
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug">{company.name}</h3>
          {location ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{location}</p>
          ) : null}
        </Link>

        <div className="flex shrink-0 items-start gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          {canWrite ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/companies/${company.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(company)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit company
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(company)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {(company.linkedinUrl || company.careersUrl) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {company.linkedinUrl ? (
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
          {company.careersUrl ? (
            <a
              href={company.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Careers
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      )}

      <Link
        to={`/dashboard/companies/${company.id}`}
        className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3 text-sm"
      >
        <span className="text-muted-foreground">
          {company.jobApplicationCount ?? 0} application
          {(company.jobApplicationCount ?? 0) !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          {company.latestJobStatus ? <StatusBadge status={company.latestJobStatus} /> : null}
        </div>
      </Link>
    </article>
  );
}
