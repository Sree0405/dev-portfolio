export interface FinanceReportRow {
  date: string;
  periodLabel?: string | null;
  type: string;
  name: string;
  amount: number;
  status: string;
  reference?: string | null;
  notes?: string | null;
}

export interface FinanceReportSummary {
  totalRecords: number;
  totalPaid: number;
  pendingPayments: number;
  averagePayment: number;
  highestPayment: number;
  lowestPayment: number;
  monthlyBreakdown?: { label: string; amount: number }[];
}

export interface FinanceReportDetailInfo {
  name: string;
  amount: number;
  status: string;
  dueDay?: number | null;
  dueDate?: string | null;
  category?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  totalPaid: number;
  totalRemaining: number;
  paymentsCompleted: number;
  paymentsPending: number;
}

/** Shared input for FinanceReportTemplate — all finance PDFs use this shape. */
export interface FinanceReportTemplateInput {
  title: string;
  module: string;
  periodLabel: string;
  from: string;
  to: string;
  reportId: string;
  generatedDate: string;
  generatedTime: string;
  rows: FinanceReportRow[];
  summary: FinanceReportSummary;
  detailInfo?: FinanceReportDetailInfo;
}
