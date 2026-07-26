import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Mail, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { formatDate } from "@/app/lib/format";
import { DEMO_FORM_DELETE_MESSAGE, type FormSubmission } from "@/app/lib/types";
import type { FormSubmissionFormValues } from "@/app/lib/validation";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { CopyButton } from "@/app/components/Common/CopyButton";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { FormListCard } from "@/app/components/Common/FormListCard";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { FormSubmissionForm } from "@/app/components/Forms/FormSubmissionForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const GLASS_MODAL_CLASS =
  "sm:max-w-xl border border-white/10 bg-background/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

const STATUS_OPTIONS = ["All", "new", "read", "archived"] as const;

export default function FormsPage() {
  const queryClient = useQueryClient();
  const { canDelete, isDemo } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewForm, setViewForm] = useState<FormSubmission | null>(null);
  const [deleteForm, setDeleteForm] = useState<FormSubmission | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    window.clearTimeout((window as unknown as { __formsSearchTimer?: number }).__formsSearchTimer);
    (window as unknown as { __formsSearchTimer?: number }).__formsSearchTimer = window.setTimeout(
      () => setDebouncedSearch(value),
      300,
    );
  };

  const { data, isLoading } = useQuery({
    queryKey: ["forms", debouncedSearch, status, page],
    queryFn: () =>
      api.getForms({
        search: debouncedSearch,
        status: status === "All" ? undefined : status,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["forms"] });
  };

  const createMutation = useMutation({
    mutationFn: api.createForm,
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast.success("Form submission added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteForm,
    onSuccess: () => {
      invalidate();
      setDeleteForm(null);
      toast.success("Form submission deleted");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(DEMO_FORM_DELETE_MESSAGE);
        return;
      }
      toast.error(error.message);
    },
  });

  const viewMutation = useMutation({
    mutationFn: api.getForm,
    onSuccess: (form) => {
      setViewForm(form);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const forms = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const handleView = (form: FormSubmission) => {
    if (form.status === "new") {
      viewMutation.mutate(form.id);
      return;
    }
    setViewForm(form);
  };

  return (
    <>
      <DashboardHeader
        title="Forms"
        description="Contact submissions and manually added inquiries."
        actions={
          <Button variant="sreeDev" onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Form
          </Button>
        }
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        {isDemo && (
          <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Demo Form Submissions</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                These entries are fictional sample inquiries for showcase purposes only. The owner
                account only sees real submissions from the public contact page and manually added
                records.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by name, email, subject, or message..."
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value: (typeof STATUS_OPTIONS)[number]) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All Statuses" : option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="dashboard-surface-card h-52 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <EmptyState
            title="No form submissions yet"
            description={
              debouncedSearch || status !== "All"
                ? "No submissions match your search or filter."
                : "Submissions from the contact page and manual entries will appear here."
            }
            actionLabel="Add Form"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => (
                <FormListCard
                  key={form.id}
                  form={form}
                  canDelete={canDelete}
                  onView={handleView}
                  onDelete={setDeleteForm}
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

      <AppModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Form Submission"
        description="Manually record an inquiry or contact message."
        className={GLASS_MODAL_CLASS}
      >
        <FormSubmissionForm
          loading={createMutation.isPending}
          submitLabel="Add Form"
          onSubmit={async (values: FormSubmissionFormValues) => {
            await createMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal
        open={!!viewForm}
        onOpenChange={(open) => !open && setViewForm(null)}
        title={viewForm?.subject ?? "Form Details"}
        description="Full submission details."
        className={cn(GLASS_MODAL_CLASS, "sm:max-w-lg")}
      >
        {viewForm && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{viewForm.name}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {viewForm.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {viewForm.source.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                { label: "Email", value: viewForm.email, copy: true },
                { label: "Subject", value: viewForm.subject, copy: true },
              ].map((field) => (
                <div key={field.label} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1 flex items-center justify-between gap-2">
                    <span className="break-all font-medium">{field.value}</span>
                    {field.copy ? <CopyButton value={field.value} label={field.label} /> : null}
                  </dd>
                </div>
              ))}

              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{viewForm.message}</dd>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">Submitted</dt>
                  <dd className="mt-1 text-sm">{formatDate(viewForm.createdAt)}</dd>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">Updated</dt>
                  <dd className="mt-1 text-sm">{formatDate(viewForm.updatedAt)}</dd>
                </div>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-2">
              <CopyButton value={viewForm.email} label="email" variant="outline" size="sm" />
              <Button variant="sreeDev" asChild>
                <a href={`mailto:${viewForm.email}?subject=${encodeURIComponent(`Re: ${viewForm.subject}`)}`}>
                  Reply via Email
                </a>
              </Button>
            </div>
          </div>
        )}
      </AppModal>

      <ConfirmDialog
        open={!!deleteForm}
        onOpenChange={(open) => !open && setDeleteForm(null)}
        title="Delete form submission?"
        description={`This will permanently remove the submission from "${deleteForm?.name ?? "this sender"}".`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteForm) {
            deleteMutation.mutate(deleteForm.id);
          }
        }}
      />
    </>
  );
}
