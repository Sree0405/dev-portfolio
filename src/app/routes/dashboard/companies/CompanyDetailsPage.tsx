import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEMO_COMPANY_WRITE_MESSAGE } from "@/app/lib/types";
import { formatDate } from "@/app/lib/format";
import type { CompanyContact } from "@/app/lib/jobTracker/types";
import type { CompanyContactFormValues, CompanyFormValues, JobApplicationFormValues } from "@/app/lib/validation";
import { CardSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { StatusBadge } from "@/app/components/Common/StatusBadge";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { CompanyForm } from "@/app/components/Forms/CompanyForm";
import { CompanyContactForm } from "@/app/components/Forms/CompanyContactForm";
import { JobApplicationForm } from "@/app/components/Forms/JobApplicationForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

function InfoItem({
  label,
  value,
  href,
}: {
  label: string;
  value: React.ReactNode;
  href?: string | null;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 break-all text-sm font-medium text-primary hover:underline"
        >
          {value}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <p className="mt-2 break-words text-sm font-medium text-foreground">{value || "—"}</p>
      )}
    </div>
  );
}

export default function CompanyDetailsPage() {
  const { companyId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canWriteCompanies } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editContact, setEditContact] = useState<CompanyContact | null>(null);
  const [deleteContact, setDeleteContact] = useState<CompanyContact | null>(null);

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => api.getCompany(companyId),
    enabled: Boolean(companyId),
  });

  const { data: filterOptions } = useQuery({
    queryKey: ["company-filters"],
    queryFn: api.getCompanyFilters,
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["company", companyId] });
    queryClient.invalidateQueries({ queryKey: ["companies"] });
    queryClient.invalidateQueries({ queryKey: ["company-filters"] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const handleWriteError = (error: Error) => {
    if (error instanceof ApiClientError && error.status === 403) {
      toast.error(DEMO_COMPANY_WRITE_MESSAGE);
      return;
    }
    toast.error(error.message);
  };

  const updateMutation = useMutation({
    mutationFn: (values: CompanyFormValues) => api.updateCompany(companyId, values),
    onSuccess: () => {
      invalidate();
      setEditOpen(false);
      toast.success("Company updated");
    },
    onError: handleWriteError,
  });

  const toggleAppliedMutation = useMutation({
    mutationFn: (applied: boolean) => api.updateCompany(companyId, { applied }),
    onSuccess: () => {
      invalidate();
      toast.success("Applied status updated");
    },
    onError: handleWriteError,
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: () => api.deleteCompany(companyId),
    onSuccess: () => {
      toast.success("Company deleted");
      navigate("/dashboard/companies");
    },
    onError: handleWriteError,
  });

  const createContactMutation = useMutation({
    mutationFn: (values: CompanyContactFormValues) => api.createCompanyContact(companyId, values),
    onSuccess: () => {
      invalidate();
      setContactOpen(false);
      toast.success("Contact added");
    },
    onError: handleWriteError,
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CompanyContactFormValues }) =>
      api.updateCompanyContact(id, values),
    onSuccess: () => {
      invalidate();
      setEditContact(null);
      toast.success("Contact updated");
    },
    onError: handleWriteError,
  });

  const deleteContactMutation = useMutation({
    mutationFn: api.deleteCompanyContact,
    onSuccess: () => {
      invalidate();
      setDeleteContact(null);
      toast.success("Contact deleted");
    },
    onError: handleWriteError,
  });

  const createJobMutation = useMutation({
    mutationFn: (values: JobApplicationFormValues) => api.createCompanyJob(companyId, values),
    onSuccess: () => {
      invalidate();
      setJobOpen(false);
      toast.success("Job application created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Company" />
        <main className="p-4 md:p-8">
          <CardSkeleton />
        </main>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <DashboardHeader title="Company not found" />
        <main className="p-4 md:p-8">
          <Button asChild variant="outline">
            <Link to="/dashboard/companies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Link>
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={company.name}
        description="Company details, HR contacts, and job applications."
        actions={
          canWriteCompanies ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          ) : undefined
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link to="/dashboard/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-base">Company Information</CardTitle>
              <div className="flex flex-wrap gap-2">
                {company.applied ? <Badge>Applied</Badge> : <Badge variant="outline">Not Applied</Badge>}
                {company.productCategory ? <Badge variant="secondary">{company.productCategory}</Badge> : null}
                {company.companyType ? <Badge variant="outline">{company.companyType}</Badge> : null}
                {company.companySize ? <Badge variant="outline">{company.companySize}</Badge> : null}
              </div>
            </div>
            {canWriteCompanies ? (
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 px-3 py-2">
                <span className="text-sm text-muted-foreground">Applied</span>
                <Switch
                  checked={company.applied}
                  disabled={toggleAppliedMutation.isPending}
                  onCheckedChange={(checked) => toggleAppliedMutation.mutate(checked)}
                />
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="LinkedIn" value={company.linkedinUrl || "—"} href={company.linkedinUrl} />
            <InfoItem label="Careers URL" value={company.careersUrl || "—"} href={company.careersUrl} />
            <InfoItem label="Type" value={company.companyType} />
            <InfoItem label="Category" value={company.productCategory} />
            <InfoItem label="Company Size" value={company.companySize} />
            <InfoItem label="Headquarters" value={company.headquarters} />
            <InfoItem label="Office Location" value={company.officeLocation} />
            <InfoItem label="HR Contact" value={company.hrContact} />
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">HR Contacts</CardTitle>
            {canWriteCompanies ? (
              <Button size="sm" className="w-full sm:w-auto" onClick={() => setContactOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {company.contacts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No HR contacts yet.</p>
            ) : (
              company.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/10 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.designation || "—"}</p>
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="mt-2 block break-all text-sm text-primary hover:underline">
                        {contact.email}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm">—</p>
                    )}
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="block text-sm text-primary hover:underline">
                        {contact.phone}
                      </a>
                    ) : (
                      <p className="text-sm">—</p>
                    )}
                    {contact.notes ? (
                      <p className="mt-2 text-sm text-muted-foreground">{contact.notes}</p>
                    ) : null}
                  </div>
                  {canWriteCompanies ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditContact(contact)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteContact(contact)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Job Applications</CardTitle>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => setJobOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Application
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.jobApplications.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              company.jobApplications.map((job) => (
                <Link
                  key={job.id}
                  to={`/dashboard/job-status/${job.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-border/50 bg-muted/10 px-4 py-3 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{job.roleName}</p>
                    <p className="text-xs text-muted-foreground">Applied {formatDate(job.appliedDate)}</p>
                  </div>
                  <StatusBadge status={job.currentStatus} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <AppModal open={editOpen} onOpenChange={setEditOpen} title="Edit Company">
        <CompanyForm
          categoryOptions={filterOptions?.categories}
          typeOptions={filterOptions?.companyTypes}
          sizeOptions={filterOptions?.companySizes}
          defaultValues={{
            name: company.name,
            linkedinUrl: company.linkedinUrl ?? "",
            careersUrl: company.careersUrl ?? "",
            companyType: company.companyType ?? "",
            productCategory: company.productCategory ?? "",
            companySize: company.companySize ?? "",
            headquarters: company.headquarters ?? "",
            officeLocation: company.officeLocation ?? "",
            applied: company.applied,
            hrContact: company.hrContact ?? "",
          }}
          loading={updateMutation.isPending}
          onSubmit={async (values) => updateMutation.mutateAsync(values)}
          submitLabel="Update Company"
        />
      </AppModal>

      <AppModal open={contactOpen} onOpenChange={setContactOpen} title="Add HR Contact">
        <CompanyContactForm
          loading={createContactMutation.isPending}
          onSubmit={async (values) => createContactMutation.mutateAsync(values)}
        />
      </AppModal>

      <AppModal open={Boolean(editContact)} onOpenChange={() => setEditContact(null)} title="Edit Contact">
        {editContact ? (
          <CompanyContactForm
            defaultValues={{
              name: editContact.name,
              designation: editContact.designation ?? "",
              email: editContact.email ?? "",
              phone: editContact.phone ?? "",
              notes: editContact.notes ?? "",
            }}
            loading={updateContactMutation.isPending}
            onSubmit={async (values) =>
              updateContactMutation.mutateAsync({ id: editContact.id, values })
            }
            submitLabel="Update Contact"
          />
        ) : null}
      </AppModal>

      <AppModal open={jobOpen} onOpenChange={setJobOpen} title="Create Job Application">
        <JobApplicationForm
          hideCompanySelect
          defaultValues={{ companyId }}
          loading={createJobMutation.isPending}
          onSubmit={async (values) => createJobMutation.mutateAsync(values)}
        />
      </AppModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete company?"
        description="This will permanently delete the company and all related job applications."
        confirmLabel="Delete"
        onConfirm={() => deleteCompanyMutation.mutate()}
        loading={deleteCompanyMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteContact)}
        onOpenChange={() => setDeleteContact(null)}
        title="Delete contact?"
        description="This contact will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteContact && deleteContactMutation.mutate(deleteContact.id)}
        loading={deleteContactMutation.isPending}
      />
    </>
  );
}
