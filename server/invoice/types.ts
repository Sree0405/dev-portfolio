export interface InvoicePayment {
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  reference: string | null;
  notes: string | null;
}

export interface InvoiceNote {
  createdAt: string;
  content: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  generatedDate: string;
  project: {
    name: string;
    clientName: string;
    clientNumber: string | null;
    projectLinks: string[];
    projectType: string;
    status: string;
    plannedAmount: number;
    totalPaid: number;
    remainingAmount: number;
    createdAt: string;
    updatedAt: string;
  };
  payments: InvoicePayment[];
  notes: InvoiceNote[];
  paymentStatus: "Paid" | "Partially Paid";
}
