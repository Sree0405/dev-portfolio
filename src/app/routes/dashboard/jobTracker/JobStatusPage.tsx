import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/app/lib/api";
import { JOB_STATUSES } from "@/app/lib/jobTracker/constants";
import { JobListCard } from "@/app/components/JobTracker/JobListCard";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;
const STATUS_OPTIONS = ["All", ...JOB_STATUSES] as const;

export default function JobStatusPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    window.clearTimeout((window as unknown as { __jobSearchTimer?: number }).__jobSearchTimer);
    (window as unknown as { __jobSearchTimer?: number }).__jobSearchTimer = window.setTimeout(
      () => setDebouncedSearch(value),
      300,
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", debouncedSearch, status, page],
    queryFn: () =>
      api.getJobs({
        search: debouncedSearch,
        status: status === "All" ? undefined : status,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const jobs = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <DashboardHeader
        title="Job Tracker"
        description="Track every application from submission until final outcome."
        actions={
          <Button asChild>
            <Link to="/dashboard/companies">
              <Plus className="mr-2 h-4 w-4" />
              Apply via Company
            </Link>
          </Button>
        }
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search company or role..."
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as typeof status);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dashboard-surface-card h-52 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title={debouncedSearch || status !== "All" ? "No applications found" : "No job applications yet"}
            description={
              debouncedSearch || status !== "All"
                ? "Try adjusting your search or status filter."
                : "Create an application from a company detail page."
            }
            actionLabel="Browse Companies"
            onAction={() => window.location.assign("/dashboard/companies")}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobListCard key={job.id} job={job} />
              ))}
            </div>
            {totalPages > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
