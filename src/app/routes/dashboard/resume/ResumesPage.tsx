import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEFAULT_RESUME_LATEX } from "@/app/lib/resume/defaultTemplate";
import {
  DEMO_RESUME_DELETE_MESSAGE,
  type Resume,
} from "@/app/lib/resume/types";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/app/lib/format";
import { cn } from "@/lib/utils";

const GLASS_MODAL_CLASS =
  "sm:max-w-lg border border-white/10 bg-background/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

export default function ResumesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canDelete } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("My Resume");
  const [deleteResume, setDeleteResume] = useState<Resume | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    window.clearTimeout((window as unknown as { __resumeSearchTimer?: number }).__resumeSearchTimer);
    (window as unknown as { __resumeSearchTimer?: number }).__resumeSearchTimer = window.setTimeout(
      () => setDebouncedSearch(value),
      300,
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["resumes", debouncedSearch],
    queryFn: () => api.getResumes({ search: debouncedSearch || undefined }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["resumes"] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      api.createResume({
        title: newTitle.trim(),
        latexSource: DEFAULT_RESUME_LATEX,
      }),
    onSuccess: (resume) => {
      invalidate();
      setCreateOpen(false);
      toast.success("Resume created");
      navigate(`/dashboard/resume/${resume.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteResume,
    onSuccess: () => {
      invalidate();
      setDeleteResume(null);
      toast.success("Resume deleted");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(DEMO_RESUME_DELETE_MESSAGE);
        return;
      }
      toast.error(error.message);
    },
  });

  const resumes = data?.items ?? [];

  return (
    <>
      <DashboardHeader
        title="Resume"
        description="Create and edit professional resumes with LaTeX and live preview."
        actions={
          <Button variant="sreeDev" onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-6 md:px-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search resumes..."
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState
            title="No resumes yet"
            description="Create your first LaTeX resume to get started."
            actionLabel="New Resume"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume) => (
              <article
                key={resume.id}
                className="group rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm transition hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-foreground">{resume.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      resume.compileStatus === "success"
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-border/60",
                    )}
                  >
                    {resume.hasCompiledPdf ? "PDF" : "Draft"}
                  </Badge>
                </div>

                {resume.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{resume.description}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="sreeDev" size="sm" asChild>
                    <Link to={`/dashboard/resume/${resume.id}`}>Open Editor</Link>
                  </Button>

                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteResume(resume)}
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AppModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Resume"
        description="Start from a professional LaTeX template."
        className={GLASS_MODAL_CLASS}
      >
        <div className="space-y-4">
          <Input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Resume title"
          />
          <Button
            className="w-full"
            variant="sreeDev"
            disabled={createMutation.isPending || !newTitle.trim()}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create Resume
          </Button>
        </div>
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleteResume)}
        onOpenChange={(open) => !open && setDeleteResume(null)}
        title="Delete resume?"
        description={`This will permanently delete "${deleteResume?.title}".`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteResume && deleteMutation.mutate(deleteResume.id)}
      />
    </>
  );
}
