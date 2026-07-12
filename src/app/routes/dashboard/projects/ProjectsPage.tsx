import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEMO_DELETE_MESSAGE } from "@/app/lib/types";
import { PROJECT_SORT_OPTIONS } from "@/app/lib/constants";
import type { Project } from "@/app/lib/types";
import type { ProjectFormValues } from "@/app/lib/validation";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { ProjectListCard } from "@/app/components/Common/ProjectMobileCard";
import { TableSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { ProjectForm } from "@/app/components/Forms/ProjectForm";
import { AppModal } from "@/app/components/Modal/AppModal";
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

const PAGE_SIZE = 10;

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { canDelete } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    window.clearTimeout((window as unknown as { __searchTimer?: number }).__searchTimer);
    (window as unknown as { __searchTimer?: number }).__searchTimer = window.setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["projects", debouncedSearch, sortBy, sortOrder, page],
    queryFn: () =>
      api.getProjects({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const createMutation = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCreateOpen(false);
      toast.success("Project created successfully");
    },
    onError: () => toast.error("Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProjectFormValues }) =>
      api.updateProject(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditProject(null);
      toast.success("Project updated successfully");
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteProject(null);
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(error.message || DEMO_DELETE_MESSAGE);
        return;
      }
      toast.error("Failed to delete project");
    },
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <>
      <DashboardHeader
        title="Projects"
        description="Browse and manage your project portfolio."
        actions={
          <Button variant="sreeDev" onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
          <Input
            placeholder="Search projects or clients..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="sm:col-span-2 lg:col-span-1"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dashboard-surface-card h-40 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to start tracking clients, payments, and notes."
            actionLabel="New Project"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {data?.items.map((project) => (
                <ProjectListCard
                  key={project.id}
                  project={project}
                  onEdit={setEditProject}
                  onDelete={setDeleteProject}
                  canDelete={canDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="overflow-x-auto">
                <PaginationContent className="flex-wrap justify-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.max(1, current - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === page}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage((current) => Math.min(totalPages, current + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>

      <AppModal open={createOpen} onOpenChange={setCreateOpen} title="Create Project">
        <ProjectForm
          loading={createMutation.isPending}
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal
        open={Boolean(editProject)}
        onOpenChange={(open) => !open && setEditProject(null)}
        title="Edit Project"
      >
        {editProject && (
          <ProjectForm
            submitLabel="Update Project"
            loading={updateMutation.isPending}
            defaultValues={{
              name: editProject.name,
              clientName: editProject.clientName,
              clientNumber: editProject.clientNumber ?? "",
              projectLinks: editProject.projectLinks ?? "",
              projectType: editProject.projectType as ProjectFormValues["projectType"],
              status: editProject.status as ProjectFormValues["status"],
              plannedAmount: editProject.plannedAmount,
            }}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync({ id: editProject.id, values });
            }}
          />
        )}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleteProject)}
        onOpenChange={(open) => !open && setDeleteProject(null)}
        title="Delete project?"
        description={`This will permanently delete "${deleteProject?.name}" along with all payments and notes.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteProject) {
            deleteMutation.mutate(deleteProject.id);
          }
        }}
      />
    </>
  );
}
