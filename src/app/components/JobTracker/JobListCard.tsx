import { Link } from "react-router-dom";
import { Briefcase, ChevronRight } from "lucide-react";
import type { JobApplication } from "@/app/lib/jobTracker/types";
import { formatCurrency, formatDate } from "@/app/lib/format";
import { StatusBadge } from "@/app/components/Common/StatusBadge";

interface JobListCardProps {
  job: JobApplication;
}

export function JobListCard({ job }: JobListCardProps) {
  return (
    <Link
      to={`/dashboard/job-status/${job.id}`}
      className="dashboard-surface-card block rounded-xl border border-border/60 p-4 transition hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <StatusBadge status={job.currentStatus} />
          <h3 className="mt-3 truncate text-base font-semibold">{job.roleName}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {job.companyName ?? "Unknown Company"}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 border-t border-border/50 pt-3 text-xs text-muted-foreground sm:grid-cols-2">
        <span>Applied {formatDate(job.appliedDate)}</span>
        {job.nextInterviewDate ? (
          <span>Next interview {formatDate(job.nextInterviewDate)}</span>
        ) : null}
        {job.expectedSalary ? (
          <span>Expected {formatCurrency(job.expectedSalary)}</span>
        ) : null}
        {job.negotiatedSalary ? (
          <span>Negotiated {formatCurrency(job.negotiatedSalary)}</span>
        ) : null}
      </div>

      <div className="mt-2 flex justify-end">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
