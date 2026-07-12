import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEMO_DELETE_MESSAGE } from "@/app/lib/types";
import { formatCurrency, formatDateTime, toDateInputValue } from "@/app/lib/format";
import type { Payment, ProjectNote } from "@/app/lib/types";
import type { NoteFormValues, PaymentFormValues, ProjectFormValues } from "@/app/lib/validation";
import { CardSkeleton, TableSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { NoteMobileCard } from "@/app/components/Common/NoteMobileCard";
import { PaymentMobileCard } from "@/app/components/Common/PaymentMobileCard";
import { StatusBadge } from "@/app/components/Common/StatusBadge";
import { ProjectLinksList } from "@/app/components/Common/ProjectLinksList";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { NoteForm } from "@/app/components/Forms/NoteForm";
import { PaymentForm } from "@/app/components/Forms/PaymentForm";
import { ProjectForm } from "@/app/components/Forms/ProjectForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const { canDelete } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [editNote, setEditNote] = useState<ProjectNote | null>(null);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);
  const [deleteNote, setDeleteNote] = useState<ProjectNote | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api.getProject(id),
    enabled: Boolean(id),
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", id],
    queryFn: () => api.getPayments(id),
    enabled: Boolean(id),
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => api.getNotes(id),
    enabled: Boolean(id),
  });

  const invalidateProjectData = () => {
    queryClient.invalidateQueries({ queryKey: ["project", id] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["payments", id] });
    queryClient.invalidateQueries({ queryKey: ["notes", id] });
  };

  const updateProjectMutation = useMutation({
    mutationFn: (values: ProjectFormValues) => api.updateProject(id, values),
    onSuccess: () => {
      invalidateProjectData();
      setEditOpen(false);
      toast.success("Project updated");
    },
    onError: () => toast.error("Failed to update project"),
  });

  const createPaymentMutation = useMutation({
    mutationFn: (values: PaymentFormValues) => api.createPayment(id, values),
    onSuccess: () => {
      invalidateProjectData();
      setPaymentOpen(false);
      toast.success("Payment added");
    },
    onError: () => toast.error("Failed to add payment"),
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ paymentId, values }: { paymentId: string; values: PaymentFormValues }) =>
      api.updatePayment(paymentId, values),
    onSuccess: () => {
      invalidateProjectData();
      setEditPayment(null);
      toast.success("Payment updated");
    },
    onError: () => toast.error("Failed to update payment"),
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => api.deletePayment(paymentId),
    onSuccess: () => {
      invalidateProjectData();
      setDeletePayment(null);
      toast.success("Payment deleted");
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(error.message || DEMO_DELETE_MESSAGE);
        return;
      }
      toast.error("Failed to delete payment");
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: (values: NoteFormValues) => api.createNote(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
      setNoteOpen(false);
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, values }: { noteId: string; values: NoteFormValues }) =>
      api.updateNote(noteId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
      setEditNote(null);
      toast.success("Note updated");
    },
    onError: () => toast.error("Failed to update note"),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => api.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
      setDeleteNote(null);
      toast.success("Note deleted");
    },
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(error.message || DEMO_DELETE_MESSAGE);
        return;
      }
      toast.error("Failed to delete note");
    },
  });

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      const filename = await api.downloadInvoice(id);
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error("Failed to generate invoice");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (projectLoading) {
    return (
      <>
        <DashboardHeader title="Project Details" />
        <main className="space-y-6 p-4 md:p-8">
          <CardSkeleton />
          <CardSkeleton />
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <DashboardHeader title="Project Not Found" />
        <main className="p-8">
          <Button asChild variant="outline">
            <Link to="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={project.name}
        description="Project overview, financial summary, payments, and notes."
        actions={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              variant="sreeDev"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="sm:hidden">{downloadingInvoice ? "..." : "Invoice"}</span>
              <span className="hidden sm:inline">
                {downloadingInvoice ? "Generating..." : "Download Invoice"}
              </span>
            </Button>
            <Button asChild variant="outline" className="flex-1 sm:flex-none">
              <Link to="/dashboard/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setEditOpen(true)} className="flex-1 sm:flex-none">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Project Name" value={project.name} />
            <InfoItem label="Client Name" value={project.clientName} />
            <InfoItem label="Client Number" value={project.clientNumber || "—"} />
            <InfoItem
              label="Project Links"
              value={<ProjectLinksList links={project.projectLinks} />}
            />
            <InfoItem label="Project Type" value={project.projectType} />
            <InfoItem label="Status" value={<StatusBadge status={project.status} />} />
            <InfoItem label="Planned Amount" value={formatCurrency(project.plannedAmount)} />
            <InfoItem label="Total Paid" value={formatCurrency(project.totalPaid)} />
            <InfoItem label="Remaining Amount" value={formatCurrency(project.remainingAmount)} />
            <InfoItem label="Created Date" value={formatDateTime(project.createdAt)} />
            <InfoItem label="Updated Date" value={formatDateTime(project.updatedAt)} />
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <InfoItem label="Total Planned Amount" value={formatCurrency(project.plannedAmount)} />
            <InfoItem label="Total Paid" value={formatCurrency(project.totalPaid)} />
            <InfoItem label="Remaining Amount" value={formatCurrency(project.remainingAmount)} />
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Payments</CardTitle>
            <Button variant="sreeDev" onClick={() => setPaymentOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <TableSkeleton rows={4} columns={5} />
            ) : payments.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
                No payments recorded yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {payments.map((payment) => (
                  <PaymentMobileCard
                    key={payment.id}
                    payment={payment}
                    onEdit={setEditPayment}
                    onDelete={setDeletePayment}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Notes</CardTitle>
            <Button variant="sreeDev" onClick={() => setNoteOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            {notesLoading ? (
              <TableSkeleton rows={4} columns={4} />
            ) : notes.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
                No notes added yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {notes.map((note) => (
                  <NoteMobileCard
                    key={note.id}
                    note={note}
                    onEdit={setEditNote}
                    onDelete={setDeleteNote}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AppModal open={editOpen} onOpenChange={setEditOpen} title="Edit Project">
        <ProjectForm
          submitLabel="Update Project"
          loading={updateProjectMutation.isPending}
          defaultValues={{
            name: project.name,
            clientName: project.clientName,
            clientNumber: project.clientNumber ?? "",
            projectLinks: project.projectLinks ?? "",
            projectType: project.projectType as ProjectFormValues["projectType"],
            status: project.status as ProjectFormValues["status"],
            plannedAmount: project.plannedAmount,
          }}
          onSubmit={async (values) => {
            await updateProjectMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal open={paymentOpen} onOpenChange={setPaymentOpen} title="Add Payment">
        <PaymentForm
          loading={createPaymentMutation.isPending}
          onSubmit={async (values) => {
            await createPaymentMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal
        open={Boolean(editPayment)}
        onOpenChange={(open) => !open && setEditPayment(null)}
        title="Edit Payment"
      >
        {editPayment && (
          <PaymentForm
            submitLabel="Update Payment"
            loading={updatePaymentMutation.isPending}
            defaultValues={{
              amount: editPayment.amount,
              paymentDate: toDateInputValue(editPayment.paymentDate),
              paymentMethod: editPayment.paymentMethod as PaymentFormValues["paymentMethod"],
              reference: editPayment.reference ?? "",
              notes: editPayment.notes ?? "",
            }}
            onSubmit={async (values) => {
              await updatePaymentMutation.mutateAsync({
                paymentId: editPayment.id,
                values,
              });
            }}
          />
        )}
      </AppModal>

      <AppModal open={noteOpen} onOpenChange={setNoteOpen} title="Add Note">
        <NoteForm
          loading={createNoteMutation.isPending}
          onSubmit={async (values) => {
            await createNoteMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal
        open={Boolean(editNote)}
        onOpenChange={(open) => !open && setEditNote(null)}
        title="Edit Note"
      >
        {editNote && (
          <NoteForm
            submitLabel="Update Note"
            loading={updateNoteMutation.isPending}
            defaultValues={{ content: editNote.content }}
            onSubmit={async (values) => {
              await updateNoteMutation.mutateAsync({
                noteId: editNote.id,
                values,
              });
            }}
          />
        )}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deletePayment)}
        onOpenChange={(open) => !open && setDeletePayment(null)}
        title="Delete payment?"
        description="This payment will be removed and project totals will be recalculated on the server."
        confirmLabel="Delete"
        loading={deletePaymentMutation.isPending}
        onConfirm={() => {
          if (deletePayment) {
            deletePaymentMutation.mutate(deletePayment.id);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteNote)}
        onOpenChange={(open) => !open && setDeleteNote(null)}
        title="Delete note?"
        description="This note will be permanently deleted."
        confirmLabel="Delete"
        loading={deleteNoteMutation.isPending}
        onConfirm={() => {
          if (deleteNote) {
            deleteNoteMutation.mutate(deleteNote.id);
          }
        }}
      />
    </>
  );
}
