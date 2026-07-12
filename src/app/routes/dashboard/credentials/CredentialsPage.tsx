import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Eye, EyeOff, Info, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { CREDENTIAL_CATEGORIES } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/format";
import {
  DEMO_CREDENTIAL_DELETE_MESSAGE,
  type Credential,
} from "@/app/lib/types";
import type { CredentialFormValues } from "@/app/lib/validation";
import {
  CredentialListCard,
  ServiceLogo,
} from "@/app/components/Common/CredentialListCard";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { CopyButton } from "@/app/components/Common/CopyButton";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { CredentialForm } from "@/app/components/Forms/CredentialForm";
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
import { cn } from "@/lib/utils";

const GLASS_MODAL_CLASS =
  "sm:max-w-xl border border-white/10 bg-background/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

export default function CredentialsPage() {
  const queryClient = useQueryClient();
  const { canDelete, isDemo } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [editCredential, setEditCredential] = useState<Credential | null>(null);
  const [viewCredential, setViewCredential] = useState<Credential | null>(null);
  const [deleteCredential, setDeleteCredential] = useState<Credential | null>(null);
  const [viewPasswordVisible, setViewPasswordVisible] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    window.clearTimeout((window as unknown as { __credSearchTimer?: number }).__credSearchTimer);
    (window as unknown as { __credSearchTimer?: number }).__credSearchTimer = window.setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["credentials", debouncedSearch, category],
    queryFn: () =>
      api.getCredentials({
        search: debouncedSearch,
        category: category === "All" ? undefined : category,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["credentials"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const createMutation = useMutation({
    mutationFn: api.createCredential,
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast.success("Credential added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CredentialFormValues }) =>
      api.updateCredential(id, values),
    onSuccess: () => {
      invalidate();
      setEditCredential(null);
      toast.success("Credential updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCredential,
    onSuccess: () => {
      invalidate();
      setDeleteCredential(null);
      toast.success("Credential deleted");
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        toast.error(DEMO_CREDENTIAL_DELETE_MESSAGE);
        return;
      }
      toast.error(error.message);
    },
  });

  const credentials = data?.items ?? [];

  return (
    <>
      <DashboardHeader
        title="Credentials"
        description="Secure vault for development and service logins."
        actions={
          <Button variant="sreeDev" onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Credential
          </Button>
        }
      />

      <main className="min-w-0 flex-1 space-y-4 p-4 md:space-y-6 md:p-8">
        {isDemo && (
          <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Demo Credentials</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                The credentials shown on this page are completely fictional and exist only to
                demonstrate the Credential Management module. No real usernames, passwords, or
                sensitive information are stored or exposed in the demo environment.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by service, URL, username, or category..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CREDENTIAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
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
        ) : credentials.length === 0 ? (
          <EmptyState
            title="No credentials yet"
            description={
              debouncedSearch || category !== "All"
                ? "No credentials match your search or filter."
                : "Add your first service login to start building your secure vault."
            }
            actionLabel="Add Credential"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {credentials.map((credential) => (
              <CredentialListCard
                key={credential.id}
                credential={credential}
                canDelete={canDelete}
                onView={setViewCredential}
                onEdit={setEditCredential}
                onDelete={setDeleteCredential}
              />
            ))}
          </div>
        )}
      </main>

      <AppModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Credential"
        description="Store a new service login in your secure vault."
        className={GLASS_MODAL_CLASS}
      >
        <CredentialForm
          loading={createMutation.isPending}
          submitLabel="Add Credential"
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
        />
      </AppModal>

      <AppModal
        open={!!editCredential}
        onOpenChange={(open) => !open && setEditCredential(null)}
        title="Edit Credential"
        description="Update service login details."
        className={GLASS_MODAL_CLASS}
      >
        {editCredential && (
          <CredentialForm
            key={editCredential.id}
            loading={updateMutation.isPending}
            submitLabel="Save Changes"
            defaultValues={{
              serviceName: editCredential.serviceName,
              websiteUrl: editCredential.websiteUrl,
              username: editCredential.username,
              password: editCredential.password,
              category: editCredential.category as CredentialFormValues["category"],
              notes: editCredential.notes ?? "",
            }}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync({ id: editCredential.id, values });
            }}
          />
        )}
      </AppModal>

      <AppModal
        open={!!viewCredential}
        onOpenChange={(open) => {
          if (!open) {
            setViewCredential(null);
            setViewPasswordVisible(false);
          }
        }}
        title={viewCredential?.serviceName ?? "Credential Details"}
        description="Full credential details and quick actions."
        className={cn(GLASS_MODAL_CLASS, "sm:max-w-lg")}
      >
        {viewCredential && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ServiceLogo url={viewCredential.websiteUrl} name={viewCredential.serviceName} />
              <div>
                <p className="font-semibold">{viewCredential.serviceName}</p>
                <Badge variant="secondary" className="mt-1">
                  {viewCredential.category}
                </Badge>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                { label: "Website URL", value: viewCredential.websiteUrl, copy: true },
                { label: "Username", value: viewCredential.username, copy: true },
              ].map((field) => (
                <div key={field.label} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1 flex items-center justify-between gap-2">
                    <span className="break-all font-medium">{field.value}</span>
                    {field.copy && <CopyButton value={field.value} label={field.label} />}
                  </dd>
                </div>
              ))}

              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <dt className="text-xs text-muted-foreground">Password</dt>
                <dd className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono">
                    {viewPasswordVisible ? viewCredential.password : "••••••••••••"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewPasswordVisible((v) => !v)}
                    >
                      {viewPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <CopyButton value={viewCredential.password} label="password" />
                  </div>
                </dd>
              </div>

              {viewCredential.notes && (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm">{viewCredential.notes}</dd>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm">{formatDate(viewCredential.createdAt)}</dd>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <dt className="text-xs text-muted-foreground">Updated</dt>
                  <dd className="mt-1 text-sm">{formatDate(viewCredential.updatedAt)}</dd>
                </div>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="sreeDev" asChild>
                <a href={viewCredential.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Website
                </a>
              </Button>
              <CopyButton value={viewCredential.username} label="username" variant="outline" size="sm" />
              <CopyButton value={viewCredential.password} label="password" variant="outline" size="sm" />
            </div>
          </div>
        )}
      </AppModal>

      <ConfirmDialog
        open={!!deleteCredential}
        onOpenChange={(open) => !open && setDeleteCredential(null)}
        title="Delete credential?"
        description={`This will permanently remove the ${deleteCredential?.serviceName ?? "credential"} entry from your vault.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteCredential) {
            deleteMutation.mutate(deleteCredential.id);
          }
        }}
      />
    </>
  );
}
