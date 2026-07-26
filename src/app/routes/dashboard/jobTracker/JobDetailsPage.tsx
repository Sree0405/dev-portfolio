import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { JOB_STATUSES } from "@/app/lib/jobTracker/constants";
import { formatCurrency, formatDate, formatDateTime } from "@/app/lib/format";
import type { InterviewSchedule, JobNote } from "@/app/lib/jobTracker/types";
import type {
  InterviewFormValues,
  JobApplicationFormValues,
  JobNoteFormValues,
  JobSalariesFormValues,
} from "@/app/lib/validation";
import { CardSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { StatusBadge } from "@/app/components/Common/StatusBadge";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { InterviewForm } from "@/app/components/Forms/InterviewForm";
import { JobApplicationForm } from "@/app/components/Forms/JobApplicationForm";
import { JobNoteForm } from "@/app/components/Forms/JobNoteForm";
import { JobSalariesForm } from "@/app/components/Forms/JobSalariesForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export default function JobDetailsPage() {
  const { jobId = "" } = useParams();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [editInterview, setEditInterview] = useState<InterviewSchedule | null>(null);
  const [editNote, setEditNote] = useState<JobNote | null>(null);
  const [deleteInterview, setDeleteInterview] = useState<InterviewSchedule | null>(null);
  const [deleteNote, setDeleteNote] = useState<JobNote | null>(null);
  const [deleteJobOpen, setDeleteJobOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => api.getJob(jobId),
    enabled: Boolean(jobId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["companies"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const updateMutation = useMutation({
    mutationFn: (values: JobApplicationFormValues) => api.updateJob(jobId, values),
    onSuccess: () => {
      invalidate();
      setEditOpen(false);
      toast.success("Job updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.updateJobStatus(jobId, { status }),
    onSuccess: () => {
      invalidate();
      toast.success("Status updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const salaryMutation = useMutation({
    mutationFn: (values: JobSalariesFormValues) => api.updateJobSalaries(jobId, values),
    onSuccess: () => {
      invalidate();
      setSalaryOpen(false);
      toast.success("Salaries updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createInterviewMutation = useMutation({
    mutationFn: (values: InterviewFormValues) => api.createInterview(jobId, values),
    onSuccess: () => {
      invalidate();
      setInterviewOpen(false);
      toast.success("Interview scheduled");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateInterviewMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: InterviewFormValues }) =>
      api.updateInterview(id, values),
    onSuccess: () => {
      invalidate();
      setEditInterview(null);
      toast.success("Interview updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: api.deleteInterview,
    onSuccess: () => {
      invalidate();
      setDeleteInterview(null);
      toast.success("Interview deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createNoteMutation = useMutation({
    mutationFn: (values: JobNoteFormValues) => api.createJobNote(jobId, values),
    onSuccess: () => {
      invalidate();
      setNoteOpen(false);
      toast.success("Note added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: JobNoteFormValues }) =>
      api.updateJobNote(id, values),
    onSuccess: () => {
      invalidate();
      setEditNote(null);
      toast.success("Note updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: api.deleteJobNote,
    onSuccess: () => {
      invalidate();
      setDeleteNote(null);
      toast.success("Note deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteJobMutation = useMutation({
    mutationFn: () => api.deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job application deleted");
      window.location.assign("/dashboard/job-status");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Job Application" />
        <main className="p-8">
          <CardSkeleton />
        </main>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <DashboardHeader title="Job not found" />
        <main className="p-8">
          <Button asChild variant="outline">
            <Link to="/dashboard/job-status">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Tracker
            </Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={job.roleName}
        description={job.companyName ?? "Job application details"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteJobOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link to="/dashboard/job-status">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Tracker
          </Link>
        </Button>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Job Information</CardTitle>
            <StatusBadge status={job.currentStatus} />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Company"
              value={
                <Link to={`/dashboard/companies/${job.companyId}`} className="text-primary hover:underline">
                  {job.companyName}
                </Link>
              }
            />
            <InfoItem label="Job ID" value={job.jobId} />
            <InfoItem label="Applied Date" value={formatDate(job.appliedDate)} />
            <InfoItem label="Application URL" value={job.applicationUrl} />
            <InfoItem label="Applied Through" value={job.appliedThrough} />
            <InfoItem label="Mail ID" value={job.mailId} />
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">Update Status</CardTitle>
            <Select
              value={job.currentStatus}
              onValueChange={(value) => statusMutation.mutate(value)}
              disabled={statusMutation.isPending}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {job.statusHistory.map((entry) => (
                <div key={entry.id} className="flex gap-4 border-l-2 border-primary/30 pl-4">
                  <div className="min-w-[120px] text-sm text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </div>
                  <div className="text-sm font-medium">{entry.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Salary Tracking</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setSalaryOpen(true)}>
              Edit Salaries
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Expected Salary" value={job.expectedSalary ? formatCurrency(job.expectedSalary) : null} />
            <InfoItem label="Current Salary" value={job.currentSalary ? formatCurrency(job.currentSalary) : null} />
            <InfoItem
              label="Negotiated Salary"
              value={job.negotiatedSalary ? formatCurrency(job.negotiatedSalary) : null}
            />
            <InfoItem label="Offered Salary" value={job.offeredSalary ? formatCurrency(job.offeredSalary) : null} />
            <InfoItem
              label="Company Standard Salary"
              value={job.companyStandardSalary ? formatCurrency(job.companyStandardSalary) : null}
            />
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Interview Scheduler</CardTitle>
            <Button size="sm" onClick={() => setInterviewOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {job.interviews.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No interviews scheduled.</p>
            ) : (
              job.interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/10 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(interview.interviewDate)}
                      {interview.interviewTime ? ` · ${interview.interviewTime}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">{interview.mode}</p>
                    <p className="mt-2 text-sm">{interview.interviewer || "—"}</p>
                    <p className="text-sm">{interview.location || interview.meetingLink || "—"}</p>
                    {interview.notes ? (
                      <p className="mt-2 text-sm text-muted-foreground">{interview.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditInterview(interview)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setDeleteInterview(interview)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Status Notes</CardTitle>
            <Button size="sm" onClick={() => setNoteOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {job.notes.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              job.notes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/10 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <p className="text-sm">{note.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Created {formatDateTime(note.createdAt)}
                      {note.updatedAt !== note.createdAt
                        ? ` · Updated ${formatDateTime(note.updatedAt)}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditNote(note)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => setDeleteNote(note)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <AppModal open={editOpen} onOpenChange={setEditOpen} title="Edit Job Application">
        <JobApplicationForm
          hideCompanySelect
          defaultValues={{
            companyId: job.companyId,
            jobId: job.jobId ?? "",
            roleName: job.roleName,
            applicationUrl: job.applicationUrl ?? "",
            appliedThrough: job.appliedThrough ?? "",
            mailId: job.mailId ?? "",
            appliedDate: job.appliedDate.slice(0, 10),
            currentStatus: job.currentStatus as JobApplicationFormValues["currentStatus"],
          }}
          loading={updateMutation.isPending}
          onSubmit={async (values) => updateMutation.mutateAsync(values)}
          submitLabel="Update Application"
        />
      </AppModal>

      <AppModal open={salaryOpen} onOpenChange={setSalaryOpen} title="Salary Tracking">
        <JobSalariesForm
          defaultValues={{
            expectedSalary: job.expectedSalary,
            currentSalary: job.currentSalary,
            negotiatedSalary: job.negotiatedSalary,
            offeredSalary: job.offeredSalary,
            companyStandardSalary: job.companyStandardSalary,
          }}
          loading={salaryMutation.isPending}
          onSubmit={async (values) => salaryMutation.mutateAsync(values)}
        />
      </AppModal>

      <AppModal open={interviewOpen} onOpenChange={setInterviewOpen} title="Schedule Interview">
        <InterviewForm
          loading={createInterviewMutation.isPending}
          onSubmit={async (values) => createInterviewMutation.mutateAsync(values)}
        />
      </AppModal>

      <AppModal open={Boolean(editInterview)} onOpenChange={() => setEditInterview(null)} title="Edit Interview">
        {editInterview ? (
          <InterviewForm
            defaultValues={{
              interviewDate: editInterview.interviewDate.slice(0, 10),
              interviewTime: editInterview.interviewTime ?? "",
              mode: editInterview.mode as InterviewFormValues["mode"],
              location: editInterview.location ?? "",
              interviewer: editInterview.interviewer ?? "",
              meetingLink: editInterview.meetingLink ?? "",
              notes: editInterview.notes ?? "",
            }}
            loading={updateInterviewMutation.isPending}
            onSubmit={async (values) =>
              updateInterviewMutation.mutateAsync({ id: editInterview.id, values })
            }
            submitLabel="Update Interview"
          />
        ) : null}
      </AppModal>

      <AppModal open={noteOpen} onOpenChange={setNoteOpen} title="Add Note">
        <JobNoteForm
          loading={createNoteMutation.isPending}
          onSubmit={async (values) => createNoteMutation.mutateAsync(values)}
        />
      </AppModal>

      <AppModal open={Boolean(editNote)} onOpenChange={() => setEditNote(null)} title="Edit Note">
        {editNote ? (
          <JobNoteForm
            defaultValues={{ content: editNote.content }}
            loading={updateNoteMutation.isPending}
            onSubmit={async (values) => updateNoteMutation.mutateAsync({ id: editNote.id, values })}
            submitLabel="Update Note"
          />
        ) : null}
      </AppModal>

      <ConfirmDialog
        open={Boolean(deleteInterview)}
        onOpenChange={() => setDeleteInterview(null)}
        title="Delete interview?"
        description="This interview will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteInterview && deleteInterviewMutation.mutate(deleteInterview.id)}
        loading={deleteInterviewMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteNote)}
        onOpenChange={() => setDeleteNote(null)}
        title="Delete note?"
        description="This note will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteNote && deleteNoteMutation.mutate(deleteNote.id)}
        loading={deleteNoteMutation.isPending}
      />

      <ConfirmDialog
        open={deleteJobOpen}
        onOpenChange={setDeleteJobOpen}
        title="Delete job application?"
        description="This application and all related history will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteJobMutation.mutate()}
        loading={deleteJobMutation.isPending}
      />
    </>
  );
}
