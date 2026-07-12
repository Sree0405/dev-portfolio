import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { formatCurrency, formatDate, formatDateTime } from "@/app/lib/format";
import { FINANCE_MODULE_CONFIG, type FinanceModuleKey } from "@/app/lib/finance/moduleConfig";
import type { MarkPaidFormValues } from "@/app/lib/validation";
import { CardSkeleton, TableSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { StatCard } from "@/app/components/Dashboard/StatCard";
import { FinanceProgressBar } from "@/app/components/Finance/FinanceProgressBar";
import { FinanceStatusBadge } from "@/app/components/Finance/FinanceStatusBadge";
import { MarkPaidModal } from "@/app/components/Finance/MarkPaidModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PATH_TO_MODULE: Record<string, FinanceModuleKey> = {
  emi: "EMI",
  rent: "Rent",
  subscriptions: "Subscription",
};

const MODULE_API = {
  EMI: {
    get: api.getEmiRecord,
    markPaid: api.markEmiPaid,
    apiPath: "emi",
  },
  Rent: {
    get: api.getRentRecord,
    markPaid: api.markRentPaid,
    apiPath: "rent",
  },
  Subscription: {
    get: api.getSubscriptionRecord,
    markPaid: api.markSubscriptionPaid,
    apiPath: "subscriptions",
  },
} as const;

export default function FinanceRecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [markPaidOpen, setMarkPaidOpen] = useState(false);

  const pathSegment = location.pathname.split("/")[3] ?? "";
  const moduleKey = PATH_TO_MODULE[pathSegment];
  const config = moduleKey ? FINANCE_MODULE_CONFIG[moduleKey] : null;
  const moduleApi = moduleKey ? MODULE_API[moduleKey] : null;

  const { data: record, isLoading, isError, refetch } = useQuery({
    queryKey: ["finance", config?.queryKey, id],
    queryFn: () => moduleApi!.get(id!),
    enabled: !!id && !!moduleApi,
  });

  const markPaidMutation = useMutation({
    mutationFn: (values: MarkPaidFormValues) =>
      moduleApi!.markPaid(id!, {
        amount: values.amount,
        paidDate: values.paidDate,
        notes: values.notes || null,
        transactionReference: values.transactionReference || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      setMarkPaidOpen(false);
      toast.success("Payment recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handlePrint = async () => {
    if (!moduleApi || !id) return;
    try {
      await api.downloadFinanceRecordPdf(moduleApi.apiPath, id);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF");
    }
  };

  if (!config || !moduleApi || !id) {
    return (
      <main className="p-8">
        <EmptyState
          title="Record not found"
          description="Invalid finance record URL."
          actionLabel="Back to Finance"
          onAction={() => navigate("/dashboard/finance")}
        />
      </main>
    );
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader title={config.singular} />
        <main className="space-y-4 p-4 md:p-8">
          <CardSkeleton />
          <TableSkeleton rows={5} columns={6} />
        </main>
      </>
    );
  }

  if (isError || !record) {
    return (
      <main className="p-8">
        <EmptyState
          title="Unable to load record"
          description="The record may have been removed."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </main>
    );
  }

  const summary = record.paymentSummary;
  const sortedPayments = [...record.payments].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );

  return (
    <>
      <DashboardHeader
        title={record.name}
        description={`${config.singular} details and payment history`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to={config.routeBase}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <FileDown className="mr-1.5 h-4 w-4" />
              Print PDF
            </Button>
            <Button variant="sreeDev" size="sm" onClick={() => setMarkPaidOpen(true)}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Mark as Paid
            </Button>
          </>
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <section className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Total Paid"
            value={summary.totalPaid}
            displayValue={formatCurrency(summary.totalPaid)}
            icon={CheckCircle2}
          />
          <StatCard
            label="Total Remaining"
            value={summary.totalRemaining}
            displayValue={formatCurrency(summary.totalRemaining)}
            icon={CheckCircle2}
          />
          <StatCard
            label="Current Month"
            value={0}
            displayValue={summary.currentMonthStatus}
            icon={CheckCircle2}
          />
          <StatCard
            label="Next Due"
            value={0}
            displayValue={summary.nextDue ? formatDate(summary.nextDue) : "—"}
            icon={CheckCircle2}
          />
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="dashboard-surface-card">
            <CardHeader>
              <CardTitle className="text-base">Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <InfoRow label="Name" value={record.name} />
              <InfoRow label="Amount" value={formatCurrency(record.amount)} />
              <InfoRow label="Status" value={<FinanceStatusBadge status={record.status} />} />
              <InfoRow
                label="Due Date"
                value={record.dueDate ? formatDate(record.dueDate) : "—"}
              />
              <InfoRow
                label="Next Due"
                value={record.nextDue ? formatDate(record.nextDue) : "—"}
              />
              <InfoRow label="Category" value={record.category ?? record.moduleType} />
              <InfoRow label="Notes" value={record.notes || "—"} className="sm:col-span-2" />
              <InfoRow label="Created" value={formatDateTime(record.createdAt)} />
              <InfoRow label="Updated" value={formatDateTime(record.updatedAt)} />
              {record.moduleType === "EMI" && (
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    EMI Progress
                  </p>
                  <FinanceProgressBar value={record.progress ?? 0} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-surface-card">
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <InfoRow label="Total Paid" value={formatCurrency(summary.totalPaid)} />
              <InfoRow label="Total Remaining" value={formatCurrency(summary.totalRemaining)} />
              <InfoRow label="Current Month Status" value={summary.currentMonthStatus} />
              <InfoRow
                label="Next Due"
                value={summary.nextDue ? formatDate(summary.nextDue) : "—"}
              />
              <InfoRow label="Payments Completed" value={String(summary.paymentsCompleted)} />
              <InfoRow label="Payments Pending" value={String(summary.paymentsPending)} />
            </CardContent>
          </Card>
        </div>

        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle className="text-base">Payment Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sortedPayments.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                No payment history yet.
              </p>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                      <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Created By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.paidDate
                            ? formatDate(payment.paidDate)
                            : formatDate(payment.dueDate)}
                        </TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <FinanceStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                          {payment.notes || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {payment.transactionReference || payment.transactionId || "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {payment.createdBy || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MarkPaidModal
        open={markPaidOpen}
        onOpenChange={setMarkPaidOpen}
        defaultAmount={record.amount}
        loading={markPaidMutation.isPending}
        onSubmit={async (values) => {
          await markPaidMutation.mutateAsync(values);
        }}
      />
    </>
  );
}

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
