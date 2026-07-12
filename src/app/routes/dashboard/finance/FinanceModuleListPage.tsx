import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileDown, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEMO_FINANCE_DELETE_MESSAGE } from "@/app/lib/finance/constants";
import {
  FINANCE_MODULE_CONFIG,
  type FinanceModuleKey,
} from "@/app/lib/finance/moduleConfig";
import type { FinanceRecord } from "@/app/lib/finance/types";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { StatCard } from "@/app/components/Dashboard/StatCard";
import { EmiFlyoutForm } from "@/app/components/Forms/EmiFlyoutForm";
import { RentFlyoutForm } from "@/app/components/Forms/RentFlyoutForm";
import { SubscriptionFlyoutForm } from "@/app/components/Forms/SubscriptionFlyoutForm";
import { AppModal } from "@/app/components/Modal/AppModal";
import { FinancePrintModal } from "@/app/components/Finance/FinancePrintModal";
import { FinanceRecordListCard } from "@/app/components/Finance/FinanceRecordListCard";
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
import { AlertCircle, CheckCircle2, Clock, Wallet } from "lucide-react";
const PAGE_SIZE = 10;

const MODULE_API = {
  EMI: {
    list: api.getEmiRecords,
    create: api.createEmi,
    update: api.updateEmi,
    delete: api.deleteEmi,
    apiPath: "emi",
  },
  Rent: {
    list: api.getRentRecords,
    create: api.createRent,
    update: api.updateRent,
    delete: api.deleteRent,
    apiPath: "rent",
  },
  Subscription: {
    list: api.getSubscriptionRecords,
    create: api.createSubscription,
    update: api.updateSubscription,
    delete: api.deleteSubscription,
    apiPath: "subscriptions",
  },
} as const;

interface FinanceModuleListPageProps {  moduleKey: FinanceModuleKey;
}

export function FinanceModuleListPage({ moduleKey }: FinanceModuleListPageProps) {
  const config = FINANCE_MODULE_CONFIG[moduleKey];
  const moduleApi = MODULE_API[moduleKey];
  const queryClient = useQueryClient();
  const { canDelete } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<FinanceRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<FinanceRecord | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    window.clearTimeout((window as unknown as { __finSearchTimer?: number }).__finSearchTimer);
    (window as unknown as { __finSearchTimer?: number }).__finSearchTimer = window.setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["finance", config.queryKey, debouncedSearch, status, page],
    queryFn: () =>
      moduleApi.list({
        search: debouncedSearch || undefined,
        status: status === "All" ? undefined : status,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["finance"] });
  };

  const createMutation = useMutation({
    mutationFn: moduleApi.create,
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast.success(`${config.singular} added`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) => moduleApi.update(id, body),
    onSuccess: () => {
      invalidate();
      setEditRecord(null);
      toast.success(`${config.singular} updated`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: moduleApi.delete,
    onSuccess: () => {
      invalidate();
      setDeleteRecord(null);
      toast.success(`${config.singular} deleted`);
    },
    onError: (e: Error) => {
      if (e instanceof ApiClientError && e.status === 403) {
        toast.error(DEMO_FINANCE_DELETE_MESSAGE);
        return;
      }
      toast.error(e.message);
    },
  });

  const items = data?.items ?? [];
  const stats = data?.stats;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const renderForm = (mode: "create" | "edit") => {
    const loading = mode === "create" ? createMutation.isPending : updateMutation.isPending;
    const onSubmit = async (values: unknown) => {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (editRecord) {
        await updateMutation.mutateAsync({ id: editRecord.id, body: values });
      }
    };

    if (moduleKey === "EMI") {
      return (
        <EmiFlyoutForm
          loading={loading}
          onSubmit={onSubmit}
          submitLabel={mode === "create" ? `Add ${config.singular}` : "Save Changes"}
          defaultValues={
            editRecord
              ? {
                  name: editRecord.name,
                  totalAmount: editRecord.totalAmount ?? 0,
                  emiAmount: editRecord.amount,
                  totalMonths: editRecord.totalMonths ?? 12,
                  startDate: editRecord.startDate?.slice(0, 10) ?? "",
                  dueDay: editRecord.dueDay ?? 1,
                  notes: editRecord.notes ?? "",
                }
              : undefined
          }
        />
      );
    }

    if (moduleKey === "Rent") {
      return (
        <RentFlyoutForm
          loading={loading}
          onSubmit={onSubmit}
          submitLabel={mode === "create" ? `Add ${config.singular}` : "Save Changes"}
          defaultValues={
            editRecord
              ? {
                  name: editRecord.name,
                  monthlyAmount: editRecord.amount,
                  dueDay: editRecord.dueDay ?? 1,
                  notes: editRecord.notes ?? "",
                }
              : undefined
          }
        />
      );
    }

    return (
      <SubscriptionFlyoutForm
        loading={loading}
        onSubmit={onSubmit}
        submitLabel={mode === "create" ? `Add ${config.singular}` : "Save Changes"}
        defaultValues={
          editRecord
            ? {
                serviceName: editRecord.name,
                websiteUrl: editRecord.websiteUrl ?? "",
                monthlyCost: editRecord.amount,
                billingCycle: (editRecord.billingCycle as "Monthly") ?? "Monthly",
                renewalDate: editRecord.renewalDate?.slice(0, 10) ?? "",
                autoRenew: editRecord.autoRenew,
                category: editRecord.category ?? "Development",
                notes: editRecord.notes ?? "",
              }
            : undefined
        }
      />
    );
  };

  return (
    <>
      <DashboardHeader
        title={config.label}
        description={`Manage ${config.label.toLowerCase()} records, payments, and reports.`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setPrintOpen(true)}>
              <FileDown className="mr-1.5 h-4 w-4" />
              Print PDF
            </Button>
            <Button variant="sreeDev" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add {config.singular}
            </Button>
          </>
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        {stats && (
          <section className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="Total Records"
              value={stats.total}
              displayValue={String(stats.total)}
              icon={Wallet}
            />
            <StatCard
              label="Overdue"
              value={stats.overdue}
              displayValue={String(stats.overdue)}
              icon={AlertCircle}
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              displayValue={String(stats.pending)}
              icon={Clock}
            />
            <StatCard
              label="Paid"
              value={stats.paid}
              displayValue={String(stats.paid)}
              icon={CheckCircle2}
            />
          </section>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${config.label.toLowerCase()}...`}
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dashboard-surface-card h-64 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={`No ${config.label.toLowerCase()} yet`}
            description={`Add your first ${config.singular.toLowerCase()} to start tracking payments.`}
            actionLabel={`Add ${config.singular}`}
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((record) => (
                <FinanceRecordListCard
                  key={record.id}
                  record={record}
                  moduleKey={moduleKey}
                  canDelete={canDelete}
                  onEdit={() => setEditRecord(record)}
                  onDelete={() => setDeleteRecord(record)}
                />
              ))}
            </div>

            {totalPages > 1 && (              <Pagination>
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
            )}
          </>
        )}
      </main>

      <AppModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={`Add ${config.singular}`}
        className="sm:max-w-xl"
      >
        {renderForm("create")}
      </AppModal>

      <AppModal
        open={!!editRecord}
        onOpenChange={(open) => !open && setEditRecord(null)}
        title={`Edit ${config.singular}`}
        className="sm:max-w-xl"
      >
        {editRecord && renderForm("edit")}
      </AppModal>

      <ConfirmDialog
        open={!!deleteRecord}
        onOpenChange={(open) => !open && setDeleteRecord(null)}
        title={`Delete ${config.singular}?`}
        description="This will permanently remove the record and its payment history."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteRecord && deleteMutation.mutate(deleteRecord.id)}
      />

      <FinancePrintModal
        open={printOpen}
        onOpenChange={setPrintOpen}
        modulePath={moduleApi.apiPath}
        title={`Print ${config.label} Report`}
      />
    </>
  );
}
